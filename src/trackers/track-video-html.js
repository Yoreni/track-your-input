const API = typeof browser !== 'undefined' ? browser : chrome

class Tracker
{
    #start;
    #time;
    #running;

    constructor()
    {
        this.#start = null
        this.#time = 0
        this.#running = false
    }

    start()
    {
        this.#start = new Date()
        this.#running = true
        return true
    }

    stop()
    {
        if (!this.#running)
            return false

        this.#time += (new Date().getTime() - this.#start.getTime()) / 1000
        this.#running = false
        return true
    }

    reset()
    {
        this.#time = 0
    }

    get time()
    {
        let time = this.#time
        if (this.#running)
            time += (new Date().getTime() - this.#start.getTime()) / 1000
        return time
    }
}

function hashCode(str) 
{
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash;
}

function strToUniqueId(str) 
{
    const stringToHash = str;
    const hash = hashCode(stringToHash);
    return (hash >>> 0).toString(36); 
}

function startTracking(videoInfo)
{
    videoInfo.tracker.start()
    console.log("Tracking video")
}

function stopTracking(videoInfo)
{
    if (!videoInfo.tracker.stop())
        return

    const time = videoInfo.tracker.time
    videoInfo.tracker.reset()

    const data = {
        type: "addWatchTime",
        id: strToUniqueId(videoInfo.url + videoInfo.description),
        time,
        language: videoInfo.language,
        description: videoInfo.description,
        inputType: "VIDEO"
    }

    API.runtime.sendMessage(data).catch(error => 
        console.error("Error sending message to background script:", error)
    );
    console.log(`Video stopped - added ${time.toFixed(3)}s to tracker`)
}

function prepareVideo(video)
{
    console.log(`found new video (${getLanguage(video)})|`, video?.ownerDocument?.title)
    const info =
    {
        description: video?.ownerDocument?.title || video?.title,
        language: getLanguage(video),
        tracker: new Tracker(),
        url: video.baseURI
    }

    video.addEventListener('pause', () => stopTracking(info));
    video.addEventListener('ended', () => stopTracking(info));
    video.addEventListener('play', () => startTracking(info));
    window.addEventListener('beforeunload', () => stopTracking(info))

    setTimeout(() => {
        if (!video.paused)
            startTracking(info)
    }, 100)
}

function getLanguage(video)
{
    const videoLang = getLanguageFromVideo(video)
    if (videoLang !== "unknown" && videoLang !== "")
        return videoLang.split("-")[0]
    return getLanguageFromURL(video.baseURI)
}

function getLanguageFromVideo(video)
{
    if (video.lang)
        return video.lang
    if (video.ownerDocument?.lang)
        return video.ownerDocument.lang

    const tracks = video.textTracks
    if (tracks.length === 0)
        return "unknown"
    if (tracks.length === 1)
        return tracks[0].language
    return "unknown"
}

function getLanguageFromURL(url) 
{
    let urlObj;
    try {
        urlObj = new URL(url);
    } catch (e) {
        console.error("Invalid URL provided:", url);
        return "unknown";
    }

    const langMap = 
    {
        'en': 'en', 'english': 'en',
        'es': 'es', 'spanish': 'es',
        'fr': 'fr', 'french': 'fr',
        'de': 'de', 'german': 'de',
        'it': 'it', 'italian': 'it',
        'pt': 'pt', 'portuguese': 'pt',
        'ja': 'ja', 'japanese': 'ja',
        'ko': 'ko', 'korean': 'ko',
        'zh': 'zh', 'chinese': 'zh',
        'ru': 'ru', 'russian': 'ru',
        'th': 'th', 'thai': 'th',
        'pl': 'pl', 'polish': 'pl',
        'nl': 'nl', 'dutch': 'nl',
        'hi': 'hi', 'hindi': 'hi',
        'hu': 'hu', 'hungarian': 'hu',

    };

    const recognizableLangs = new Set(Object.keys(langMap));
    let toCheck = []

    const pathSegments = urlObj.pathname.split('/').filter(segment => segment !== '');
    toCheck.push(...pathSegments)

    const searchParams = urlObj.searchParams;
    const langParamNames = ['lang', 'locale', 'hl', 'language'];
    for (const paramName of langParamNames) {
        const paramValue = searchParams.get(paramName);
        if (paramValue) 
        {
            toCheck.push(paramValue)
        }
    }
    const hostnameParts = urlObj.hostname.split('.').slice(0, -2);
    toCheck.push(...hostnameParts)

    console.log(toCheck)
    for (const checking of toCheck)
    {
        if (recognizableLangs.has(checking)) {
            return langMap[checking]; // Return the 2-letter code
        }
    }

    return "unknown";
}

function findVideos()
{
    const videos = document.querySelectorAll("video")
    videos.forEach(video =>
    {
        if (video.ci_tracker_found)
            return

        video.ci_tracker_found = true
        setTimeout(() => prepareVideo(video), 500)
    })
}
findVideos()

setInterval(findVideos, 1000)
