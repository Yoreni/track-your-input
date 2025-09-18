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
    addInputEntry: (entry: WatchDataEntry) => void
    settings: Settings
    setSettings: React.Dispatch<React.SetStateAction<Settings>>
    language: string
}

export function ProgressDashboard({addInputEntry, settings, setSettings, language}: Props)
{
    const learning = Object.keys(settings.learning)

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
        
        return <Dashboard addInputEntry={addInputEntry} settings={settings} setSettings={setSettings} language={language} />
    }

    return <>
        <div className={`flex justify-start items-center flex-col gap-2`}>
            {show()}
        </div>
    </>
}

function Dashboard({addInputEntry, settings, setSettings, language}: Props)
{
    const goal = settings?.learning[language].dailyGoal

    return <>
            <Card>
                <DailyGoal language={language} goal={goal} setSettings={setSettings}/>
            </Card>
            <Card>
                <InputCounter addInputEntry={addInputEntry} settings={settings}/>
            </Card>
            <Card>
                <Calendar goal={goal * 60}/>
            </Card>
            <Card>
                <Statistics />
            </Card>
    </>
}