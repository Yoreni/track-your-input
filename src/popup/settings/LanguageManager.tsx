import { useState, type Dispatch, type SetStateAction } from "react";
import type { Settings } from "../../Settings";
import { Dialog } from "../ui/Dialog";
import { DangerButton } from "../ui/DangerButton";
import { OkButton } from "../ui/OkButton";

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

    function removeLanguageLearning()
    {
        setSettings(oldSettings => {
            const { [language]: _, ...learning } = settings.learning;
            const newSettings = {...oldSettings, learning: learning}
            return newSettings
        })
        close();
    }
    
    function updateStartingHours(e: React.ChangeEvent<HTMLInputElement>)
    {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 4)
            value = "999"
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
            <div className="flex flex-col gap-2 justify-center items-center">
                <DangerButton onClick={removeLanguageLearning} label="Remove" className="w-1/2"/>
                <OkButton onClick={close} className="w-1/2"/>
            </div>
        </div>
    </Dialog>
}