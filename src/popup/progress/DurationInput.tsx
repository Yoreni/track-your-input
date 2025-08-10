interface Props {
    duration: number
    setDuration:  React.Dispatch<React.SetStateAction<number>>
    unit: string
}

export function DurationInput({ duration: value, setDuration: setValue, unit }: Props)
{
    function handleChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 3)
            value = "999"
        else if (value === "0")
            value = ""
        setValue(Number(value))
    }

    return <div className="flex gap-1">
        <input type="text" onChange={handleChange} value={value} className="w-8 text-center"/>
        <p>{unit}</p>
    </div>
}