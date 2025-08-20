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
    loadedData = Object.entries(loadedData).map(([key, value]) => ({...value, id: key, date: new Date(value.date)}))
    return loadedData
}

export async function saveWatchData(watchData: WatchData[])
{
    console.log(JSON.stringify({watchData}))
    let object: any = {}
    watchData.forEach((item: any) => {
        const {id, ...newItem} = item
        // newItem.date = newItem.date.toISOString()
        object[id] = newItem;
    })
    await browser.storage.local.set({[KEY]: object});
}

