import { useState } from "react";
import type { WatchDataEntry } from "../../WatchData";
import { Dialog } from "../Dialog";
import { DurationInput } from "./DurationInput";
import { HOUR_CUTOFF, normaliseDay } from "../../utils";

type InputType = "WATCHING" | "LISTENING" | "CONVERSATION"

interface Props {
    addInputEntry: (entry: WatchDataEntry) => void
    language: string
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddInputDialog( {addInputEntry, isOpen, setOpen}: Props )
{
    const defaultDate = normaliseDay(new Date()).toISOString().split("T")[0]

    const [date, setDate] = useState(defaultDate)
    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [description, setDescription] = useState("")
    const [inputType, setInputType] = useState<InputType>("WATCHING")

    const [durationError, setDurationError] = useState(false)

    const inputDuration = Math.round((hours * 3600) + (mins * 60))
    
    function resetState()
    {
        setDate(defaultDate)
        setHours(0)
        setMins(0)
        setDescription("")
        setInputType("WATCHING")

        setDurationError(false)
    }

    function addEntry()
    {
        if (inputDuration === 0)
        {
            setDurationError(true)
            return;
        }

        const entry: WatchDataEntry = {
            time: inputDuration,
            date: new Date(new Date(date).setHours(HOUR_CUTOFF)),
            id: `m${new Date().toISOString()}${Math.floor(Math.random() * 100)}`,
            description: description
        }
        console.log(entry)
        addInputEntry(entry)
        setOpen(false)
        resetState()
    }

    function onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>)
    {
        setDescription(e.target.value)
    }

    function onDateChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        setDate(event.target.value)
    }

    function onInputTypeChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        setInputType(event.target.value as InputType)
    }

    return <Dialog isOpen={isOpen} className="flex flex-col gap-3">
        <p className="font-bold text-xl text-center">Track Input Manually</p>
        <div className="flex gap-3 h-60">
            <div className="w-1/2 h-full flex justify-start flex-col gap-1">
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"WATCHING"} className="m-0.5" checked={inputType === "WATCHING"} onChange={onInputTypeChange}/>
                    <p className="text-sm text-center">Watching videos or series</p>
                </div>
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"LISTENING"} className="m-0.5" checked={inputType === "LISTENING"} onChange={onInputTypeChange}/>
                    <p className="text-sm text-center">Listening to podcasts</p>
                </div>
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"CONVERSATION"} className="m-0.5" checked={inputType === "CONVERSATION"} onChange={onInputTypeChange}/>
                    <p className="text-sm text-center">Crosstalk or Speaking Practice </p>
                </div>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center gap-2">
                <div>
                    <p className="text-center">Description</p>
                    <textarea className="w-full max-h-18" rows={2} value={description} onChange={onDescriptionChange}></textarea>
                </div>
                {durationError && <p className="text-red-500 text-xs text-center">Duration cannot be 0.</p>}
                <div className="flex justify-around">
                    <DurationInput duration={hours} setDuration={setHours} unit="h" />
                    <DurationInput duration={mins} setDuration={setMins} unit="m" />
                </div>
                <div>
                    <p className="text-center">Date</p>
                    <input type="date" value={date} onChange={onDateChange}/>
                </div>
            </div>
        </div>
        <div className="flex justify-around">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={addEntry}>Add</button>
        </div>
    </Dialog>
}