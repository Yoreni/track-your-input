export interface BrowserInfo 
{
    name: string;
    vendor: string;
    version: string;
    buildID: string;
}

interface ExtensionApi
{
    setLocalStorage(key: string, data: any): Promise<void>
    getLocalStorage(key: string): Promise<any>
    sendMessage(data: object): Promise<any>
    addMessageListener(callback: (message: object) => void): void
    getLocalBytesInUse(): Promise<number>
    getBrowserInfo(): Promise<BrowserInfo>
}

class Firefox implements ExtensionApi
{
    async setLocalStorage(key: string, data: any): Promise<void> 
    {
        return await browser.storage.local.set({[key]: data})
    }

    async getLocalStorage(key: string): Promise<any> 
    {
        return await browser.storage.local.get(key)
    }

    async sendMessage(data: object): Promise<any> 
    {
        return await browser.runtime.sendMessage(data)
    }

    addMessageListener(callback: (message: object) => void): void 
    {
        return browser.runtime.onMessage.addListener(callback)
    }

    async getLocalBytesInUse(): Promise<number> // not suported by firefox
    {
        return await Promise.resolve(-1)
    }
    
    async getBrowserInfo(): Promise<BrowserInfo>
    {
        return await browser.runtime.getBrowserInfo();
    }
}

class Chrome implements ExtensionApi
{
    async setLocalStorage(key: string, data: any): Promise<void> 
    {
        return await chrome.storage.local.set({[key]: data})
    }

    async getLocalStorage(key: string): Promise<any> 
    {
        return await chrome.storage.local.get(key)
    }

    async sendMessage(data: object): Promise<any> 
    {
        return await chrome.runtime.sendMessage(data)
    }

    addMessageListener(callback: (message: object) => void): void 
    {
        return chrome.runtime.onMessage.addListener(callback)
    }

    async getLocalBytesInUse(): Promise<number> // not suported by firefox
    {
        return await chrome.storage.local.getBytesInUse()
    }
    
    async getBrowserInfo(): Promise<BrowserInfo>
    {
        function getChromeVersion() 
        {
            const userAgent = navigator.userAgent
            const match = userAgent.match(/Chrome\/([0-9.]+)/)
            if (match && match[1]) 
                return match[1]
            return "Unknown"
        }

        const data: BrowserInfo =
        {
            name: "Chrome",
            vendor: "",
            version: getChromeVersion(),
            buildID: ""
        }
        return await Promise.resolve(data)
    }
}

function getBrowser(): ExtensionApi
{
    if (typeof browser !== "undefined")
        return new Firefox()
    return new Chrome()
}

export const EXTENSION_API: ExtensionApi = getBrowser()