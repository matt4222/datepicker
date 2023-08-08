import { dateFormat, getDay, getMonth, querySelector } from "mirabon-utils";
/**
 * @author matt
 * @brief return the version
 * @returns
 */
export const version = () => {
    return "mirabon-datepicker version : 0.1.4";
};
export class DatePicker {
    constructor(container, options) {
        this.div_nav = null;
        this.dp_events = [];
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
        if ("size" in this.options && options.size)
            this.input_calendar.size = options.size;
        if ("class" in this.options && this.options.class)
            this.input_calendar.classList.add(this.options.class.join(","));
        /* create calendar */
        this.div_calendar = document.createElement("div");
        this.container.append(this.div_calendar);
        this.div_calendar.classList.add("div_calendar");
        let date = new Date();
        if ("date" in options && options.date)
            date = options.date;
    }
    render(date) {
        this.div_calendar.innerHTML = "";
        this.div_nav = document.createElement("div");
        this.div_calendar.append(this.div_nav);
        this.div_nav.classList.add("div_nav");
        const top = this.input_calendar.offsetTop + this.input_calendar.offsetHeight + 3;
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
        div_month.addEventListener("click", () => { console.log("ok"); });
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
        div_year.addEventListener("click", () => { console.log("ok"); });
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
        for (let i = 1; i < 8; i++) {
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
        for (let i = 0; i < empty; i++) {
            const td = document.createElement("td");
            tr.append(td);
            td.classList.add("empty_day");
        }
        while (tmp_date.getMonth() === today.getMonth()) {
            if (tmp_date.getDay() === 1) {
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
        for (const dp_event of this.dp_events) {
            console.log(dp_event);
        }
    }
    cell_click(ev) {
        const td = ev.target;
        const month = (parseInt(td.dataset.month) + 1).toString(); //.padStart(2, "0");
        const day = td.dataset.day; //.padStart(2, "0");
        this.input_calendar.value = `${td.dataset.year}-${month}-${day}`;
        this.hide();
        if ("callback" in this.options && this.options.callback) {
            this.options.callback(this.format_output());
        }
    }
    prev_month_click(date) {
        let month = date.getMonth() - 1;
        date.setMonth(month);
        this.render(date);
    }
    next_month_click(date) {
        let month = date.getMonth() + 1;
        date.setMonth(month);
        this.render(date);
    }
    prev_year_click(date) {
        let year = date.getFullYear() - 1;
        date.setFullYear(year);
        this.render(date);
    }
    next_year_click(date) {
        let year = date.getFullYear() + 1;
        date.setFullYear(year);
        this.render(date);
    }
    hide() {
        this.div_calendar.classList.remove("show");
    }
    show() {
        this.div_calendar.classList.add("show");
    }
    toogle() {
        if (!this.div_calendar.classList.contains("show")) {
            this.show();
            let date = new Date();
            if (this.input_calendar.value.length > 0)
                date = new Date(this.input_calendar.value);
            this.render(date);
            return;
        }
        this.hide();
    }
    format_output() {
        let res = this.input_calendar.value;
        if ("output_format" in this.options && this.options.output_format) {
            res = dateFormat(new Date(this.input_calendar.value), this.options.output_format);
        }
        return res;
    }
    get_event(date) {
        for (const dp_event of this.dp_events) {
            if (dp_event.date.getFullYear() === date.getFullYear() && dp_event.date.getMonth() === date.getMonth() && dp_event.date.getDate() === date.getDate()) {
                return true;
            }
        }
        return false;
    }
    addEvent(dp_event) {
        this.dp_events.push(dp_event);
        console.log(this.dp_events);
    }
    get date() {
        return this.format_output();
    }
}
