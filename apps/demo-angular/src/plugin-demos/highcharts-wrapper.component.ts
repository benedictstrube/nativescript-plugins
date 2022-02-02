import { Component, NgZone } from '@angular/core';
import { DemoSharedHighchartsWrapper } from '@demo/shared';
import { } from '@benedictstrube/highcharts-wrapper';

@Component({
	selector: 'demo-highcharts-wrapper',
	templateUrl: 'highcharts-wrapper.component.html',
})
export class HighchartsWrapperComponent {
  
  demoShared: DemoSharedHighchartsWrapper;
  
	constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedHighchartsWrapper();
  }

}