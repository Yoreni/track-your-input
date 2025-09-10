let trackingStart = null;
videoInfo = {}

function loadApi()
{
    if (window.YT && window.YT.Player) 
    {
        console.log("YT object already found")
        onYouTubeIframeAPIReady();
    } 
    else 
    {
        console.log("Loading YT IFrame API")
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

function getVideoLanguage(playerElement)
{
    const tracks = playerElement.getAudioTrack().captionTracks
    console.log(playerElement.getAudioTrack())
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
        id: videoInfo.id,
        time,
        language: videoInfo.language,
        description: videoInfo.title,
        inputType: "YOUTUBE"
    }

    window.postMessage({ type: 'addWatchTime', payload: data }, '*');
    console.log(`Video stopped - added ${time.toFixed(3)}s to tracker`)
}

function getVideoInfo(playerElement)
{
    const data = playerElement.getVideoData()
    const id = data.video_id
    const title = data.title
    const language = getVideoLanguage(playerElement)
    videoInfo = {id, title, language}
}

const hookInterval = setInterval(() => {
    const playerElement = document.getElementById('movie_player');
    
    if (playerElement && typeof playerElement.getPlayerState === 'function') 
    {
        getVideoInfo(playerElement)
        console.log(`Found Embeded YT video ${videoInfo.id} in ${videoInfo.language} | ${videoInfo.title}`)
        playerElement.addEventListener('onStateChange', onPlayerStateChange);
        clearInterval(hookInterval);
    }
}, 500);

function onYouTubeIframeAPIReady() 
{

};

function onPlayerStateChange(event) 
{
    switch (event) {
        case YT.PlayerState.PLAYING:
            startTracking();
            break;
        case YT.PlayerState.PAUSED:
            stopTracking()
            break;
        case YT.PlayerState.ENDED:
            stopTracking()
            break;
    }
}

loadApi()
