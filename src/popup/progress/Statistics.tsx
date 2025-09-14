import { normaliseDay } from "../../utils";
import { getInputOnDay, type WatchDataEntry } from "../../WatchData";
import { StatisticsCell } from "./StatisticsCell";

const STREAK_CAP = 7;

interface StatisticsProp 
{
    input: WatchDataEntry[]
}

function getStreak(input: WatchDataEntry[]) 
{
    let streak = 0;
    let checkingDate = new Date();

    if (getInputOnDay(checkingDate, input) > 0)     //check for today
        ++streak;
    checkingDate.setDate(checkingDate.getDate() - 1); 

    while (getInputOnDay(checkingDate, input) > 0)
    {
        ++streak;
        checkingDate.setDate(checkingDate.getDate() - 1); 
    }
    
    return streak;
}

function getDaysPracticed(input: WatchDataEntry[])
{
    const daysPracticed = input
        .map(item => normaliseDay(item.date).getTime()) 
    return new Set(daysPracticed).size
}

export function Statistics({input}: StatisticsProp)
{
    const streak = Math.min(getStreak(input), STREAK_CAP);
    const daysPracticed = getDaysPracticed(input)

    return <div>
        <p className="font-bold text-base">Statistics</p>
        <div className="flex flex-col gap-2">
            <StatisticsCell dataPoint={streak} description={`/${STREAK_CAP} day streak`}/>
            <StatisticsCell dataPoint={daysPracticed.toLocaleString()} description=" days practiced"/>
        </div>
    </div>
}
