import type { WatchData } from "./WatchData";

const HOUR_CUTOFF = 4

export function calculateTotalHours(input: WatchData[], language: string)
{
    let seconds = 0;
    input.forEach((entry: any) => {
        if (language === entry.language)
            seconds += entry.time
    })
    return seconds / 3600;
}

export function getDayInput(date: Date, input: WatchData[], language: string)
{
    if (!input)
        return 0
    const seconds = calculateTotalHours(input.filter(
        (entry: WatchData) => isOnSameDay(date, entry.date)), language) * 60
    return seconds / 60
}

export function isOnSameDay(date1: Date, date2: Date): boolean 
{
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(d1.getHours() - HOUR_CUTOFF);
    d2.setHours(d2.getHours() - HOUR_CUTOFF);

    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}
