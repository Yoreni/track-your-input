// background.js
browser.runtime.onMessage.addListener((message) => {
    if (message.type === "addWatchTime") {
        browser.storage.local.get('youtubeWatchTimes').then((data) => {
            let times = data.youtubeWatchTimes || {};
            const currentTime = times[message.id]?.time || 0
            const timestamp = currentTime?.date ?? new Date()
            const newWatchData = {
                time: Math.round(currentTime + message.time),
                language: message.language,
                date: timestamp.toISOString(),
                description: ""
            }
            times[message.id] = newWatchData;
            browser.storage.local.set({youtubeWatchTimes: times});
            browser.storage.local.set({"currentId": message.id});
        });
    }
});