import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, registerElement } from '@nativescript/angular';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [NativeScriptCommonModule],
  exports: [ChartComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class NativeScriptHighchartsWrapperModule {
}

// Uncomment this line if the package provides a custom view component
// registerElement('HighchartsWrapper', () => ChartComponent);
