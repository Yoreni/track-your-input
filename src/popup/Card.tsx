interface Props 
{
    children?: React.ReactNode;
    className?: String;
}

export function Card( {children, className}: Props )
{
    return (<div className={`bg-white rounded-md p-5 shadow-md w-11/12 ${className}`}>
        {children}
    </div>)
}