import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { formatBytes } from "../utils";
import { Card } from "./Card";
import type { Settings } from "../Settings";
import { downloadAsCSV, isDirectDownloadSuported, toCsvString } from "../csvFile";
import type { WatchData } from "../WatchData";
import { Dialog } from "./Dialog";

interface Props {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings | undefined>>
    input: WatchData[]
    setInput: Dispatch<SetStateAction<WatchData[]>>
}

function toggleDarkMode(value: boolean, setSettings: Dispatch<SetStateAction<Settings | undefined>>): void
{
    setSettings(oldState => {
        if (!oldState)
            return
        return {...oldState, darkMode: value}
    })
    document.documentElement.classList.toggle("dark", value)
}

function toggleExcatTime(value: boolean, setSettings: Dispatch<SetStateAction<Settings | undefined>>): void
{
    setSettings(oldState => {
        if (!oldState)
            return
        return {...oldState, showExcatTime: value}
    })
}

export function SettingsPage( {settings, setSettings, input, setInput}: Props)
{
    const [bytesInUse, setBytesInUse] = useState(10 ** (Math.random() * 8))
    const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo>()

    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [deleteDataDialog, setDeleteDataDialog] = useState(false)

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
        browser.runtime.getBrowserInfo().then(data => setBrowserInfo(data))
    })

    function handleExport()
    {
        if (isDirectDownloadSuported())
            downloadAsCSV(input)
        else
        {
            setExportDialogOpen(true)
        }
    }

    function handleDataDeletion(deleteData: boolean)
    {
        if (deleteData)
            setInput([])
        setDeleteDataDialog(false)
    }

    const csvString = toCsvString(input)

    return browserInfo && (<div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 dark:bg-gray-800 gap-2 pt-12 pb-1">
        <Card>
            <div className='flex justify-between'>
                <p className='text-lg'>Display Excat Time</p>
                <input type="checkbox"  checked={settings.showExcatTime} onChange={(event) => toggleExcatTime(event.target.checked, setSettings)} />
            </div>
            <div className='flex justify-between'>
                <p className='text-lg'>Dark Mode</p>
                <input type="checkbox" checked={settings.darkMode} onChange={(event) => toggleDarkMode(event.target.checked, setSettings)}/>
            </div>
            {browserInfo && <>
                <p className='text-gray-400 text-sm'>{browserInfo.vendor} {browserInfo.name} {browserInfo.version}-{browserInfo.buildID}</p>
            </>}
        </Card>
        <Card>
            <button onClick={() => handleExport()}>Export Data</button>
            <button onClick={() => setDeleteDataDialog(true)}>Delete Data</button>
            {bytesInUse > 0 && <p className="text-sm text-center text-gray-500">{formatBytes(bytesInUse)} in use</p>}
        </Card>
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
    </div>)
}