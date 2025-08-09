import { useState } from "react";
import { getMinutesOfInputOnDay } from "../utils";
import type { WatchData } from "../WatchData";
import { Dialog } from "./Dialog";
import { ProgressBar } from "./ProgressBar";
import { type Settings } from "../Settings";

interface Props {
    input: WatchData[]
    language: string
    goal: number
    setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

export function DailyGoal({input, language, goal, setSettings}: Props)
{
    const [goalDialogOpen, setGoalDialogOpen] = useState(false)
    const [goalField, setGoalField] = useState(goal);
    const inputToday = Math.floor(getMinutesOfInputOnDay(new Date(), input, language))

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

    function onGoalFieldChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 3)
            value = "999"
        else if (value === "0")
            value = ""
        setGoalField(Number(value))
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
            <div className="flex gap-1">
                <input type="text" onChange={onGoalFieldChange} value={goalField} className="w-8 text-center"/>
                <p>min</p>
            </div>
            <button onClick={handleDialogClose}>OK</button>
        </Dialog>
    </>)
}