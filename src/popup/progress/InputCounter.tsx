import { useState } from 'react';
import { calculateTotalTime, type WatchDataEntry } from '../../WatchData';
import { ProgressBar } from '../ProgressBar';
import { AddInputDialog } from './AddInputDialog';
import type { Settings } from '../../Settings';
interface Props {
    input: WatchDataEntry[]
    addInputEntry: (entry: WatchDataEntry) => void
    settings: Settings
}

const HOURS_FOR_LEVEL = Object.freeze([0, 50, 150, 300, 600, 1000, 1500])

const formatHoursFunctions: Record<string, (hours: number) => string> =
{
  "excat": (seconds) => {
    const {mins, hours} = calcMinsHours(seconds)
    if (hours < 1)
      return `${mins}m`
    return `${Math.floor(hours)}h ${mins}m`
  },
  "default": (seconds) => {
    const {mins, hours} = calcMinsHours(seconds)
    if (hours === 0)
      return `${mins}min${mins !== 1 ? "s" : ""}`
    return `${hours.toLocaleString("en")} hour${hours !== 1 ? "s" : ""}`
  }
}

function calcMinsHours(seconds: number)
{
  if (seconds < 0)
    seconds = Math.abs(seconds)
  
  const totalMins = Math.floor(seconds / 60)
  const hours = Math.floor(seconds / 3600)
  const mins = totalMins % 60
  return {totalMins, hours, mins}
}

function getLevel(seconds: number): number
{
  const hours = Math.floor(seconds / 3600)
  let level = 0;
  while (HOURS_FOR_LEVEL[level] <= hours)
    ++level 
  return Math.max(level, 1)
}

function roundToNearestMin(hours: number, round: (a: number) => number = Math.round)
{
  if (hours === 0)
    return 0
  const FACTOR = 60
  return round((hours * FACTOR) + Number.EPSILON * 2) / FACTOR
}

function calcProgress(input: any)
{
    const totalInput = calculateTotalTime(input)
    const hours = Math.floor(totalInput / 3600)
    const level = getLevel(totalInput)
    if (level == HOURS_FOR_LEVEL.length) //handle max level
        return {level, remainingInput: 0, progress: 1, hours, totalInput}

    const remainingInput = (HOURS_FOR_LEVEL[level] * 3600) - totalInput;
    const hoursInLevel = (HOURS_FOR_LEVEL[level] - HOURS_FOR_LEVEL[level - 1])
    const progress = (hours - HOURS_FOR_LEVEL[level - 1]) / hoursInLevel
    return {level, progress, totalInput,
      hours: roundToNearestMin(hours),
      remainingInput: remainingInput
    }
}

export function InputCounter( {input, addInputEntry, settings}: Props )
{
    const [addInputDialogOpen, setAddInputDialogOpen] = useState(false)

    function formatHours(seconds: number)
    {
      const func = formatHoursFunctions[settings.showExcatTime ? "excat" : "default"]
      return func(seconds)
    }

    const progress = calcProgress(input)
    return <>
        <div className='flex justify-between'>
            <p className='font-bold'>Total Input</p>
            <p>{formatHours(progress.totalInput)}</p>
        </div>
        { progress.level < HOURS_FOR_LEVEL.length &&
        <>
        <ProgressBar progress={progress.progress} />
        <div className='flex justify-between'>
            <p className='text-gray-400 text-sm'>{HOURS_FOR_LEVEL[progress.level - 1]}h</p>
            <p>{formatHours(progress.remainingInput)} to go</p>
            <p className='text-gray-400 text-sm'>{HOURS_FOR_LEVEL[progress.level]}h</p>
        </div>
        </>
        }
        <p className='text-center font-semibold text-gray-800 dark:text-gray-200'>Level {progress.level}</p>
        <div>
          <button onClick={() => setAddInputDialogOpen(true)}>+</button>
        </div>
        <AddInputDialog isOpen={addInputDialogOpen} addInputEntry={addInputEntry} setOpen={setAddInputDialogOpen}/>
    </>
}