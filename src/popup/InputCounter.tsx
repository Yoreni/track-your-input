import { ProgressBar } from './ProgressBar';

interface Props {
    input: any
    language: string
}

const HOURS_FOR_LEVEL = [0, 50, 150, 300, 600, 1000, 1500]

function formatHours(hours: number, rounding = Math.floor)
{
  const mins = Math.floor(hours * 60)
  hours = rounding(hours)
  if (hours === 0)
    return `${mins}min${mins !== 1 ? "s" : ""}`
  return `${hours.toLocaleString("en")} hour${hours !== 1 ? "s" : ""}`
}

function getLevel(hours: number): number
{
  let level = 0;
  while (HOURS_FOR_LEVEL[level] <= hours)
    ++level 
  return Math.max(level, 1)
}

function calcProgress(input: any, language: string)
{
    const hours = calculateTotalHours(input, language)
    const level = getLevel(hours)
    if (level == HOURS_FOR_LEVEL.length) //handle max level
        return {level, remainingHours: 0, progress: 1, hours}

    const remainingHours = HOURS_FOR_LEVEL[level] - hours;
    const hoursInLevel = (HOURS_FOR_LEVEL[level] - HOURS_FOR_LEVEL[level - 1])
    const progress = (hours - HOURS_FOR_LEVEL[level - 1]) / hoursInLevel
    return {level, remainingHours, progress, hours}
}

function calculateTotalHours(input: any, language: string)
{
    let seconds = 0;
    console.log(Object.values(input))
    Object.values(input).forEach((entry: any) => {
        if (language === entry.language)
            seconds += entry.time
    })
    return seconds / 3600;
}

export function InputCounter( {input, language}: Props )
{
    const progress = calcProgress(input, language)
    return <>
        <div className='flex justify-between'>
            <p className='font-bold'>Total Input</p>
            <p>{formatHours(progress.hours)}</p>
        </div>
        { progress.level < HOURS_FOR_LEVEL.length &&
        <>
        <ProgressBar progress={progress.progress} />
        <div className='flex justify-between'>
            <p className='text-gray-400 text-sm'>{HOURS_FOR_LEVEL[progress.level - 1]}h</p>
            <p>{formatHours(progress.remainingHours, Math.ceil)} to go</p>
            <p className='text-gray-400 text-sm'>{HOURS_FOR_LEVEL[progress.level]}h</p>
        </div>
        </>
        }
        <p className='text-center font-semibold text-gray-800'>Level {progress.level}</p>
    </>
}