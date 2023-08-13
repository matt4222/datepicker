export type DATEPICKER_OPTIONS = {
    size?: number;
    output_format?: string;
    callback?: Function;
    date?: Date;
    class?: string[];
};
export type DATEPICKER_EVENT = {
    date: Date;
};
/**
 * @author matt
 * @brief return the version
 * @returns
 */
export declare const version: () => string;
export declare class DatePicker {
    private container;
    private input_calendar;
    private div_nav;
    private div_calendar;
    private options;
    private dp_events;
    constructor(container: string, options: DATEPICKER_OPTIONS);
    private render;
    private cell_click;
    private prev_month_click;
    private next_month_click;
    private prev_year_click;
    private next_year_click;
    private hide;
    private show;
    private toogle;
    private format_output;
    private get_event;
    addEvent(dp_event: DATEPICKER_EVENT): void;
    get_date(format: string): string;
}
