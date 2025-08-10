import type { Settings } from "../Settings";
import type { WatchData } from "../WatchData";
import { Card } from "./Card";
import { Calendar } from "./progress/Calendar";
import { DailyGoal } from "./progress/DailyGoal";
import { InputCounter } from "./progress/InputCounter";
import { Statistics } from "./progress/Statistics";

interface Props 
{
    input: WatchData[]
    setInput: React.Dispatch<React.SetStateAction<WatchData[]>>
    settings: Settings
    setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>
    language: string
}

export function ProgressDashboard({input, setInput, settings, setSettings, language}: Props)
{
    const goal = settings?.learning[language].dailyGoal

    return <>
        <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12 pb-1">
            <Card>
                <DailyGoal input={input} language={language} goal={goal} setSettings={setSettings}/>
            </Card>
            <Card>
                <InputCounter input={input} language={language} setInput={setInput}/>
            </Card>
            <Card>
                <Calendar input={input} language={language} goal={goal}/>
            </Card>
            <Card>
                <Statistics input={input} language={language}/>
            </Card>
        </div>
    </>
}