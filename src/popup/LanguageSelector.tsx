import { useState, type Dispatch, type SetStateAction } from "react"
import type { Settings } from "../Settings"
import { LanguageTileBase, type LanguageTileProps } from "./SettingsPage"
import { LANGUAGES } from "../language"

interface Props 
{
    learning: string[]
    setSettings: Dispatch<SetStateAction<Settings | undefined>>
    onFinish: () => void
}

export function LanguageSelector({learning, setSettings, onFinish}: Props)
{
    setSettings
    const notLearning = LANGUAGES.filter(lang => !learning.includes(lang.iso))

    function handleOk()
    {
        onFinish();
    }

    return <>
        <p className="font-bold text-center text-xl">Add Langauges Learning</p>
        <div className="flex gap-2 flex-col items-center overflow-scroll h-60 w-full">
            {notLearning.map(lang => <LangaugesTileSelect language={lang.iso} startActive={false}/>)}
        </div>
        <button onClick={handleOk}>OK</button>
    </>
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