import { useContext, useState } from "react";
import { getInputOnDay } from "../../WatchData";
import { Dialog } from "../ui/Dialog";
import { ProgressBar } from "../ui/ProgressBar";
import { type Settings } from "../../Settings";
import { DurationInput } from "./DurationInput";
import { EditSvg } from "../icons/EditSvg";
import { InputContext } from "../App";
import { OkButton } from "../ui/OkButton";

interface Props 
{
    language: string
    goal: number
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function DailyGoal({language, goal, setSettings}: Props)
{
    const input = useContext(InputContext)
    if (!input)
        return

    const [goalDialogOpen, setGoalDialogOpen] = useState(false)
    const [goalField, setGoalField] = useState(goal);
    const inputToday = Math.floor(getInputOnDay(new Date(), input) / 60)

    function changeDailyGoal(newGoal: number)
    {
        if (newGoal < 1 || newGoal > 999)
            throw new RangeError("The new goal must be between 1 and 999")
        if (newGoal % 1 !== 0)
            throw new RangeError("The new goal must be an integer")

        setSettings((oldSettings: Settings) => 
        {
            const newLearning = {...oldSettings.learning[language], dailyGoal: newGoal}
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
            <OkButton onClick={handleDialogClose} />
        </Dialog>
    </>)
}