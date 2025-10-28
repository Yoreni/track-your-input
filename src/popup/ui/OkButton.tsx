import { Button, type ButtonProps } from "./Button";

export function OkButton({label="OK", onClick=()=>{}, className="", disabled=false}: ButtonProps)
{
    return <Button label={label} onClick={onClick} disabled={disabled} className={`border-green-500 border-2 hover:border-green-700 ${className}`}/>
}