import { dateFormat, getDay, getMonth, querySelector } from "mirabon-utils";

export type DATEPICKER_OPTIONS =
    {
        size?: number;
        output_format?: string;
        callback?: Function;
        date?: Date;
        class?: string[];
    };

export type DATEPICKER_EVENT = 
{
    date: Date;
}

/**
 * @author matt
 * @brief return the version
 * @returns
 */
export const version = () =>
{
    return "mirabon-datepicker version : 0.1.8";
}

export class DatePicker
{
    private container: HTMLDivElement;
    private input_calendar: HTMLInputElement;
    private div_nav: HTMLDivElement | null = null;
    private div_calendar: HTMLDivElement;
    private options: DATEPICKER_OPTIONS;
    private dp_events: DATEPICKER_EVENT[] = [];

    constructor(container: string, options: DATEPICKER_OPTIONS)
    {
        this.options = options;

        /* create container */
        this.container = querySelector(container, HTMLDivElement);
        this.container.classList.add("date_picker");

        /* create input */
        this.input_calendar = document.createElement("input");
        this.container.append(this.input_calendar);
        this.input_calendar.classList.add("input_calendar");
        this.input_calendar.readOnly = true;
        this.input_calendar.addEventListener("click", this.toogle.bind(this));

        /* create calendar */
        this.div_calendar = document.createElement("div");
        this.container.append(this.div_calendar);
        this.div_calendar.classList.add("div_calendar");

        if ("size" in this.options && options.size)
            this.input_calendar.size = options.size;

        if ("class" in this.options && this.options.class)
            this.input_calendar.classList.add(this.options.class.join(","));

        let date = new Date();
        if("date" in this.options && this.options.date)
            date = this.options.date;

        this.input_calendar.value = dateFormat(date, "Y-m-d");
    }

    private render(date: Date)
    {
        this.div_calendar.innerHTML = "";

        this.div_nav = document.createElement("div");
        this.div_calendar.append(this.div_nav);
        this.div_nav.classList.add("div_nav");

        const top = this.input_calendar.offsetTop + this.input_calendar.offsetHeight;
        const left = this.input_calendar.offsetLeft;

        this.div_calendar.style.top = top + "px";
        this.div_calendar.style.left = left + "px";

        const div_prev_month = document.createElement("div");
        this.div_nav.append(div_prev_month);
        div_prev_month.classList.add("btn_prev");
        div_prev_month.addEventListener("click", () => this.prev_month_click(date));

        const div_month = document.createElement("div");
        this.div_nav.append(div_month);
        div_month.classList.add("div_month");
        div_month.innerHTML = getMonth(date.getMonth()).toUpperCase();
        div_month.addEventListener("click", () => { console.log("not yet implemeted"); });

        const div_next_month = document.createElement("div");
        this.div_nav.append(div_next_month);
        div_next_month.classList.add("btn_next");
        div_next_month.addEventListener("click", () => this.next_month_click(date));

        const div_spacer = document.createElement("div");
        this.div_nav.append(div_spacer);

        const div_prev_year = document.createElement("div");
        this.div_nav.append(div_prev_year);
        div_prev_year.classList.add("btn_prev");
        div_prev_year.addEventListener("click", () => this.prev_year_click(date));

        const div_year = document.createElement("div");
        this.div_nav.append(div_year);
        div_year.classList.add("div_year");
        div_year.innerHTML = date.getFullYear().toString();
        div_year.addEventListener("click", () => { console.log("not yet implemeted"); });

        const div_next_year = document.createElement("div");
        this.div_nav.append(div_next_year);
        div_next_year.classList.add("btn_next");
        div_next_year.addEventListener("click", () => this.next_year_click(date));

        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const table = document.createElement("table");
        this.div_calendar.append(table);

        const thead = document.createElement("thead");
        table.append(thead);

        let tr = document.createElement("tr");
        thead.append(tr);

        for (let i = 1; i < 8; i++)
        {
            const th = document.createElement("th");
            tr.append(th);
            th.innerHTML = getDay((i !== 7) ? i : 0);
        }

        const tbody = document.createElement("tbody");
        table.append(tbody);

        let num = 1;
        let tmp_date = new Date(today.getFullYear(), today.getMonth(), num);

        tr = document.createElement("tr");
        tbody.append(tr);

        let empty = (tmp_date.getDay() === 0) ? 6 : (tmp_date.getDay() - 1);
        for (let i = 0; i < empty; i++)
        {
            const td = document.createElement("td");
            tr.append(td);
            td.classList.add("empty_day");
        }

        while (tmp_date.getMonth() === today.getMonth())
        {
            if (tmp_date.getDay() === 1)
            {
                tr = document.createElement("tr");
                tbody.append(tr);
            }

            const td = document.createElement("td");
            tr.append(td);

            td.innerHTML = `${tmp_date.getDate().toString()}`;
            td.dataset.year = date.getFullYear().toString();
            td.dataset.month = date.getMonth().toString();
            td.dataset.day = tmp_date.getDate().toString();

            td.classList.add("valid_day");
            if (this.get_event(tmp_date))
                td.classList.add("event_day");

            td.addEventListener("click", this.cell_click.bind(this));

            num += 1;
            tmp_date = new Date(today.getFullYear(), today.getMonth(), num);
        }
    }

    private cell_click(ev: Event)
    {
        const td = ev.target as HTMLTableCellElement;

        const month = (parseInt(td.dataset.month!) + 1).toString().padStart(2, "0");
        const day = td.dataset.day!.padStart(2, "0");

        this.input_calendar.value = `${td.dataset.year}-${month}-${day}`;
        this.hide();

        if ("callback" in this.options && this.options.callback)
        {
            let format = "Y-m-d";
            
            if("output_format" in this.options && this.options.output_format)
                format = this.options.output_format;

            this.options.callback(this.format_output(format));
        }
    }

    private prev_month_click(date: Date)
    {
        let month = date.getMonth() - 1;
        date.setMonth(month);
        this.render(date);
    }

    private next_month_click(date: Date)
    {
        let month = date.getMonth() + 1;
        date.setMonth(month);
        this.render(date);
    }

    private prev_year_click(date: Date)
    {
        let year = date.getFullYear() - 1;
        date.setFullYear(year);
        this.render(date);
    }

    private next_year_click(date: Date)
    {
        let year = date.getFullYear() + 1;
        date.setFullYear(year);
        this.render(date);
    }

    private hide()
    {
        this.div_calendar.classList.remove("show");
    }

    private show()
    {
        this.div_calendar.classList.add("show");
    }

    private toogle()
    {
        if (!this.div_calendar.classList.contains("show"))
        {
            this.show();

            let date = new Date();
            if (this.input_calendar.value.length > 0)
                date = new Date(this.input_calendar.value);

            this.render(date);

            return;
        }

        this.hide();
    }

    private format_output(format: string)
    {
        let res = this.input_calendar.value;
        res = dateFormat(new Date(this.input_calendar.value), format);

        return res;
    }

    private get_event(date: Date): boolean
    {
        for (const dp_event of this.dp_events)
        {
            if (dp_event.date.getFullYear() === date.getFullYear() && dp_event.date.getMonth() === date.getMonth() && dp_event.date.getDate() === date.getDate())
            {
                return true;
            }
        }

        return false;
    }

    public addEvent(dp_event: DATEPICKER_EVENT)
    {
        this.dp_events.push(dp_event);
    }

    public get_date(format: string)
    {
        return this.format_output(format);
    }
}
