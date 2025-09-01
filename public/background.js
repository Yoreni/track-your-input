const HOUR_CUTOFF = 4

function normaliseDay(date)
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

 browser.runtime.onMessage.addListener((message) => 
{
    if (message.type === "addWatchTime") 
    {
        browser.storage.local.get('youtubeWatchTimes').then(async (data) => 
        {
            const {language, id, time, description} = message
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
            }
            else
            {
                const entry = 
                {
                    time: Math.round(time),
                    date: new Date().toISOString(),
                    description: description
                }
                times[language][entryId] = entry
            }
        
            await browser.storage.local.set({youtubeWatchTimes: times});
        });
    }
});