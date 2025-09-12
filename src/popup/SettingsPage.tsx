import { useEffect, useState, type Dispatch, type MouseEventHandler, type ReactNode, type SetStateAction } from "react";
import { Card } from "./Card";
import type { Settings } from "../Settings";
import type { WatchData } from "../WatchData";
import { getLanguage } from "../language";
import { WatchDataControl } from "./WatchDataControl";
import { Dialog } from "./Dialog";
import { LanguageSelector } from "./LanguageSelector";
import { EXTENSION_API, type BrowserInfo } from "../extension-api";


interface Props {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings>>
    input: WatchData
    setInput: Dispatch<SetStateAction<WatchData>>
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

export function SettingsPage( {settings, setSettings, input, setInput}: Props)
{
    const [browserInfo, setBrowserInfo] = useState<BrowserInfo>()
    const [addLangaugesDialog, setAddLangauagesDialog] = useState(false)

    useEffect(() => {
        EXTENSION_API.getBrowserInfo().then((data: BrowserInfo) => 
            {
                setBrowserInfo(data)
            })
    }, [])

    const learning = Object.keys(settings.learning)

    function removeLanguageLearning(language: string)
    {
        setSettings(oldSettings => {
            const { [language]: _, ...learning } = settings.learning;
            const newSettings = {...oldSettings, learning: learning}
            return newSettings
        })
    }

    return browserInfo && (<div className="flex justify-start items-center flex-col gap-2">
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
            <p className="font-bold pb-2 text-center text-lg">Languages Learning</p>
            <div className="grid grid-cols-3 gap-2">
                {learning.map((lang) => <LanguageTileX language={lang} onClick={() => removeLanguageLearning(lang)}/>)}
                <div className="text-center text-3xl text-black dark:text-white border-dashed border-3 rounded-lg border-blue-200" onClick={() => setAddLangauagesDialog(true)}>+</div>
            </div>
        </Card>
        <Card>
            <WatchDataControl input={input} setInput={setInput} />
        </Card>
        <Dialog isOpen={addLangaugesDialog} className="h-80">
            <LanguageSelector learning={learning} setSettings={setSettings} onFinish={() => setAddLangauagesDialog(false)} />
        </Dialog>
    </div>)
}

export interface LanguageTileProps {
    language: string
    children?: ReactNode
    className?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}

export function LanguageTileBase({language, children, className="", onClick}: LanguageTileProps)
{
    return <div onClick={onClick} className={`bg-blue-200 rounded-md flex items-center justify-center text-black min-h-12 ${className}`}>
        <p>{getLanguage(language)?.name}</p>
        {children}
    </div>
}

function LanguageTileX({language, onClick}: LanguageTileProps)
{
    return <LanguageTileBase language={language} className="relative">
        <div className=" bg-red-400 hover:bg-red-500 cursor-pointer transition-colors shadow-md absolute top-0 z-10 font-bold text-white right-0 w-6 h-6 rounded-xl grid place-items-center translate-x-1/2 -translate-y-1/2 " onClick={onClick}>X</div>
    </LanguageTileBase>
}
