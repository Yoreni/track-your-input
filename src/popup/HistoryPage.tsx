import { Fragment, useContext, useState } from "react"
import type { WatchDataEntry } from "../WatchData"
import { AddInputDialog } from "./progress/AddInputDialog"
import { group, normaliseDay, toIsoDate } from "../utils"
import { EditSvg } from "./icons/EditSvg"
import { DeleteSvg } from "./icons/DeleteSvg"
import { InputContext, LanguageContext, type InputReducerAction } from "./App"
import { createPortal } from "react-dom"

function formatDate(date: Date, locale = "en-GB")
{
    return date.toLocaleDateString(locale, 
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    )
}

interface Props 
{
    inputDispach: React.ActionDispatch<[action: InputReducerAction]>
}

const SHOW_INCREMENT = 31

export function HistoryPage( {inputDispach}: Props )
{
    const input = useContext(InputContext)
    if (!input)
        return

    const groupedByDate = group<WatchDataEntry>(input, (entry) => toIsoDate(normaliseDay(entry.date)));
    const sortedDates = Object.keys(groupedByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); //ensure present to past

    const [showing, setShowing] = useState(Math.min(sortedDates.length, SHOW_INCREMENT))

    function makeHistoryTable()
    {
        return sortedDates.slice(0, showing).map(date => (
                <Fragment key={date}>
                    <p className="font-bold text-base text-center pt-2">{formatDate(new Date(date))}</p>
                    <Table input={groupedByDate[date]} inputDispach={inputDispach}/>
                </Fragment>
           ))
    }

    const historyTable = makeHistoryTable()

    return (
        <div className="p-2 bg-gray-200 dark:bg-gray-800 mx-auto text-black dark:text-white">
            {input.length > 0 ? 
            <>
                {historyTable}
                {showing < sortedDates.length &&
                    <div className="flex justify-center pt-2">
                        <button className="border-gray-300 border-2 p-2 rounded-lg hover:border-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold text-base" onClick={() => setShowing(last => Math.min(sortedDates.length, last + SHOW_INCREMENT))}>Show more</button>
                    </div> 
                }
            </>
            :
            <>
                <p className="text-2xl text-center text-gray-500 font-bold">No History</p>
                <p className="text-base text-center text-gray-500">History will appear here as you watch videos</p>
            </>}
        </div>
    )
}

interface TableProps 
{
    input: WatchDataEntry[]
    inputDispach: React.ActionDispatch<[action: InputReducerAction]>
}

function Table({input, inputDispach}: TableProps)
{
    return (
        <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead>
                <tr className="bg-gray-400 dark:bg-gray-600 text-md font-medium">
                    <th className="px-2 py-1 text-left tracking-wider">Description</th>
                    <th className="px-2 py-1 text-left tracking-wider">Time</th>
                    <th className="px-2 py-1 text-center tracking-wider">Act.</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {input.map((entry, index) => <Row key={entry.id} entry={entry} isEven={index % 2 === 0} 
                    inputDispach={inputDispach}/>)} 
            </tbody>
        </table>
    )
}

interface RowProps
{
    entry: WatchDataEntry;
    isEven: boolean;
    inputDispach: React.ActionDispatch<[action: InputReducerAction]>

}

function Row( {entry, isEven, inputDispach}: RowProps)
{
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const rowClasses = isEven ? "dark:bg-gray-800 bg-gray-200" : "dark:bg-gray-700 bg-gray-300";
    const language = useContext(LanguageContext)

    function handleEdit(editing: WatchDataEntry)
    {
        inputDispach({
            type: "edit",
            language: language,
            data: {...editing, id: entry.id}
        })
    }

    return (
        <>
            <tr className={rowClasses}>
                <td className="px-2 py-1 max-w-50 overflow-ellipsis overflow-hidden text-nowrap">{entry.description ? entry.description : entry.id}</td>
                <td className="px-2 py-1">{formatTime(entry.time)}</td>
                <td className="px-2 py-1 text-center whitespace-nowrap">
                    <button className="bg-green-600 hover:bg-green-700 text-gray-300 scale-[85%] hover:text-gray-400 text-xs py-0.5 px-1 rounded mr-1" onClick={() => setEditDialogOpen(true)}>
                        <EditSvg />
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-gray-300 scale-[85%] hover:text-gray-400 text-xs py-0.5 px-1 rounded" 
                        onClick={() => inputDispach(
                            {type: "delete", 
                            language: language, 
                            id: entry.id}
                    )}>
                        <DeleteSvg />
                    </button>
                </td>
            </tr>
            {createPortal(
                <AddInputDialog onSubmit={handleEdit} isOpen={editDialogOpen} setOpen={setEditDialogOpen} initalState={entry}/>,
                document.body
            )}
        </>
    )
}

function formatTime(seconds: number)
{
    const mins = Math.floor(seconds / 60) % 60
    const hours = Math.floor(seconds / 3600)
    if (seconds < 60)
        return "<1m"

    let out = []
    if (hours > 0)
        out.push(`${hours}h`)
    if (mins > 0)
        out.push(`${mins}m`)
    return out.join(" ")
}
