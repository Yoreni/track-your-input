import type { Settings } from "../Settings";
import { LanguageContext } from "./App";
import { Card } from "./ui/Card";
import { LanguageSelector } from "./LanguageSelector";
import { Calendar } from "./progress/Calendar";
import { DailyGoal } from "./progress/DailyGoal";
import { InputCounter } from "./progress/InputCounter";
import { Statistics } from "./progress/Statistics";
import { useContext } from "react";

interface Props 
{
    settings: Settings
    setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export function ProgressDashboard({ settings, setSettings}: Props)
{
    const learning = Object.keys(settings.learning)
    const language = useContext(LanguageContext)

    function show()
    {
        if (learning.length === 0)
            return <Card className="h-136">
                    <LanguageSelector learning={learning} setSettings={setSettings} />
                </Card>
        if (!language)
            return <Card>
                <p>Unkown language selected</p>
            </Card>
        if (!learning.includes(language))
            return <Card>
                <p>Deleted language selected</p>
            </Card>
        
        return <Dashboard settings={settings} setSettings={setSettings} />
    }

    return <>
        <div className={`flex justify-start items-center flex-col gap-2`}>
            {show()}
        </div>
    </>
}

function Dashboard({ settings, setSettings}: Props)
{
    const language = useContext(LanguageContext)
    const goal = settings?.learning[language].dailyGoal

    return <div className="flex flex-col w-full gap-2 items-center overflow-hidden">
            <Card>
                <DailyGoal language={language} goal={goal} setSettings={setSettings}/>
            </Card>
            <Card>
                <InputCounter settings={settings}/>
            </Card>
            <Card>
                <Calendar goal={goal * 60}/>
            </Card>
            <Card>
                <Statistics />
            </Card>
    </div>
}