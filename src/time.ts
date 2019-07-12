export function timeIsWithin(interval: Readonly<{ start: number, end: number }>) {
    return (time: Date): boolean => {
        const t = timeOfDay(time);
        const start = interval.start;
        const end = interval.end;
        return (
            end < start
            ? t >= start || t < end
            : t >= start && t < end
        );
    };
}

function timeOfDay(date: Date): number {
    let startOfToday = new Date();
    startOfToday.setHours(0);
    startOfToday.setMinutes(0);
    startOfToday.setSeconds(0);
    startOfToday.setMilliseconds(0);
    return date.getTime() - startOfToday.getTime();
}
