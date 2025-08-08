import { getMinutesOfInputOnDay } from "../utils";
import type { WatchData } from "../WatchData";
import { ProgressBar } from "./ProgressBar";

interface Props {
    input: WatchData[]
    language: string
}

export function DailyGoal({input, language}: Props)
{
    const goal = 60;
    const inputToday = Math.floor(getMinutesOfInputOnDay(new Date(), input, language))

    return ( <>
        <div className='flex justify-between'>
            <p className='font-bold'>Daily Goal</p>
            <p>{inputToday} / {goal} min</p>
        </div>
        <ProgressBar progress={inputToday / goal} />
    </>)
}