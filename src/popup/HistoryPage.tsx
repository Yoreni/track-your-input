import type { EditWatchDataEntry, WatchDataEntry } from "../WatchData"

interface Props 
{
    input: WatchDataEntry[]
    deleteInput: (id: string) => void
    editInput: (id: string, values: EditWatchDataEntry) => void
}

interface Props 
{
    input: WatchDataEntry[]
    deleteInput: (id: string) => void
    editInput: (id: string, values: EditWatchDataEntry) => void
}

export function HistoryPage( {input, deleteInput, editInput}: Props )
{
    input; deleteInput; editInput; 
    return (
        <div className="p-2 bg-gray-200 dark:bg-gray-800 mx-auto text-black dark:text-white">
            <table className="min-w-full divide-y divide-gray-700 text-sm"> {/* Smaller text size for table */}
                <thead>
                    <tr className="bg-gray-400 dark:bg-gray-600">
                        <th className="px-2 py-1 text-left text-xs font-medium tracking-wider">Description</th>
                        <th className="px-2 py-1 text-left text-xs font-medium tracking-wider">Time</th>
                        <th className="px-2 py-1 text-center text-xs font-medium tracking-wider">Act.</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {input.map((entry, index) => <Row key={entry.id} entry={entry} isEven={index % 2 === 0}/>)} 
                </tbody>
            </table>
        </div>
    )
}

interface RowProps
{
    entry: WatchDataEntry;
    isEven: boolean;
    // deleteInput: (id: string) => void;
    // editInput: (id: string, values: EditWatchDataEntry) => void;
}

function Row( {entry, isEven}: RowProps)
{
    console.log(isEven)
    const rowClasses = isEven ? "dark:bg-gray-800 bg-gray-200" : "dark:bg-gray-700 bg-gray-300";
    return (
        <tr className={rowClasses}>
            <td className="px-2 py-1 max-w-50 overflow-ellipsis overflow-hidden text-nowrap">{entry.description || entry.id}</td> {/* Adjusted max-width for description */}
            <td className="px-2 py-1">{formatTime(entry.time)}</td>
            <td className="px-2 py-1 text-center whitespace-nowrap">
                <button className="bg-green-600 hover:bg-green-700 text-white text-xs py-0.5 px-1 rounded mr-1">✏️</button>
                <button className="bg-red-600 hover:bg-red-700 text-white text-xs py-0.5 px-1 rounded">🗑️</button>
            </td>
        </tr>
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
