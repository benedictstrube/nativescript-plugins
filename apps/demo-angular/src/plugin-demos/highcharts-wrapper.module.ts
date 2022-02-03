import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { HighchartsWrapperComponent } from './highcharts-wrapper.component';
import { NativeScriptHighchartsWrapperModule } from '@benedictstrube/highcharts-wrapper/angular';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{
    path: '',
    component: HighchartsWrapperComponent
  }]), NativeScriptHighchartsWrapperModule],
  declarations: [HighchartsWrapperComponent],
  schemas: [ NO_ERRORS_SCHEMA]
})
export class HighchartsWrapperModule {}
