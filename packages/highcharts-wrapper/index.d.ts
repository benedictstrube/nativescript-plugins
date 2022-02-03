import { HighchartsWrapperCommon } from './common';

export type HighchartsOptions = any;
export type HighchartsChart = any;

export interface ChartLoadedEventData {
  chartApi: HighchartsAPI
}

interface HighchartsInnerEventListener {
  /**
   * The event name.
   */
  event: EventToChart;

  /**
   * The action for the reaction to the event from the outside to the chart scope. The
   * body must not contain any dependency to the current scope as it is executed in
   * the chart scope.
   * @param data The data that was passed when the event was emitted.
   * @param chart The highcharts charts instance.
   */
  action: (data: any, chart: HighchartsChart) => void;
}

interface HighchartsExternalEventListener {

  /**
   * The event name.
   */
  event: EventFromChart;

  /**
   * The action for the reaction to the event from the chart. The body may contain
   * external dependencies and is executed in the current scope.
   * @param data The data that was passed when the event was emitted.
   */
  action: (data: any) => void;
}

export type EventToChart = string;
export type EventFromChart = string;

export interface HighchartsConfig {
  /**
   * The options to render the chart. See https://api.highcharts.com/highcharts/.
   */
  options: HighchartsOptions;

  /**
   * All internal event listeners that react to events from the outside to the chart.
   */
  innerEventListeners: Array<HighchartsInnerEventListener>;

  /**
   * All external event listeners that react to events from the chart.
   */
  externalEventListeners: Array<HighchartsExternalEventListener>;
}

/**
 * Interface used when communicating with the chart via events.
 */
export interface HighchartsAPI {
  /**
   * Emits an event to the chart. Make sure you set up an event listener for that event.
   * @param event The name of the event emitted.
   * @param data The data passed alongside the event.
   */
  emitEvent(event: EventToChart, data: any): void;

  /**
   * Renders the chart from scratch.
   */
  rerender(): void;
}

export declare class HighchartsWrapper extends HighchartsWrapperCommon {
}
