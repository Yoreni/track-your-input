interface Props 
{
    children?: React.ReactNode;
    className?: String;
}

export function Card( {children, className}: Props )
{
    return (<div className={`bg-white rounded-md p-5 m-0 shadow-md w-11/12 dark:bg-gray-700 dark:text-white ${className}`}>
        {children}
    </div>)
}