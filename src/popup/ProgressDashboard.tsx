import type { Settings } from "../Settings";
import type { WatchDataEntry } from "../WatchData";
import { Card } from "./Card";
import { LanguageSelector } from "./LanguageSelector";
import { Calendar } from "./progress/Calendar";
import { DailyGoal } from "./progress/DailyGoal";
import { InputCounter } from "./progress/InputCounter";
import { Statistics } from "./progress/Statistics";

interface Props 
{
    input: WatchDataEntry[]
    addInputEntry: (entry: WatchDataEntry) => void
    settings: Settings
    setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>
    language: string
}

export function ProgressDashboard({input, addInputEntry, settings, setSettings, language}: Props)
{
    const learning = Object.keys(settings.learning)

    function show()
    {
        if (learning.length === 0)
            return <Card className="h-full">
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
        
        return <Dashboard input={input} addInputEntry={addInputEntry} settings={settings} setSettings={setSettings} language={language} />
    }

    return <>
        <div className={`flex justify-start items-center flex-col min-h-dvh bg-gray-200 dark:bg-gray-800 gap-2 pt-12 pb-1 ${learning.length ? "" : "h-dvh"}`}>
            {show()}
        </div>
    </>
}

function Dashboard({input, addInputEntry, settings, setSettings, language}: Props)
{
    const goal = settings?.learning[language].dailyGoal

    return <>
            <Card>
                <DailyGoal input={input} language={language} goal={goal} setSettings={setSettings}/>
            </Card>
            <Card>
                <InputCounter input={input} language={language} addInputEntry={addInputEntry} settings={settings}/>
            </Card>
            <Card>
                <Calendar input={input} language={language} goal={goal}/>
            </Card>
            <Card>
                <Statistics input={input} language={language}/>
            </Card>
    </>
}