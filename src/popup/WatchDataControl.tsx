import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog } from "./Dialog";
import { downloadAsCSV, isDirectDownloadSuported, parseCsvString, toCsvString } from "../csvFile";
import { type WatchData, convertToFlattenedList, type FlattenedWatchDataEntry, convertFromFlattenedList } from "../WatchData";
import { formatBytes } from "../utils";
import { EXTENSION_API } from "../extension-api";
// import browser from "webextension-polyfill"

interface Props 
{
    input: WatchData
    setInput: Dispatch<SetStateAction<WatchData>>
}

export function WatchDataControl( { input, setInput}: Props)
{
    const [bytesInUse, setBytesInUse] = useState(0)

    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [deleteDataDialog, setDeleteDataDialog] = useState(false)
    const [importDataDialog, setImportDataDialog] = useState(false)

    const [importDataInput, setImportDataInput] = useState("")

    const flattenedInout = convertToFlattenedList(input)

    useEffect(() => {
        EXTENSION_API.getLocalBytesInUse().then((bytes: any) =>
        {
            if (!bytes)
                bytes = -1
            setBytesInUse(bytes)
        })
    })

    function handleExport()
    {
        if (isDirectDownloadSuported())
            downloadAsCSV(flattenedInout)
        else
            setExportDialogOpen(true)
    }

    function handleImport()
    {
        let data: FlattenedWatchDataEntry[] = parseCsvString(importDataInput) as FlattenedWatchDataEntry[]
        data = data.map((entry) => { return {...entry,
            date: new Date(entry.date),  
            time: Number(entry.time)
        }})
        setInput(convertFromFlattenedList(data))
        setImportDataDialog(false)
    }

    function handleDataDeletion(deleteData: boolean)
    {
        if (deleteData)
            setInput({})
        setDeleteDataDialog(false)
    }

    const csvString = toCsvString(flattenedInout)

    return <>
        <div>
            <p className="font-bold text-lg pb-2 text-center">Data Management</p>
            <div className="flex justify-around">
                <button onClick={() => handleExport()} className="border-gray-300 border-2 p-2 rounded-lg hover:border-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold text-base">Export</button>
                <button onClick={() => setImportDataDialog(true)} className="border-gray-300 p-2 rounded-lg border-2 hover:border-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold text-base">Import</button>
                <button onClick={() => setDeleteDataDialog(true)} className="border-red-300 p-2 rounded-lg border-2 hover:border-red-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold text-base">Delete Data</button>
            </div>
            {bytesInUse > 0 && <p className="text-sm text-center text-gray-500">{formatBytes(bytesInUse)} in use</p>}
        </div>
        
        <Dialog isOpen={exportDialogOpen} className="flex flex-col gap-4">
            <p className="text-base text-center">Here is your data. Keep it in a safe place.</p>
            <textarea rows={10} className="font-mono text-xs bg-gray-200 dark:bg-gray-900 rounded p-0.5">{csvString}</textarea>
            <div className="flex gap-2 justify-center">
                <button onClick={() => setExportDialogOpen(false)} className="text-base border-gray-300 border-2 rounded-lg hover:border-gray-400 p-2 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold">OK</button>
                <button onClick={async () =>  await navigator.clipboard.writeText(csvString)} className="text-base border-gray-300 border-2 p-2 rounded-lg hover:border-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold">Copy to Clipboard</button>
            </div>
        </Dialog>
        <Dialog isOpen={deleteDataDialog} className="text-center flex flex-col gap-2">
            <p className="text-base text-center">Are you sure you want to delete your watch data?</p>
            <p className="text-base text-center">This can not be undone.</p>
            <div className="flex gap-2 justify-center pt-4">
                <button onClick={() => handleDataDeletion(false)} className="text-base border-gray-300 border-2 hover:border-gray-400 p-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold">No</button>
                <button onClick={() => handleDataDeletion(true)} className="text-base border-red-300 border-2 hover:border-red-400 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold">Yes</button>
            </div>
        </Dialog>
        <Dialog isOpen={importDataDialog} className="flex flex-col gap-4">
            <p className="text-base text-center">Enter your import data here</p>
            <textarea rows={10} className="font-mono text-xs bg-gray-200 dark:bg-gray-900 rounded p-0.5" value={importDataInput} onChange={(e) => setImportDataInput(e.target.value)}/>
            <div className="flex gap-2 justify-center">
                <button onClick={() => setImportDataDialog(false)} className="border-gray-300 border-2 hover:border-gray-400 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold">Cancel</button>
                <button onClick={() => handleImport()} className="text-base disabled:text-gray-500 disabled:border-gray-300 border-gray-300 border-2 hover:border-gray-400 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold" disabled={importDataInput.length == 0}>OK</button>
            </div>
        </Dialog>
    </>
}