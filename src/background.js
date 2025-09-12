const API = typeof browser !== 'undefined' ? browser : chrome

const HOUR_CUTOFF = 4

export function normaliseDay(date)
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

API.runtime.onMessage.addListener((message) => 
{
    if (message.type === "addWatchTime") 
    {
        console.log("Adding to background", message)
        API.storage.local.get('youtubeWatchTimes').then(async (data) => 
        {
            const {language, id, time, description, inputType} = message
            if (language === "unknown")
                return

            const day = normaliseDay(new Date()).toISOString().split("T")[0]
            const entryId = `${id}${day}`
            let times = data.youtubeWatchTimes || {};

            if (!times[language])
                times[language] = {}

            if (times[language][entryId])
            {
                let entry = times[language][entryId]
                entry.time += Math.round(time)
                times[language][entryId] = entry
                console.log("edit", entry)
            }
            else
            {
                const entry = 
                {
                    time: Math.round(time),
                    date: new Date().toISOString(),
                    description: description,
                    type: inputType
                }
                times[language][entryId] = entry
                console.log("new", entry)
            }
        
        
            API.storage.local.set({youtubeWatchTimes: times});
            console.log("saved")
        });
    }
});