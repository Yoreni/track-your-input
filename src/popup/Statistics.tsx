import { getMinutesOfInputOnDay, normaliseDay } from "../utils";
import type { WatchData } from "../WatchData"

const STREAK_CAP = 7;

interface StatisticsProp {
    input: WatchData[]
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

export function Statistics({input}: StatisticsProp)
{
    const streak = Math.min(getStreak(input, "en"), STREAK_CAP);
    const daysPracticed = getDaysPracticed(input, "en")

    return <div>
        <p className="font-bold">Statistics</p>
        <div className="flex flex-col gap-2">
            <Cell dataPoint={streak} description={`/${STREAK_CAP} day streak`}/>
            <Cell dataPoint={daysPracticed.toLocaleString()} description=" days practiced"/>
        </div>
    </div>
}

interface CellProp {
    dataPoint: string | number
    description: string
    backgroundClass?: string
    textClass?: string
}

function Cell({dataPoint, description, backgroundClass = "bg-lime-100", textClass = "text-lime-600"}: CellProp)
{
    return <div className={`${backgroundClass} rounded-md p-3`}>
        <p className={`font-bold ${textClass} text-2xl m-0`}>{dataPoint} <span className="m-0 font-normal text-lg">{description}</span></p>
    </div>
}