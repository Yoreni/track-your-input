import { useEffect, useState } from "react";
import type { InputType, WatchDataEntry } from "../../WatchData";
import { Dialog } from "../Dialog";
import { DurationInput } from "./DurationInput";
import { HOUR_CUTOFF, normaliseDay, toIsoDate } from "../../utils";

interface Props 
{
    onSubmit: (entry: WatchDataEntry) => void
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    initalState?: WatchDataEntry
}

export function AddInputDialog( {onSubmit: onSubmit, isOpen, setOpen, initalState}: Props )
{
    const defaultDate = normaliseDay(new Date()).toISOString().split("T")[0]

    const [date, setDate] = useState(defaultDate)
    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [description, setDescription] = useState("")
    const [inputType, setInputType] = useState<InputType>("WATCHING")
    useEffect(resetState, [])
    const [durationError, setDurationError] = useState(false)

    const inputDuration = Math.round((hours * 3600) + (mins * 60))
    
    function resetState()
    {
        if (!initalState)
        {
            setDate(defaultDate)
            setHours(0)
            setMins(0)
            setDescription("")
            setInputType("WATCHING")
        }
        else
        {
            const hours = Math.floor(initalState.time / 3600)
            const mins = Math.floor(initalState.time / 60) % 60

            setDate(toIsoDate(initalState.date))
            setHours(hours)
            setMins(mins)
            setDescription(initalState.description || "")
            setInputType(initalState.type)
        }
        
        setDurationError(false)
    }

    function handleSubmit()
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
            description: description,
            type: inputType
        }
        console.log(entry)
        onSubmit(entry)
        setOpen(false)
        if (!initalState)
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
        <div className="flex gap-3 h-60 justify-center">
            {["WATCHING", "LISTENING", "CONVERSATION"].includes(inputType) && 
            <div className="h-full w-full flex justify-start flex-col gap-1">
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
            </div>}
            <div className="h-full w-full flex flex-col justify-center gap-2">
                <div>
                    <p className="text-center font-semibold">Description</p>
                    <textarea className="w-full max-h-18 bg-gray-200 dark:bg-gray-900 rounded p-0.5" rows={2} value={description} onChange={onDescriptionChange}></textarea>
                </div>
                {durationError && <p className="text-red-500 text-xs text-center">Duration cannot be 0.</p>}
                <div className="flex justify-around">
                    <DurationInput duration={hours} setDuration={setHours} unit="h" />
                    <DurationInput duration={mins} setDuration={setMins} unit="m" />
                </div>
                <div className="flex flex-col">
                    <p className="text-center font-semibold">Date</p>
                    <input type="date" className="bg-gray-200 rounded dark:bg-gray-900 roundedp p-0.5" value={date} onChange={onDateChange}/>
                </div>
            </div>
        </div>
        <div className="flex justify-around">
            <button className="border-gray-300 border-2 hover:border-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg" onClick={() => setOpen(false)}>Cancel</button>
            <button className="border-green-500 border-2 hover:border-green-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg" onClick={handleSubmit}>OK</button>
        </div>
    </Dialog>
}