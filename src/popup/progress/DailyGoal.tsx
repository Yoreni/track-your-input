import { useState } from "react";
import { getMinutesOfInputOnDay, type WatchDataEntry } from "../../WatchData";
import { Dialog } from "../Dialog";
import { ProgressBar } from "../ProgressBar";
import { type Settings } from "../../Settings";
import { DurationInput } from "./DurationInput";

interface Props {
    input: WatchDataEntry[]
    language: string
    goal: number
    setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

export function DailyGoal({input, language, goal, setSettings}: Props)
{
    const [goalDialogOpen, setGoalDialogOpen] = useState(false)
    const [goalField, setGoalField] = useState(goal);
    const inputToday = Math.floor(getMinutesOfInputOnDay(new Date(), input))

    function changeDailyGoal(newGoal: number)
    {
        if (newGoal < 1 || newGoal > 999)
            throw new RangeError("The new goal must be between 1 and 999")
        if (newGoal % 1 !== 0)
            throw new RangeError("The new goal must be an integer")

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
        changeDailyGoal(goalField)
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
        <Dialog isOpen={goalDialogOpen} className="flex justify-center flex-col items-center gap-2">
            <p className="text-xl font-bold">Edit Daily Goal</p>
            <DurationInput duration={goalField} setDuration={setGoalField} unit={"min"} />
            <button onClick={handleDialogClose}>OK</button>
        </Dialog>
    </>)
}