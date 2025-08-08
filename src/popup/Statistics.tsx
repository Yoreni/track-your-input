import { getMinutesOfInputOnDay, normaliseDay } from "../utils";
import type { WatchData } from "../WatchData"
import { StatisticsCell } from "./StatisticsCell";

const STREAK_CAP = 7;

interface StatisticsProp {
    input: WatchData[]
    language: string
}

function getStreak(input: WatchData[], language: string) 
{
    let streak = 0;
    let checkingDate = new Date();

    if (getMinutesOfInputOnDay(checkingDate, input, language) > 0)     //check for today
        ++streak;
    checkingDate.setDate(checkingDate.getDate() - 1); 

    while (getMinutesOfInputOnDay(checkingDate, input, language) > 0)
    {
        ++streak;
        checkingDate.setDate(checkingDate.getDate() - 1); 
    }
    
    return streak;
}

function getDaysPracticed(input: WatchData[], language: string)
{
    const daysPracticed = input
        .filter(item => item.language === language)
        .map(item => normaliseDay(item.date).getTime()) 
    return new Set(daysPracticed).size
}

export function Statistics({input, language}: StatisticsProp)
{
    const streak = Math.min(getStreak(input, language), STREAK_CAP);
    const daysPracticed = getDaysPracticed(input, language)

    return <div>
        <p className="font-bold">Statistics</p>
        <div className="flex flex-col gap-2">
            <StatisticsCell dataPoint={streak} description={`/${STREAK_CAP} day streak`}/>
            <StatisticsCell dataPoint={daysPracticed.toLocaleString()} description=" days practiced"/>
        </div>
    </div>
}
