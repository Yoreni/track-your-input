import { useEffect, useState } from "react";
import { Dialog } from "../ui/Dialog";
import { downloadAsCSV, isDirectDownloadSuported, parseCsvString, toCsvString } from "../../csvFile";
import { type WatchData, convertToFlattenedList, type FlattenedWatchDataEntry, convertFromFlattenedList } from "../../WatchData";
import { formatBytes } from "../../utils";
import { EXTENSION_API } from "../../extension-api";
import type { InputReducerAction } from "../App";
import { Button } from "../ui/Button";
import { DangerButton } from "../ui/DangerButton";
import { OkButton } from "../ui/OkButton";

interface Props 
{
    input: WatchData
    inputDispach: React.ActionDispatch<[action: InputReducerAction]>
}

export function WatchDataControl( { input, inputDispach}: Props)
{
    const [bytesInUse, setBytesInUse] = useState(0)

    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [deleteDataDialog, setDeleteDataDialog] = useState(false)
    const [importDataDialog, setImportDataDialog] = useState(false)

    const [importDataInput, setImportDataInput] = useState("")

    const flattenedInout = convertToFlattenedList(input)

    function updateBytesInUse()
    {
        EXTENSION_API.getLocalBytesInUse().then((bytes: any) =>
        {
            if (!bytes)
                bytes = -1
            setBytesInUse(bytes)
        }) 
    }

    useEffect(() => {
        updateBytesInUse()
    }, [])

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
         inputDispach({
            type: "set",
            data: convertFromFlattenedList(data)
        })
        setImportDataDialog(false)
    }

    function handleDataDeletion(deleteData: boolean)
    {
        if (deleteData)
        {
            inputDispach({
                type: "set",
                data: {}
            })
        }
        setDeleteDataDialog(false)
    }

    const csvString = toCsvString(flattenedInout, ["id","date","language","time","description","type"])

    return <>
        <div>
            <p className="font-bold text-lg pb-2 text-center">Data Management</p>
            <div className="flex justify-around">
                <Button onClick={() => handleExport()} label="Export" />
                <Button onClick={() => setImportDataDialog(true)} label="Import" />
                <DangerButton onClick={() => setDeleteDataDialog(true)} label="Delete Data" />
            </div>
            {bytesInUse > 0 && <p className="text-sm text-center text-gray-500">{formatBytes(bytesInUse)} in use</p>}
        </div>
        
        <Dialog isOpen={exportDialogOpen} className="flex flex-col gap-4">
            <p className="text-base text-center">Here is your data. Keep it in a safe place.</p>
            <textarea rows={10} className="font-mono text-xs bg-gray-200 dark:bg-gray-900 rounded p-0.5" value={csvString} readOnly={true}></textarea>
            <div className="flex gap-2 justify-center">
                <Button onClick={async () =>  await navigator.clipboard.writeText(csvString)} label="Copy to Clipboard" />
                <OkButton onClick={() => setExportDialogOpen(false)} />
            </div>
        </Dialog>
        <Dialog isOpen={deleteDataDialog} className="text-center flex flex-col gap-2">
            <p className="text-base text-center">Are you sure you want to delete your watch data?</p>
            <p className="text-base text-center">This can not be undone.</p>
            <div className="flex gap-2 justify-center pt-4">
                <Button onClick={() => handleDataDeletion(false)} label="No" />
                <DangerButton onClick={() => handleDataDeletion(true)}  label="Yes" />
            </div>
        </Dialog>
        <Dialog isOpen={importDataDialog} className="flex flex-col gap-4">
            <p className="text-base text-center">Enter your import data here</p>
            <textarea rows={10} className="font-mono text-xs bg-gray-200 dark:bg-gray-900 rounded p-0.5" value={importDataInput} onChange={(e) => setImportDataInput(e.target.value)}/>
            <div className="flex gap-2 justify-center">
                <Button onClick={() => setImportDataDialog(false)} label="Cancel" />
                <OkButton onClick={() => handleImport()} disabled={importDataInput.length == 0} />
            </div>
        </Dialog>
    </>
}