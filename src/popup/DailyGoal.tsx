import { getDayInput } from "../utils";
import type { WatchData } from "../WatchData";
import { ProgressBar } from "./ProgressBar";

interface Props {
    input: WatchData[]
}

export function DailyGoal({input}: Props)
{
    const goal = 60;
    const inputToday = Math.floor(getDayInput(new Date(), input, "en"))

    return ( <>
        <div className='flex justify-between'>
            <p className='font-bold'>Daily Goal</p>
            <p>{inputToday} / {goal} min</p>
        </div>
        <ProgressBar progress={inputToday / goal} />
    </>)
}