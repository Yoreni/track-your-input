interface CellProp {
    dataPoint: string | number
    description: string
    backgroundClass?: string
    textClass?: string
}

export function StatisticsCell({dataPoint, description, backgroundClass = "bg-lime-100 dark:bg-lime-900", textClass = "text-lime-600 dark:text-lime-400"}: CellProp)
{
    return <div className={`${backgroundClass} rounded-md p-3`}>
        <p className={`font-bold ${textClass} text-2xl m-0`}>{dataPoint} <span className="m-0 font-normal text-lg">{description}</span></p>
    </div>
}