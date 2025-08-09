// import { useState } from "react";
import type { WatchData } from "./WatchData";
import { Dialog } from "./popup/Dialog";

// type InputType = "LISTENING" | "READING" | "CONVERSATION"

interface Props {
    setInput: React.Dispatch<React.SetStateAction<WatchData[]>>
    language: string
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddInputDialog( {isOpen}: Props )
{
    // const [date, setDate] = useState(new Date())
    // const [hours, setHours] = useState(0)
    // const [mins, setMins] = useState(0)
    // const [description, setDescription] = useState("")
    // const [inputType, setInputType] = useState<InputType>("LISTENING")

    // const inputToBeAdded = hours + (mins / 60)

    // function addEntry()
    // {
    //     const entry: WatchData = {
    //         time: inputToBeAdded,
    //         language,
    //         date
    //     }
    //     setInput(lastState => {
    //         return [
    //             ...lastState,
    //             entry
    //         ]
    //     })
    // }

    return <Dialog isOpen={isOpen} className="flex flex-col gap-3">
        <p className="font-bold text-xl text-center">Track Input Manually</p>
        <div className="flex gap-3 h-60">
            <div className="w-1/2 h-full flex justify-start flex-col gap-1">
                {/* Radio buttons */}
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"LISTENING"} className="m-0.5"/>
                    <p className="text-sm text-center">Watching videos or listening to podcats</p>
                </div>
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"READING"} className="m-0.5"/>
                    <p className="text-sm text-center">Reading books or articles</p>
                </div>
                <div className="border-gray-400 border-1 rounded-md w-full h-full flex items-center gap-1">
                    <input type="radio" name="input-type" value={"CONVERSATION"} className="m-0.5"/>
                    <p className="text-sm text-center">Crosstalk or Speaking Practice </p>
                </div>
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center gap-2">
                <div>
                    <p className="text-center">Description</p>
                    <textarea className="w-full max-h-18" rows={2}></textarea>
                </div>
                <div className="flex justify-around">
                    <div className="flex flex-start gap-1">
                        <input type="text" className="w-6 text-center" value="0"/>
                        <p>h</p>
                    </div>
                    <div className="flex flex-start gap-1">
                        <input type="text" className="w-6 text-center" value="0"/>
                        <p>m</p>
                    </div>
                </div>
                <div>
                    <p className="text-center">Date</p>
                    <input type="date" value={new Date().toISOString()}/>
                </div>
            </div>
        </div>
        <button>Add</button>
    </Dialog>
}