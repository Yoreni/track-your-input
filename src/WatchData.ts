export interface WatchData {
    time: number
    language: string
    date: Date
    id: string
    description?: string
}

const KEY = "youtubeWatchTimes"

export async function loadWatchData()
{
    let loadedData = (await browser.storage.local.get(KEY))
    if (!loadedData[KEY])
        return {}
    loadedData = loadedData[KEY]
    loadedData = Object.entries(loadedData).map(([key, value]) => ({...value, id: key}))
    return loadedData
}

