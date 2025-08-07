export function Statistics()
{
    return <div>
        <p className="font-bold">Statistics</p>
        <div className="flex flex-col gap-2">
            <Cell dataPoint="7" description="/7 day streak"/>
            <Cell dataPoint="123" description=" days practiced"/>
        </div>
    </div>
}

interface CellProp {
    dataPoint: string
    description: string
    backgroundClass?: string
    textClass?: string
}

function Cell({dataPoint, description, backgroundClass = "bg-lime-100", textClass = "text-lime-600"}: CellProp)
{
    return <div className={`${backgroundClass} rounded-md p-3`}>
        <p className={`font-bold ${textClass} text-2xl m-0`}>{dataPoint} <span className="m-0 font-normal text-lg">{description}</span></p>
    </div>
}