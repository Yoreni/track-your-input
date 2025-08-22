import { useState, type Dispatch, type SetStateAction } from "react"
import { languageDefaultSettings, type Settings } from "../Settings"
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
    const notLearning = LANGUAGES.filter(lang => !learning.includes(lang.iso))
    const [selected, setSelected] = useState<string[]>([])

    function handleOk()
    {
        const newLanguages = selected.map(language => {return {[language]: languageDefaultSettings}})
        console.log(JSON.stringify(newLanguages))
        setSettings((last: any) => {
            const newLearningSection = {...last?.learning, ...Object.assign({}, ...newLanguages)}
            console.log(JSON.stringify(newLearningSection))
            return {...last, learning: newLearningSection}
        })
        onFinish();
    }

    function handleSelect(langauge: string)
    {
        if (selected.includes(langauge))
            setSelected(last => last.filter(entry => entry !== langauge))
        else
            setSelected(last => [...last, langauge])
    }

    return <>
        <p className="font-bold text-center text-lg">What are you learning?</p>
        <div className="flex gap-2 flex-col items-center overflow-scroll h-60 w-full">
            {notLearning.map(lang => <LangaugesTileSelect language={lang.iso} active={selected.includes(lang.iso)} onClick={() => handleSelect(lang.iso)}/>)}
        </div>
        <button onClick={handleOk}>OK</button>
    </>
}

interface LanguageTileSelectProps extends LanguageTileProps
{
    active: boolean
    clickCallback?: (event: any) => void
    onClick: any
}

function LangaugesTileSelect({language, active, onClick}: LanguageTileSelectProps)
{
    const activeClass = "bg-green-500 shadow-md shadow-green-800"
    const inactiveClass = "bg-gray-500"

    return <LanguageTileBase className={`select-none text-lg w-11/12 ${active ? activeClass : inactiveClass}`} language={language} onClick={onClick}/>
}