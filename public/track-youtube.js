let currentVideoId = null;
let currentVideoLanguage = 'unknown';
let videoElement = null;
let playerResponse = null;
let trackingStart = null;

function startTracking()
{
    trackingStart = new Date();
    console.log("tracking video")
}

function stopTracking()
{
    if (!trackingStart)
        return;

    const time = (new Date - trackingStart) / 1000;
    trackingStart = null;
    const data = {
        type: "addWatchTime",
        id: currentVideoId,
        time,
        language: currentVideoLanguage,
        description: playerResponse.videoDetails.title
    }
    browser.runtime.sendMessage(data).catch(error => 
        console.error("Error sending message to background script:", error)
    );
    console.log(`Video stopped - added ${time.toFixed(3)}s to tracker`)
}


function getLanguage() 
{
    let videoLanguage = 'unknown'; 

    if (playerResponse && playerResponse.captions && playerResponse.captions.playerCaptionsTracklistRenderer) {
        const tracklist = playerResponse.captions.playerCaptionsTracklistRenderer;
        const defaultTrack = tracklist.captionTracks.find(track => !track.isTranslatable || track.name.simpleText.includes("(auto-generated)"));
        if (defaultTrack) 
            videoLanguage = defaultTrack.languageCode;
        else if (tracklist.captionTracks.length > 0)
            videoLanguage = tracklist.captionTracks[0].languageCode;
    } 
 
    return videoLanguage;
}

function updateVideoContext() 
{
    const newVideoId = new URLSearchParams(window.location.search).get('v');

    if (newVideoId && (newVideoId !== currentVideoId)) 
    {
        console.log(`Video ID changed from ${currentVideoId} to ${newVideoId}. Updating context...`);
        currentVideoId = newVideoId;
        videoElement = document.querySelector('video');
        
        fetch('https://www.youtube.com/watch?v=' + newVideoId)
        .then(response => response.text())
        .then(body => 
        {
            const YT_INITIAL_PLAYER_RESPONSE_RE = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/;
            playerResponse = body.match(YT_INITIAL_PLAYER_RESPONSE_RE);
            playerResponse = JSON.parse(playerResponse[1]);
            currentVideoLanguage = getLanguage();
            videoElement.addEventListener('play', startTracking);
            videoElement.addEventListener('pause', stopTracking);
            videoElement.addEventListener('ended', stopTracking);
            console.log(`Detected video ID: ${currentVideoId} (Language: ${currentVideoLanguage})`);

            setTimeout(() =>
            {
                if (!videoElement.paused)
                    startTracking();
            }, 100)
        });
    } else if (!newVideoId && currentVideoId) {
        console.log("Left video page. Resetting tracking context.");
        stopTracking()
        currentVideoId = null;
        videoElement = null;
        currentVideoLanguage = 'unknown';
    }
}

window.addEventListener('yt-navigate-start', (e) => {
    updateVideoContext()
});
document.addEventListener('DOMContentLoaded', updateVideoContext);

window.addEventListener('beforeunload', stopTracking)