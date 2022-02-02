import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { HighchartsWrapperComponent } from './highcharts-wrapper.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: HighchartsWrapperComponent }])],
  declarations: [HighchartsWrapperComponent],
  schemas: [ NO_ERRORS_SCHEMA]
})
export class HighchartsWrapperModule {}
