interface Props 
{
    progress: number
}

export function ProgressBar( {progress}: Props)
{
    progress = Math.min(Math.max(progress, 0), 1)
    return  <div className="bg-gray-300 w-full h-4 rounded-md overflow-hidden flex">
        <div className="bg-green-700 rounded-md" style={{ width: `${progress * 100}%` }} />
    </div>
}