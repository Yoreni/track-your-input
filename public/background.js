browser.runtime.onMessage.addListener((message) => {
    if (message.type === "addWatchTime") {
        browser.storage.local.get('youtubeWatchTimes').then((data) => 
        {
            const {language, id, time} = message

            let times = data.youtubeWatchTimes || {};
            const currentTime = times[id]?.time || 0
            const timestamp = currentTime?.date ?? new Date()
            const newWatchData = {
                time: Math.round(currentTime + time),
                // language: message.language,
                date: timestamp.toISOString(),
                description: ""
            }

            if (!times[language])
                times[language] = {}
            times[language][id] = newWatchData;
            browser.storage.local.set({youtubeWatchTimes: times});
            browser.storage.local.set({"currentId": message.id});
        });
    }
});