import { useState, type Dispatch, type SetStateAction } from "react";
import { languageDefaultSettings, type Settings } from "../../Settings";
import { Dialog } from "../ui/Dialog";
import { DangerButton } from "../ui/DangerButton";
import { OkButton } from "../ui/OkButton";
import type { Difficulty } from "../../language";

interface Props 
{
    language: string;
    settings: Settings;
    isOpen: boolean;
    setSettings: Dispatch<SetStateAction<Settings>>;
    close: () => void
}

export function LanguageManager({language, settings, isOpen, setSettings, close}: Props)
{
    const [startingHours, setStartingHours] = useState(settings.learning[language].startingHours || 0)
    const [difficulty, setDifficulty] = useState<Difficulty>(settings.learning[language].difficulty || languageDefaultSettings.difficulty)

    function removeLanguageLearning()
    {
        setSettings(oldSettings => {
            const { [language]: _, ...learning } = settings.learning;
            const newSettings = {...oldSettings, learning: learning}
            return newSettings
        })
        close();
    }

    function updateDifficulty(e: React.ChangeEvent<HTMLSelectElement>)
    {
        const value = e.target.value as Difficulty
        setDifficulty(value)

        setSettings((oldSettings: Settings) => 
        {
            const newLearning = {...oldSettings.learning[language], difficulty: value}
            const newSettings = {...oldSettings, learning: {
                ...oldSettings.learning,
                [language]: newLearning
            }}
            return newSettings
        })
    }
    
    function updateStartingHours(e: React.ChangeEvent<HTMLInputElement>)
    {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 4)
            value = "9999"
        else if (value === "0")
            value = ""
        const numericalValue = Number(value)
        setStartingHours(numericalValue)

        setSettings((oldSettings: Settings) => 
        {
            const newLearning = {...oldSettings.learning[language], startingHours: numericalValue}
            const newSettings = {...oldSettings, learning: {
                ...oldSettings.learning,
                [language]: newLearning
            }}
            return newSettings
        })
    }

    return <Dialog isOpen={isOpen}>
        <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-6">
                <p>Base Input: </p>
                <div className="flex gap-2">
                    <input type="text" className="w-12 text-center text-base bg-gray-200 dark:bg-gray-900 rounded" value={startingHours} onChange={updateStartingHours}/>
                    <p>hours</p>
                </div>
            </div>
            <div className="flex justify-center gap-6">
                <p className="text-center">Level Mult.</p>
                <select value={difficulty} onChange={updateDifficulty} className="dropdown-toggle dark:bg-gray-700 bg-gray-200 dark:text-white p-1 text-black rounded text-sm" >
                    <option value="related">x½ (Related)</option>
                    <option value="distant">x1 (Distant)</option>
                    <option value="unrelated">x2 (Unrelated)</option>
                </select>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
                <DangerButton onClick={removeLanguageLearning} label="Remove" className="w-1/2"/>
                <OkButton onClick={close} className="w-1/2"/>
            </div>
        </div>
    </Dialog>
}