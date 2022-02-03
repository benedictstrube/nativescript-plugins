import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isAndroid, isIOS, TouchGestureEventData, WebView } from '@nativescript/core';
import { WebViewInterface } from 'nativescript-webview-interface';
import { WebViewConfig } from './ns-webview-interface';
import {
  ChartLoadedEventData,
  EventToChart,
  HighchartsAPI,
  HighchartsConfig
} from '@benedictstrube/highcharts-wrapper';

@Component({
  selector: 'HighchartsWrapper',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, OnDestroy, HighchartsAPI {
  get config(): HighchartsConfig {
    return this._config;
  }

  @Input()
  set config(value: HighchartsConfig) {
    this._config = value;

    // recreate webview interface with new event config
    this.createWebViewInterface();

    // rerender chart with new options
    this.renderSubject.next();
  }

  /* ---------------------------- ui properties ---------------------------- */

  @ViewChild('container', { static: true }) container: ElementRef;

  /* ---------------------------- inputs ---------------------------- */

  @Input() height = 200;

  private _config: HighchartsConfig;

  /* ---------------------------- events ---------------------------- */

  @Output()
  onChartReady: EventEmitter<ChartLoadedEventData> = new EventEmitter<ChartLoadedEventData>();

  /* ---------------------------- private stuff ---------------------------- */

  private loading = false;
  private initialized = false;
  private renderSubject = new ReplaySubject<void>(1);
  private webview: WebView;
  private webViewInterface: WebViewInterface;

  /* ---------------------------- lifecycle methods ---------------------------- */

  constructor(private vcRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    // listen to render subject
    this.renderSubject
      .asObservable()
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.render();
      }, (error) => {
        console.log(error);
      });

    // emit loaded event
    this.onChartReady.next({ chartApi: this });
  }

  ngOnDestroy(): void {
    this.renderSubject.complete();
  }

  /* ---------------------------- API ---------------------------- */

  rerender() {
    this.renderSubject.next();
  }

  emitEvent(event: EventToChart, data: any) {
    this.webViewInterface?.emit(event, data);
  }

  /* ---------------------------- public ui methods ---------------------------- */

  onWebViewLoaded(webargs) {
    this.webview = webargs.object as WebView;

    // initialisation on android
    if (isAndroid) {
      this.webview.android.getSettings()
        .setDisplayZoomControls(false);
      this.webview.android.getSettings()
        .setLoadWithOverviewMode(true);
      this.webview.android.setBackgroundColor(0x00000000);
      // FIXME: uncomment this.webview.android.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
    }

    // initialisation on ios
    if (isIOS) {
      // FIXME: uncomment this.webview.ios.backgroundColor = UIColor.clearColor
      this.webview.ios.opaque = false;
      this.webview.ios.scrollView.bounces = false;
      this.webview.ios.scrollView.scrollEnabled = false;
      this.webview.ios.scrollView.minimumZoomScale = 1.0;
      this.webview.ios.scrollView.maximumZoomScale = 1.0;
      this.webview.ios.scalesPageToFit = false;
    }

    // webview is initialised
    this.initialized = true;

    // re-render if layout of webview changes
    this.webview.on('layoutChanged', () => {
      this.renderSubject.next();
    });

    // render chart
    this.renderSubject.next();

    // create webview interface
    this.createWebViewInterface();
  }

  /* ---------------------------- private helpers ---------------------------- */

  private createWebViewInterface() {
    // check that we are initialised
    if (!this.webview || !this.config || !this.initialized) {
      return;
    }

    // destroy old webview interface if existent
    if (this.webViewInterface) {
      this.webViewInterface.destroy();
    }

    // create new one webview interface
    this.webViewInterface = new WebViewInterface(this.webview);

    // add every handler
    for (let handler of this.config?.externalEventListeners) {
      this.webViewInterface.on(handler.event, (data: any) => handler.action(data));
    }
  }

  /* ---------------------------- html creation methods ---------------------------- */

  private render() {
    if (!this.initialized) {
      return;
    }

    if (this.config) {
      this.webview.src = this.createHTML();
      this.loading = false;
    }
  }

  private stringifyWithFunctions(obj: any): string {
    // the functions we encounter
    const functions: Array<string> = [];
    // the placeholder to use for the functions
    const placeholder = '>>>F<<<';
    // regexp to match placeholder
    const placeholderRegExp = new RegExp(`"${placeholder}"`, 'g');

    // stringify options
    const options = JSON.stringify(this.config.options, (key, value) => {
      if (typeof value==='string' && value.startsWith('function')) {
        // push function
        functions.push(value.toString());
        // return placeholder to replace later
        return placeholder;
      }
      // otherwise everything as always
      return value;
    });

    // replace placeholder again
    return options.replace(placeholderRegExp, functions.shift.bind(functions));
  }

  private createHTML(): string {

    // set width and height automatically to webview
    this.config.options.chart = this.config.options.chart ?? {};
    this.config.options.chart.width = this.webview.getActualSize().width;
    this.config.options.chart.height = this.webview.getActualSize().height;

    const options = this.stringifyWithFunctions(this.config.options);

    // used names
    const oWebViewInterface = 'oWebViewInterface';
    const chart = 'chart';

    // convert event listeners to one string that can be used in our source
    const eventListenerString =
      this.config.innerEventListeners
        // first convert each event listener to a string
        .map((eventListener) => {
          return `${oWebViewInterface}.on("${eventListener.event}", (data) => { (${eventListener.action.toString()})(data, ${chart}); });`;
        })
        // then add them up
        .reduce((prev, curr) => `${prev}\n${curr}`, '');


    return `
    <html lang='en'>

    <head>
      <meta charset='utf-8' />
      <title></title>
      <!-- disable selecting text -->
      <style type='text/css'>* { -webkit-touch-callout: none; -webkit-user-select: none; }</style>
    </head>
    <body style='margin: 0; padding: 0;'>
      <!-- the containter for the chart -->
      <div
        id='chart'
        style='overflow: visible !important; margin: 0; padding: 0;'></div>

      <!-- all the highchart scripts needed -->
      <script src='https://code.highcharts.com/highcharts.js'></script>

      <!-- the script that loads the chart logic -->
      <script type='text/javascript'>
        // as soon as content loaded
        document.addEventListener('DOMContentLoaded', function () {
          // configure the webview interface
          ${WebViewConfig.WEB_VIEW_INTERFACE};

          (function () {
            // oWebViewInterface provides necessary APIs for communication to native app.
            var ${oWebViewInterface} = window.nsWebViewInterface;

            // initialisation function
            function init() {
              if (${oWebViewInterface}) {
                ${eventListenerString}

                ${oWebViewInterface}.on("hideTooltip", () => {
                    chart.tooltip.hide();
                    chart.xAxis[0].hideCrosshair();
                });
              }
            }

            // initialise
            init();
          })();

          // function that was declared above (do not rename) to process all kinds of events
          function emitEventFromChart(event, data) {
            var oWebViewInterface = window.nsWebViewInterface;

            if (oWebViewInterface) {
                oWebViewInterface.emit(event, data);
            }
          }

          // initialise chart
          var ${chart} = new Highcharts.chart("chart", ${options});
        });
      </script>
    </body>
  </html>
    `;
  }

  touch(event: TouchGestureEventData) {
    switch (event.action) {
      case 'up':
      case 'cancel':
        console.log('tooltip hide');
        setTimeout(() => {
          this.webViewInterface.emit('hideTooltip', null);
        }, 10);
        break;
    }
  }
}
