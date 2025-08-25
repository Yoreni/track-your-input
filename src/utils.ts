export type Screen = "PROGRESS" | "SETTINGS" | "HISTORY"
export const HOUR_CUTOFF = 4

const SI_SUFFIXES = Object.freeze(["", "k", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"])

export function getDaysInMonth(date: Date): number
{
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
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

export function normaliseDay(date: Date): Date
{
    const cutoffToday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        HOUR_CUTOFF,
    );
    if (date >= cutoffToday) 
        return cutoffToday;
    const cutoffYesterday = new Date(cutoffToday);
    cutoffYesterday.setDate(cutoffYesterday.getDate() - 1);
    return cutoffYesterday;
}

export function formatBytes(bytes: number)
{
    if (bytes === 0)
        return "0B"
    const sign = bytes < 0 ? "-" : ""
    bytes = Math.round(Math.abs(bytes))
    const powerOf1000 = Math.floor(Math.log10(bytes) / 3)
    if (powerOf1000 >= SI_SUFFIXES.length)
        return `${sign}${bytes.toExponential(2)}B`

    const mantissa = bytes / (1000 ** powerOf1000)
    let dp = 0
    if (mantissa < 10)
        dp = 2
    else if (mantissa < 100)
        dp = 1

    const roundedMantissa = Math.floor(mantissa * (10 ** dp)) / 10 ** dp
    return `${sign}${roundedMantissa}${SI_SUFFIXES[powerOf1000]}B`
}
