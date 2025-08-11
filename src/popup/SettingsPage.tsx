import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { formatBytes } from "../utils";
import { Card } from "./Card";
import type { Settings } from "../Settings";

interface Props {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings | undefined>>
}

function toggleDarkMode(value: boolean, setSettings: Dispatch<SetStateAction<Settings | undefined>>): void
{
    setSettings(oldState => {
        if (!oldState)
            return
        return {...oldState, darkMode: value}
    })
    document.documentElement.classList.toggle("dark", value)
}

function toggleExcatTime(value: boolean, setSettings: Dispatch<SetStateAction<Settings | undefined>>): void
{
    setSettings(oldState => {
        if (!oldState)
            return
        return {...oldState, showExcatTime: value}
    })
}

export function SettingsPage( {settings, setSettings}: Props)
{
    const [bytesInUse, setBytesInUse] = useState(-2)
    const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo>()

    useEffect(() => {
        if (browser.storage.local.getBytesInUse)
        {
            browser.storage.local.getBytesInUse().then((bytes) =>
            {
                if (!bytes)
                bytes = -1
                setBytesInUse(bytes)
            })
        }
        browser.runtime.getBrowserInfo().then(data => setBrowserInfo(data))
    })

    return <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 dark:bg-gray-800 gap-2 pt-12 pb-1">
        <Card>
            <div className='flex justify-between'>
                <p className='text-lg'>Display Excat Time</p>
                <input type="checkbox"  checked={settings.showExcatTime} onChange={(event) => toggleExcatTime(event.target.checked, setSettings)} />
            </div>
            <div className='flex justify-between'>
                <p className='text-lg'>Dark Mode</p>
                <input type="checkbox" checked={settings.darkMode} onChange={(event) => toggleDarkMode(event.target.checked, setSettings)}/>
            </div>
            {bytesInUse > 0 && <p>{formatBytes(bytesInUse)} used</p>}
            {browserInfo && <>
                <p className='text-gray-400 text-sm'>{browserInfo.vendor} {browserInfo.name} {browserInfo.version}-{browserInfo.buildID}</p>
            </>}
        </Card>
    </div>
}