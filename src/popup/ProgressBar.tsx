interface Props 
{
    progress: number
}

export function ProgressBar( {progress}: Props)
{
    progress = Math.min(Math.max(progress, 0), 1)
    return  <div className="bg-gray-300 dark:bg-gray-800 w-full h-4 rounded-md overflow-hidden flex">
        <div className="bg-green-700 rounded-md transition-[width]" style={{ width: `${progress * 100}%` }} />
    </div>
}