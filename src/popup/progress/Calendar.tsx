// import { useState } from "react";

import { useState } from "react"
import { getDaysInMonth, isOnSameDay } from "../../utils"
import { calcInputThisMonth, getInputDataForMonth, type WatchDataEntry } from "../../WatchData"
import { StatisticsCell } from "./StatisticsCell"

function formatDateHeader(date: Date, locale: Intl.LocalesArgument = "en"): String
{
    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
    })
}

function formatInputMins(seconds: number)
{
    const mins = Math.floor(seconds / 60);
    if (mins < 1)
        return "<1m"
    return `${mins}m`
}

function drawDayCells(monthDisplay: Date, input: WatchDataEntry[], goal: number)
{
    const firstDayOfMonth = new Date(monthDisplay.getFullYear(), monthDisplay.getMonth(), 1);
    const daysInMonth = getDaysInMonth(monthDisplay);
    let cells  = []
    const now = new Date()

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) 
        cells.push(<DayCell cellType={"FILLER"}/>)

    const perDayInput = getInputDataForMonth(monthDisplay, input)
    for (let day = 1; day <= daysInMonth; day++) 
    {
        const secsOfInput = perDayInput[day];
        let type: DayCellType = "FILLER"
        const lookingAtDate = new Date(new Date(firstDayOfMonth).setDate(day))

        if (now < lookingAtDate || isOnSameDay(now, lookingAtDate)) 
            type = "FUTURE"
        else if (secsOfInput === 0)
            type = "NO_INPUT"
        else if (secsOfInput >= goal)
            type = "GOAL_REACHED"
        else
            type = "LOW_INPUT"
        cells.push(<DayCell day={day} input={secsOfInput} cellType={type}/>);
    }

    return cells;
}

interface CalendarProps 
{
    input: WatchDataEntry[]
    goal: number
}

export function Calendar({input, goal}: CalendarProps )
{
    input;
    const [monthDisplay, setMonthDisplay] = useState(new Date())

    function changeMonth(amount: number)
    {
        if (amount === 0)
            return;
        setMonthDisplay(new Date(new Date(monthDisplay).setMonth(monthDisplay.getMonth() + amount)))
    }

    const hoursThisMonth = Math.floor((calcInputThisMonth(monthDisplay, input) / 3600) * 10) / 10

    return <div>
        <div className="flex justify-between items-center mb-5 select-none">
            <span className="text-2xl cursor-pointer text-gray-400 p-1" onClick={() => changeMonth(-1)}>&lt;</span>
            <h2 className="text-xl font-bold text-700 m-0" id="calendar-title">{formatDateHeader(monthDisplay)}</h2>
            <span className="text-2xl cursor-pointer text-gray-400 p-1"onClick={() => changeMonth(1)}>&gt;</span>
        </div>
        <div className="grid grid-cols-7 text-center font-bold text-gray-400 mb-2.5">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-1" id="calendarGrid">
            {drawDayCells(monthDisplay, input, goal)}
        </div>
        <div className="py-1">
            <StatisticsCell dataPoint={hoursThisMonth} description="hours this month"/>
        </div>
    </div>
}

type DayCellType = "NO_INPUT" | "LOW_INPUT" | "GOAL_REACHED" | "FUTURE" | "FILLER"


interface DayCellProps {
    day?: number
    input?: number
    cellType: DayCellType
}

const cellTypeClass: Record<DayCellType, string> = {
    "NO_INPUT": "",
    "LOW_INPUT": "bg-[#abff8a] text-gray-700",
    "GOAL_REACHED": "bg-[#359101] text-white",
    "FUTURE": "text-gray-200",
    "FILLER": ""
}

function DayCell( {day, input = 0, cellType}: DayCellProps )
{
    return <div className={`flex flex-col justify-center m-0 p-0 items-center h-11 max-h-11 max-w-11 rounded-lg text-md ${cellTypeClass[cellType]}`} >
        <p className="font-bold text-base">{day}</p>
        {input > 0 && <div className="text-xs font-normal text-rgba(180, 180, 180, 0.8) mr-0.5">
            {formatInputMins(input)}
        </div>}
    </div>
}