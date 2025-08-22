import { useEffect, useState, type Dispatch, type MouseEventHandler, type ReactNode, type SetStateAction } from "react";
import { Card } from "./Card";
import type { Settings } from "../Settings";
import type { WatchData } from "../WatchData";
import { getLanguage, LANGUAGES } from "../language";
import { WatchDataControl } from "./WatchDataControl";
import { Dialog } from "./Dialog";

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
    const [addLangaugesDialog, setAddLangauagesDialog] = useState(false)

    useEffect(() => {
        browser.runtime.getBrowserInfo().then(data => setBrowserInfo(data))
    })

    const learning = Object.keys(settings.learning)
    const notLearning = LANGUAGES.filter(lang => !learning.includes(lang.iso))

    function removeLanguageLearning(language: string)
    {
        setSettings(oldSettings => {
            if (oldSettings === undefined)
                return undefined
            const { [language]: _, ...learning } = settings.learning;
            const newSettings = {...oldSettings, learning: learning}
            return newSettings
        })
    }

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
                {learning.map((lang) => <LanguageTileX language={lang} onClick={() => removeLanguageLearning(lang)}/>)}
                <div className="text-center text-3xl text-white border-dashed border-3 rounded-lg border-blue-200" onClick={() => setAddLangauagesDialog(true)}>+</div>
            </div>
        </Card>
        <Card>
            <WatchDataControl input={input} setInput={setInput} />
        </Card>
        <Dialog isOpen={addLangaugesDialog} className="flex flex-col gap-4 items-center">
            <p className="font-bold text-center text-xl">Add Langauges Learning</p>
            <div className="flex gap-2 flex-col items-center overflow-scroll h-60 w-full">
                {notLearning.map(lang => <LangaugesTileSelect language={lang.iso} startActive={false}/>)}
            </div>
            <button onClick={() => setAddLangauagesDialog(false)}>OK</button>
        </Dialog>
    </div>)
}

interface LanguageTileProps {
    language: string
    children?: ReactNode
    className?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}

function LanguageTileBase({language, children, className="", onClick}: LanguageTileProps)
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

interface LanguageTileSelectProps extends LanguageTileProps
{
    startActive: boolean
    clickCallback?: (event: any) => void
}

function LangaugesTileSelect({language, startActive}: LanguageTileSelectProps)
{
    const [active, setActive] = useState(startActive)

    function handleClick()
    {
        setActive(last => !last)
    }

    const activeClass = "bg-green-500 shadow-md shadow-green-800"
    const inactiveClass = "bg-gray-500"

    return <LanguageTileBase className={`select-none text-lg w-11/12 ${active ? activeClass : inactiveClass}`} language={language} onClick={handleClick}/>
}