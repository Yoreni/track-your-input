// background.js
browser.runtime.onMessage.addListener((message) => {
    if (message.type === "addWatchTime") {
        browser.storage.local.get('youtubeWatchTimes').then((data) => {
            let times = data.youtubeWatchTimes || {};
            const time = times[message.id]
            const newWatchData = {
                time: (time?.time || 0) + message.time,
                language: message.language,
                date: time?.date ?? new Date() 
            }
            times[message.id] = newWatchData;
            browser.storage.local.set({youtubeWatchTimes: times});
            browser.storage.local.set({"currentId": message.id});
        });
    }
});