let trackingStart = null;
let isTracking = false
videoInfo = {}

const UNSTARTED_STATE = -1
const ENDED_STATE = 0
const PLAYING_STATE = 1
const PAUSED_STATE = 2

function getVideoLanguage(playerElement)
{
    const tracks = playerElement.getAudioTrack().captionTracks
    let videoLanguage = 'unknown'; 
    const defaultTrack = tracks.find(track => track.kind === "asr");
    if (defaultTrack) 
        videoLanguage = defaultTrack.languageCode;
    else if (tracks.length > 0)
        videoLanguage = tracks.captionTracks[0].languageCode;
 
    return videoLanguage;
}

function startTracking()
{
    if (isTracking)
        return

    trackingStart = new Date();
    isTracking = true
    console.log("tracking video")
    
}

function stopTracking()
{
    if (!trackingStart)
        return
    if (!isTracking)
        return

    const time = (new Date - trackingStart) / 1000;
    trackingStart = null;
    const data = {
        id: videoInfo.id,
        time,
        language: videoInfo.language,
        description: videoInfo.title,
        inputType: "YOUTUBE"
    }

    window.postMessage({ type: 'addWatchTime', payload: data }, '*');
    isTracking = false
    console.log(`Video stopped - added ${time.toFixed(3)}s to tracker`)
}

function getVideoData(playerElement)
{
    const data = playerElement.getVideoData()
    const id = data.video_id
    const title = data.title
    const language = getVideoLanguage(playerElement)
    videoInfo = {id, title, language}
}

function videoStatePoll(playerElement)
{
    switch (playerElement.getPlayerState()) {
        case PLAYING_STATE:
            startTracking();
            break;
        case PAUSED_STATE:
            stopTracking()
            break;
        case ENDED_STATE:
            stopTracking()
            break;
    }
}

const hookInterval = setInterval(() => {
    const playerElement = document.getElementById('movie_player');
    
    if (playerElement && typeof playerElement.getPlayerState === 'function') 
    {
        getVideoData(playerElement)
        console.log(`Found Embeded YT video ${videoInfo.id} in ${videoInfo.language} | ${videoInfo.title}`)
        // playerElement.addEventListener('onStateChange', onPlayerStateChange);
        clearInterval(hookInterval);
        setInterval(() => videoStatePoll(playerElement), 100)
    }
}, 500);

