import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Card } from "./Card";
import type { Settings } from "../Settings";
import type { WatchData } from "../WatchData";
import { getLanguage } from "../language";
import { WatchDataControl } from "./WatchDataControl";

interface Props {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings | undefined>>
    input: WatchData[]
    setInput: Dispatch<SetStateAction<WatchData[]>>
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

export function SettingsPage( {settings, setSettings, input, setInput}: Props)
{
    const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo>()

    useEffect(() => {
        browser.runtime.getBrowserInfo().then(data => setBrowserInfo(data))
    })

    const learning = Object.keys(settings.learning)

    return browserInfo && (<div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 dark:bg-gray-800 gap-2 pt-12 pb-1">
        <Card>
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
        </Card>
        <Card>
            <p className="font-bold p-1 text-center">Learning</p>
            <div className="grid grid-cols-3 gap-2">
                {learning.map((lang) => <LanguageTile language={lang}/>)}
                <div className="text-center text-3xl text-white border-dashed border-3 rounded-lg border-blue-200">+</div>
            </div>
        </Card>
        <Card>
            <WatchDataControl input={input} setInput={setInput} />
        </Card>
    </div>)
}

interface LanguageTileProps {
    language: string
}

function LanguageTile({language}: LanguageTileProps)
{
    return <div className="bg-blue-200 rounded-md flex items-center justify-center text-black h-12">
        <p>{getLanguage(language)?.name}</p>
    </div>
}