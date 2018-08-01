import * as ms from "milliseconds";
import {
    IntegerRangePreference,
} from "ts-preferences";

export class TimePreference extends IntegerRangePreference {
    public stringify(value: number): string {
        const time = this.toValid(value);
        return [
            Math.floor(time / ms.hours(1)),
            Math.floor((time % ms.hours(1)) / ms.minutes(1)),
        ].map(x => x.toString().padStart(2, "0")).join(":");
    }

    public fromString(s: string) {
        const match = s.match(/^(\d{2})\:(\d{2})$/); // HH:MM
        if (match === null) {
            return `HH:MM expected (saw "${s}").`;
        } else {
            const hh = match[1];
            const mm = match[2];
            return { value: ms.hours(parseInt(hh)) + ms.minutes(parseInt(mm)) };
        }
    }
}
