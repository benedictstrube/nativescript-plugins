import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedHighchartsWrapper } from '@demo/shared';
import { } from '@benedictstrube/highcharts-wrapper';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedHighchartsWrapper {
	
}
