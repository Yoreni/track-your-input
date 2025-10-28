export interface ButtonProps
{
    label?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function Button({label="", onClick=()=>{}, className="", disabled=false}: ButtonProps)
{
    return <button 
        onClick={onClick}
        disabled={disabled}
        className={`disabled:text-gray-500 disabled:border-gray-300 border-gray-300 border-2 hover:border-gray-400 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-200 text-gray-800 font-bold text-base py-2 px-4 ${className}`}>
        {label}
    </button>
}