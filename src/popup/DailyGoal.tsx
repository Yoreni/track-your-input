import { useState } from "react";
import { getMinutesOfInputOnDay } from "../utils";
import type { WatchData } from "../WatchData";
import { Dialog } from "./Dialog";
import { ProgressBar } from "./ProgressBar";
import type { Settings } from "../Settings";

interface Props {
    input: WatchData[]
    language: string
    goal: number
    setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

export function DailyGoal({input, language, goal, setSettings}: Props)
{
    const [goalDialogOpen, setGoalDialogOpen] = useState(false)
    const inputToday = Math.floor(getMinutesOfInputOnDay(new Date(), input, language))

    function changeDailyGoal(newGoal: number)
    {
        setSettings(oldSettings => {
            if (oldSettings === undefined)
                return undefined
            const newLearning = {dailyGoal: newGoal}
            const newSettings = {...oldSettings, learning: {
                ...oldSettings.learning,
                [language]: newLearning
            }}
            return newSettings
        })
    }

    function handleDialogClose()
    {
        setGoalDialogOpen(false)
        changeDailyGoal(Math.floor(Math.random() * 998) + 1)
    }

    return ( <>
        <div>
            <div className='flex justify-between'>
                <p className='font-bold'>Daily Goal</p>
                <div className="flex gap-1">
                    <button onClick={() => setGoalDialogOpen(true)}>edit</button>
                    <p>{inputToday} / {goal} min</p>
                </div>
            </div>
            <ProgressBar progress={inputToday / goal} />
        </div>
        <Dialog isOpen={goalDialogOpen} className="flex justify-center">
            <button onClick={handleDialogClose}>OK</button>
        </Dialog>
    </>)
}