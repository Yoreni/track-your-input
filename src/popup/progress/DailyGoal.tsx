import { useState } from "react";
import { getInputOnDay, type WatchDataEntry } from "../../WatchData";
import { Dialog } from "../Dialog";
import { ProgressBar } from "../ProgressBar";
import { type Settings } from "../../Settings";
import { DurationInput } from "./DurationInput";
import { EditSvg } from "../icons/EditSvg";

interface Props {
    input: WatchDataEntry[]
    language: string
    goal: number
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function DailyGoal({input, language, goal, setSettings}: Props)
{
    const [goalDialogOpen, setGoalDialogOpen] = useState(false)
    const [goalField, setGoalField] = useState(goal);
    const inputToday = Math.floor(getInputOnDay(new Date(), input) / 60)

    function changeDailyGoal(newGoal: number)
    {
        if (newGoal < 1 || newGoal > 999)
            throw new RangeError("The new goal must be between 1 and 999")
        if (newGoal % 1 !== 0)
            throw new RangeError("The new goal must be an integer")

        setSettings(oldSettings => 
        {
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
                <p className='font-bold text-base'>Daily Goal</p>
                <div className="flex gap-4">
                    <button onClick={() => setGoalDialogOpen(true)} className="text-gray-500 scale-75 hover:text-gray-600 ">
                        <EditSvg />
                    </button>
                    <p className="text-base">{inputToday} / {goal} min</p>
                </div>
            </div>
            <ProgressBar progress={inputToday / goal} />
        </div>
        <Dialog isOpen={goalDialogOpen} className="flex justify-center flex-col items-center gap-4 py-2">
            <p className="text-xl font-bold">Edit Daily Goal</p>
            <DurationInput duration={goalField} setDuration={setGoalField} unit={"min"} />
            <button onClick={handleDialogClose} className="border-green-500 border-2 hover:border-green-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 text-base font-bold py-1 px-2 rounded-lg">OK</button>
        </Dialog>
    </>)
}