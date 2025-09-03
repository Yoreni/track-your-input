import { getDaysInMonth, HOUR_CUTOFF, isOnSameDay } from "./utils"

export type InputType = "WATCHING" | "LISTENING" | "CONVERSATION" | "YOUTUBE"

export interface EditWatchDataEntry
{
    time?: number
    date?: Date
    description?: string
    type: InputType
} 

export interface WatchDataEntry 
{
    time: number
    date: Date
    id: string
    description?: string
    type: InputType
}

export interface FlattenedWatchDataEntry extends WatchDataEntry
{
    language: string
}

export type WatchData = Record<string, WatchDataEntry[]>
type StoredWatchData = Record<string, Record<string, WatchDataEntry>> //The structure stored in browser storage

const KEY = "youtubeWatchTimes"

export function convertToFlattenedList(watchData: WatchData): FlattenedWatchDataEntry[]
{
    let out: FlattenedWatchDataEntry[] = []
    for (const [language, data] of Object.entries(watchData))
    {
        for (const entry of data)
            out.push({...entry, language: language})
    }
    return out
}

export function convertFromFlattenedList(flattenedList: FlattenedWatchDataEntry[]): WatchData
{
    let out: WatchData = {}
    for (const entry of flattenedList)
    {
        const {language, ...watchDataEntry} = entry
        if (!out[language])
            out[language] = []
        out[entry.language].push(watchDataEntry)
    }
    return out
}


export async function loadWatchData(): Promise<WatchData>
{
    try
    {    
        let loadedData = (await browser.storage.local.get(KEY))
        if (!loadedData[KEY])
            return {}
        loadedData = loadedData[KEY]
        for (const [language, data] of Object.entries(loadedData as StoredWatchData))
        {
            loadedData[language] = Object.entries(data).map((
                [key, value]) => ({
                    ...value,
                    language: language,
                    id: key, date: new Date(value.date)
                }))
        }
        return loadedData
    }
    catch(error)
    {
        console.error(`Could not load watch data ${error}`)
        return {}
    }
}

export async function saveWatchData(watchData: WatchData)
{
    console.log(JSON.stringify({watchData}))
    let object: any = {}
    for (const [language, data] of Object.entries(watchData))
    {
        object[language] = {}
        for (const entry of data)
        {
            const {id, ...newEntry} = entry
            object[language][id] = newEntry
        }
    }
    
    try
    {
        await browser.storage.local.set({[KEY]: object})
    }
    catch (error)
    {
        console.error(`Could not save watch data ${error}`)
    }
}

export function getInputDataForMonth(monthDisplay: Date, input: WatchDataEntry[]): Record<number, number>
{
    const daysInMonth = getDaysInMonth(monthDisplay)
    let perDayInput: { [key: number]: number } = {}
    for (let day = 1; day <= daysInMonth; ++day)
    {
        const date = new Date(monthDisplay.getFullYear(), monthDisplay.getMonth(), day, HOUR_CUTOFF)
        perDayInput[day] = getInputOnDay(date, input)
    }
    return perDayInput;
}

export function calcInputThisMonth(monthDisplay: Date, input: WatchDataEntry[])
{
    const perDayInput = Object.values(getInputDataForMonth(monthDisplay, input))
    return perDayInput.reduce((partialSum, a) => partialSum + a, 0);
}

export function calculateTotalTime(input: WatchDataEntry[])
{
    let seconds = 0;
    input.forEach((entry: WatchDataEntry) => {
        seconds += entry.time
    })
    return seconds;
}

export function getInputOnDay(date: Date, input: WatchDataEntry[])
{
    if (!input)
        return 0
    const inputOnDay = input.filter((entry: WatchDataEntry) => isOnSameDay(date, entry.date))
    const inputTime = calculateTotalTime(inputOnDay)
    return inputTime
}


