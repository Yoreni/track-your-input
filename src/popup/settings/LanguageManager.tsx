import { useState, type Dispatch, type SetStateAction } from "react";
import type { Settings } from "../../Settings";
import { Dialog } from "../Dialog";

interface Props 
{
    language: string;
    settings: Settings;
    isOpen: boolean;
    setSettings: Dispatch<SetStateAction<Settings>>;
}

function LanguageManager({language, settings, isOpen, setSettings}: Props)
{
    const [startingHours, setStartingHours] = useState()

    function removeLanguageLearning()
    {
        setSettings(oldSettings => {
            const { [language]: _, ...learning } = settings.learning;
            const newSettings = {...oldSettings, learning: learning}
            return newSettings
        })
    }

    return <Dialog isOpen={isOpen}>
        
    </Dialog>
}