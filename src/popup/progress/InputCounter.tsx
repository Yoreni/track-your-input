import { useContext } from 'react';
import { calculateTotalTime } from '../../WatchData';
import { ProgressBar } from '../ui/ProgressBar';
import { languageDefaultSettings, type LanguageSettings, type Settings } from '../../Settings';
import { InputContext, LanguageContext } from '../App';

interface Props 
{
    settings: Settings
}

const HOURS_FOR_LEVEL = Object.freeze([0, 50, 150, 300, 600, 1000, 1500])

const DifficultyMultiplier: Record<string, number> = {
    "related": 0.5,
    "distant": 1,
    "unrelated": 2
}

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

function getLevel(seconds: number, mult: number = 1): number
{
  const hours = Math.floor(seconds / 3600)
  let level = 0;
  while (getLevelRequiredHours(level, mult) <= hours)
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

function getLevelRequiredHours(level: number, mult: number = 1)
{
  if (level <= 0)
    return 0;
  if (level > HOURS_FOR_LEVEL.length)
    return HOURS_FOR_LEVEL[HOURS_FOR_LEVEL.length - 1] * mult

  return HOURS_FOR_LEVEL[level] * mult
}

function getMult(settings: LanguageSettings)
{
  return DifficultyMultiplier[settings.difficulty || languageDefaultSettings.difficulty]
}

function calcProgress(input: any, settings: LanguageSettings)
{
    const startingHours = (settings.startingHours || languageDefaultSettings.startingHours) * 3600
    const totalInput = calculateTotalTime(input) + startingHours
    const mult = getMult(settings)

    const hours = Math.floor(totalInput / 3600)
    const level = getLevel(totalInput, mult)
    if (level == HOURS_FOR_LEVEL.length) //handle max level
        return {level, remainingInput: 0, progress: 1, hours, totalInput}

    const remainingInput = (getLevelRequiredHours(level, mult) * 3600) - totalInput;
    const hoursInLevel = (getLevelRequiredHours(level, mult) - getLevelRequiredHours(level - 1, mult))
    const progress = (hours - getLevelRequiredHours(level - 1, mult)) / hoursInLevel
    return {level, progress, totalInput,
      hours: roundToNearestMin(hours),
      remainingInput: remainingInput
    }
}

export function InputCounter( {settings}: Props )
{

    const input = useContext(InputContext)
    if (!input)
        return

    function formatHours(seconds: number)
    {
      const func = formatHoursFunctions[settings.showExcatTime ? "excat" : "default"]
      return func(seconds)
    }

    const langauge = useContext(LanguageContext)
    const languageSettings = settings.learning[langauge]
    const progress = calcProgress(input, languageSettings)

    const mult = getMult(languageSettings)
    return <div className="relative">
        <div className='flex justify-between'>
            <p className='font-bold text-base'>Total Input</p>
            <p className='text-base'>{formatHours(progress.totalInput)}</p>
        </div>
        { progress.level < HOURS_FOR_LEVEL.length &&
        <>
        <ProgressBar progress={progress.progress} />
        <div className='flex justify-between'>
            <p className='text-gray-400 text-sm'>{getLevelRequiredHours(progress.level - 1, mult)}h</p>
            <p className='text-base'>{formatHours(progress.remainingInput)} to go</p>
            <p className='text-gray-400 text-sm'>{getLevelRequiredHours(progress.level, mult)}h</p>
        </div>
        </>
        }
        <p className='text-center text-base font-semibold text-gray-800 dark:text-gray-200'>Level {progress.level}</p>
        <div>
      </div>
    </div>
}