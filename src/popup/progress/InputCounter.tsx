import { useState } from 'react';
import { calculateTotalHours } from '../../utils';
import type { WatchData } from '../../WatchData';
import { ProgressBar } from '../ProgressBar';
import { AddInputDialog } from './AddInputDialog';
import type { Settings } from '../../Settings';
interface Props {
    input: WatchData[]
    language: string
    setInput: React.Dispatch<React.SetStateAction<WatchData[]>>
    settings: Settings
}

const HOURS_FOR_LEVEL = Object.freeze([0, 50, 150, 300, 600, 1000, 1500])

const formatHoursFunctions: Record<string, (hours: number) => string> =
{
  "excat": (hours) => {
    const mins = Math.floor((hours % 1) * 60)
    if (hours < 1)
      return `${mins}m`
    return `${Math.floor(hours)}h ${mins}m`
  },
  "default": (hours) => {
    const mins = Math.floor(hours * 60)
    hours = Math.floor(hours)
    if (hours === 0)
      return `${mins}min${mins !== 1 ? "s" : ""}`
    return `${hours.toLocaleString("en")} hour${hours !== 1 ? "s" : ""}`
  }
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
    return {level, progress, hours,
      remainingHours: Math.floor(remainingHours * 60) / 60
    }
}

export function InputCounter( {input, language, setInput, settings}: Props )
{
    const [addInputDialogOpen, setAddInputDialogOpen] = useState(false)

    function formatHours(hours: number)
    {
      const func = formatHoursFunctions[settings.showExcatTime ? "excat" : "default"]
      return func(hours)
    }

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
            <p>{formatHours(progress.remainingHours)} to go</p>
            <p className='text-gray-400 text-sm'>{HOURS_FOR_LEVEL[progress.level]}h</p>
        </div>
        </>
        }
        <p className='text-center font-semibold text-gray-800'>Level {progress.level}</p>
        <button onClick={() => setAddInputDialogOpen(true)}>+</button>
        <AddInputDialog isOpen={addInputDialogOpen} language={language} setInput={setInput} setOpen={setAddInputDialogOpen}/>
    </>
}