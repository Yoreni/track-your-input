import { Button, type ButtonProps } from "./Button";

export function DangerButton({label="", onClick=()=>{}, className="", disabled=false}: ButtonProps)
{
    return <Button label={label} onClick={onClick} disabled={disabled} className={`border-red-300 border-2 hover:border-red-400 ${className}`}/>
}