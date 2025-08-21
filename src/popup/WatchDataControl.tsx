import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog } from "./Dialog";
import { downloadAsCSV, isDirectDownloadSuported, parseCsvString, toCsvString } from "../csvFile";
import type { WatchData } from "../WatchData";
import { formatBytes } from "../utils";

interface Props 
{
    input: WatchData[]
    setInput: Dispatch<SetStateAction<WatchData[]>>
}

export function WatchDataControl( { input, setInput}: Props)
{
    const [bytesInUse, setBytesInUse] = useState(0)

    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [deleteDataDialog, setDeleteDataDialog] = useState(false)
    const [importDataDialog, setImportDataDialog] = useState(false)

    const [importDataInput, setImportDataInput] = useState("")

    useEffect(() => {
        if (browser.storage.local.getBytesInUse)
        {
            browser.storage.local.getBytesInUse().then((bytes) =>
            {
                if (!bytes)
                    bytes = -1
                setBytesInUse(bytes)
            })
        }
    })

    function handleExport()
    {
        if (isDirectDownloadSuported())
            downloadAsCSV(input)
        else
            setExportDialogOpen(true)
    }

    function handleImport()
    {
        let data: WatchData[] = parseCsvString(importDataInput) as WatchData[]
        data = data.map((entry) => { return {...entry, date: new Date(entry.date)}})
        setInput(data)
        setImportDataDialog(false)
    }

    function handleDataDeletion(deleteData: boolean)
    {
        if (deleteData)
            setInput([])
        setDeleteDataDialog(false)
    }

    const csvString = toCsvString(input)

    return <>
        <div>
            <div className="flex justify-around">
                <button onClick={() => handleExport()}>Export Data</button>
                <button onClick={() => setDeleteDataDialog(true)}>Delete Data</button>
                <button onClick={() => setImportDataDialog(true)}>Import Data</button>
            </div>
            {bytesInUse > 0 && <p className="text-sm text-center text-gray-500">{formatBytes(bytesInUse)} in use</p>}
        </div>
        
        <Dialog isOpen={exportDialogOpen} className="flex flex-col gap-4">
            <p>Here is your data. Keep it in a safe place.</p>
            <textarea rows={10} className="font-mono text-xs">{csvString}</textarea>
            <button onClick={() => setExportDialogOpen(false)}>OK</button>
            <button onClick={async () =>  await navigator.clipboard.writeText(csvString)}>Copy to Clipboard</button>
        </Dialog>
        <Dialog isOpen={deleteDataDialog} className="text-center">
            <p>Are you sure you want to delete your watch data?</p>
            <p>This can not be undone.</p>
            <div className="flex gap-2 justify-center">
                <button onClick={() => handleDataDeletion(true)}>Yes</button>
                <button onClick={() => handleDataDeletion(false)}>No</button>
            </div>
        </Dialog>
        <Dialog isOpen={importDataDialog} className="flex flex-col gap-4">
            <p>Enter your import data here</p>
            <textarea rows={10} className="font-mono text-xs" value={importDataInput} onChange={(e) => setImportDataInput(e.target.value)}/>
            <button onClick={() => setImportDataDialog(false)}>Cancel</button>
            <button onClick={() => handleImport()} className="disabled:text-gray-500" disabled={importDataInput.length == 0}>OK</button>
        </Dialog>
    </>
}