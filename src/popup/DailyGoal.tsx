import { useState } from "react";
import { getMinutesOfInputOnDay } from "../utils";
import type { WatchData } from "../WatchData";
import { Dialog } from "./Dialog";
import { ProgressBar } from "./ProgressBar";

interface Props {
    input: WatchData[]
    language: string
    goal: number
}

export function DailyGoal({input, language, goal}: Props)
{
    const [goalDialogOpen, setGoalDialogOpen] = useState(false)

    const inputToday = Math.floor(getMinutesOfInputOnDay(new Date(), input, language))

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
            <button onClick={() => setGoalDialogOpen(false)}>OK</button>
        </Dialog>
    </>)
}