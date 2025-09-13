const API = typeof browser !== 'undefined' ? browser : chrome
const INJECT_SCRIPT = "track-embeded-youtube.js"

var script = document.createElement('script');
script.src = API.runtime.getURL("track-embeded-youtube.js");
script.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(script);

//pass data on to background script
window.addEventListener('message', (event) => 
{
    if (event.source === window && event.data && event.data.type === 'addWatchTime') 
    {
        API.runtime.sendMessage({type: event.data.type, ...event.data.payload}).catch(error => 
            console.error("Error sending message to background script:", error)
        );
    }
});