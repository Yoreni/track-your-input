import type { WatchData } from "./WatchData";

export const HOUR_CUTOFF = 4

export function calculateTotalHours(input: WatchData[], language: string)
{
    let seconds = 0;
    input.forEach((entry: any) => {
        if (language === entry.language)
            seconds += entry.time
    })
    return seconds / 3600;
}

export function getMinutesOfInputOnDay(date: Date, input: WatchData[], language: string)
{
    if (!input)
        return 0
    const hours = calculateTotalHours(input.filter(
        (entry: WatchData) => isOnSameDay(date, entry.date)), language)
    return hours * 60
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
