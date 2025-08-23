export interface WatchDataEntry 
{
    time: number
    date: Date
    id: string
    description?: string
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

