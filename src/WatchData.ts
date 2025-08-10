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

export async function saveWatchData(watchData: WatchData[])
{
    let object: any = {}
    watchData.forEach(item => {
        const {id, ...newItem} = item
        object[id] = newItem;
    })
    await browser.storage.local.set({[KEY]: object});
}

