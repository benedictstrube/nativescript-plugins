import { Component, NgZone } from '@angular/core';
import { DemoSharedHighchartsWrapper } from '@demo/shared';
import {
  ChartLoadedEventData,
  HighchartsAPI,
  HighchartsConfig
} from '@benedictstrube/highcharts-wrapper';

@Component({
  selector: 'demo-highcharts-wrapper',
  templateUrl: 'highcharts-wrapper.component.html'
})
export class HighchartsWrapperComponent {

  value: number = 42.0;

  demoShared: DemoSharedHighchartsWrapper;

  private chartApi: HighchartsAPI;

  constructor(private _ngZone: NgZone) {
  }

  options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      margin: 0,
      spacing: 0,
      events: {
        load: `function () {
          emitEventFromChart("fromChartA", {
            test: "test"
          });
        }`
      }
    },
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    yAxis: {
      visible: true,
      gridLineWidth: 0,
      lineWidth: 0,
      plotLines: [{
        value: 29.9,
        color: 'white',
        dashStyle: 'LongDash',
        width: 0.5
      }]
    },

    xAxis: {
      visible: true,
      lineWidth: 0,
      gridLineWidth: 0,
      crosshair: {
        color: 'white',
        width: 1
      }
    },

    plotOptions: {
      series: {
        color: '#6BD578',
        states: {
          hover: {
            enabled: false
          },
          inactive: {
            enabled: false
          },
          select: {
            enabled: false
          }
        }
      },
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false
            }
          }
        },
        lineWidth: 1,
        point: {
          events: {
            mouseOver: `function () {
              setTimeout(() => {
                emitEventFromChart("selectedPoint", {
                  point: this.y
                })
              });
            }`
          }
        }
      }
    },

    credits: {
      enabled: false
    },

    tooltip: {
      enabled: false
    },

    series: [{
      data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 194.1, 95.6, 54.4, 12.3, 16.4, 10.2, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
  };

  config: HighchartsConfig = {
    options: this.options,
    innerEventListeners: [{
      event: 'toChartA',
      action: (data, chart) => {
        chart.setSize(10, 10);
      }
    }],
    externalEventListeners: [{
      event: 'fromChartA',
      action: (data) => {
        console.log(data);
      }
    }, {
      event: 'selectedPoint',
      action: (data) => {
        console.log(data);
        this.value = data.point;
      }
    }]
  };

  ngOnInit() {
    this.demoShared = new DemoSharedHighchartsWrapper();
  }

  loadedEvent(event: ChartLoadedEventData) {
    this.chartApi = event.chartApi
  }
}
