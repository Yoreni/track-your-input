import { Fragment, useContext, useMemo, useState } from "react"
import type { EditWatchDataEntry, WatchDataEntry } from "../WatchData"
import { AddInputDialog } from "./progress/AddInputDialog"
import { group, normaliseDay, toIsoDate } from "../utils"
import { EditSvg } from "./icons/EditSvg"
import { DeleteSvg } from "./icons/DeleteSvg"
import { InputContext } from "./App"
import { createPortal } from "react-dom"

interface Props 
{
    deleteInput: (id: string) => void
    editInput: (id: string, values: EditWatchDataEntry) => void
}

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

export function HistoryPage( {deleteInput, editInput}: Props )
{
    const input = useContext(InputContext)
    if (!input)
        return

    function makeHistoryTable(input: WatchDataEntry[])
    {
        const groupedByDate = group<WatchDataEntry>(input, (entry) => toIsoDate(normaliseDay(entry.date)));
        const sortedDates = Object.keys(groupedByDate)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); //ensure present to past

        return sortedDates.map(date => (
                <Fragment key={date}>
                    <p className="font-bold text-base text-center pt-2">{formatDate(new Date(date))}</p>
                    <Table input={groupedByDate[date]} deleteInput={deleteInput} editInput={editInput}/>
                </Fragment>
           ))
    }

    const historyTable = useMemo(() => makeHistoryTable(input), [input])

    return (
        <div className="p-2 bg-gray-200 dark:bg-gray-800 mx-auto text-black dark:text-white">
            {input.length > 0 ? historyTable :
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
    deleteInput: (id: string) => void
    editInput: (id: string, values: EditWatchDataEntry) => void
}

function Table({input, deleteInput, editInput}: TableProps)
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
                    deleteInput={() => deleteInput(entry.id)} editInput={(values: EditWatchDataEntry) => editInput(entry.id, values)}/>)} 
            </tbody>
        </table>
    )
}

interface RowProps
{
    entry: WatchDataEntry;
    isEven: boolean;
    deleteInput: () => void;
    editInput: (values: EditWatchDataEntry) => void;
}

function Row( {entry, isEven, deleteInput, editInput}: RowProps)
{
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    function handleEdit(entry: WatchDataEntry)
    {
        editInput({
            description: entry.description, 
            date: entry.date, 
            time: entry.time,
            type: entry.type
        })
    }

    const rowClasses = isEven ? "dark:bg-gray-800 bg-gray-200" : "dark:bg-gray-700 bg-gray-300";
    return (
        <>
            <tr className={rowClasses}>
                <td className="px-2 py-1 max-w-50 overflow-ellipsis overflow-hidden text-nowrap">{entry.description ? entry.description : entry.id}</td>
                <td className="px-2 py-1">{formatTime(entry.time)}</td>
                <td className="px-2 py-1 text-center whitespace-nowrap">
                    <button className="bg-green-600 hover:bg-green-700 text-gray-300 scale-[85%] hover:text-gray-400 text-xs py-0.5 px-1 rounded mr-1" onClick={() => setEditDialogOpen(true)}>
                        <EditSvg />
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-gray-300 scale-[85%] hover:text-gray-400 text-xs py-0.5 px-1 rounded" onClick={deleteInput}>
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
