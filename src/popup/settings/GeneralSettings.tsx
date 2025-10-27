import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { Settings } from "../../Settings"
import { EXTENSION_API, type BrowserInfo } from "../../extension-api"

interface Props {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings>>
}

function toggleDarkMode(value: boolean, setSettings: Dispatch<SetStateAction<Settings>>): void
{
    setSettings(oldState => {
        return {...oldState, darkMode: value}
    })
    document.documentElement.classList.toggle("dark", value)
}

function toggleExcatTime(value: boolean, setSettings: Dispatch<SetStateAction<Settings>>): void
{
    setSettings(oldState => {
        return {...oldState, showExcatTime: value}
    })
}

export function GeneralSettings({settings, setSettings}: Props)
{
    const [browserInfo, setBrowserInfo] = useState<BrowserInfo>()

    useEffect(() => {
        EXTENSION_API.getBrowserInfo().then((data: BrowserInfo) => 
            {
                setBrowserInfo(data)
            })
    }, [])

    return browserInfo && <>
        <div className='flex justify-between'>
            <p className='text-lg'>Display Excat Time</p>
            <input type="checkbox"  checked={settings.showExcatTime} onChange={(event) => toggleExcatTime(event.target.checked, setSettings)} />
        </div>
        <div className='flex justify-between'>
            <p className='text-lg'>Dark Mode</p>
            <input type="checkbox" checked={settings.darkMode} onChange={(event) => toggleDarkMode(event.target.checked, setSettings)}/>
        </div>
        {browserInfo && <>
            <p className='text-gray-400 text-sm'>{browserInfo.vendor} {browserInfo.name} {browserInfo.version}-{browserInfo.buildID}</p>
        </>}
    </>
}
