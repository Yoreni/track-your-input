// import { useState } from 'react'
import './App.css'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { NavBar } from './NavBar'
import { ProgressBar } from './ProgressBar';

const HOURS_FOR_LEVEL = [0, 50, 150, 300, 600, 1000, 1500]

function formatHours(hours: number, rounding = Math.floor)
{
  const mins = Math.floor(hours * 60)
  hours = rounding(hours)
  if (hours === 0)
    return `${mins}min${mins !== 1 ? "s" : ""}`
  return `${hours} hour${hours !== 1 ? "s" : ""}`
}

function getLevel(hours: number)
{
  let level = 0;
  while (HOURS_FOR_LEVEL[level] <= hours)
    ++level

  if (level == HOURS_FOR_LEVEL.length) //handle max level
    return {level, remainingHours: 0, progress: 1, hours}
  if (hours < 0)
    level = 1

  const remainingHours = HOURS_FOR_LEVEL[level] - hours;
  const hoursInLevel = (HOURS_FOR_LEVEL[level] - HOURS_FOR_LEVEL[level - 1])
  const progress = (hours - HOURS_FOR_LEVEL[level - 1]) / hoursInLevel
  return {level, remainingHours, progress, hours}
}

function App() {
  const inputToday = 23;
  const goal = 60
  const progress = getLevel(374.849)
  console.log(progress)

  return (
    <>
      <NavBar/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12">
        <Card className="">
          <div className='flex justify-between'>
            <p className='font-bold'>Daily Goal</p>
            <p>{inputToday}/{goal} min</p>
          </div>
          <ProgressBar progress={inputToday / goal} />
        </Card>
        <Card>
          <div className='flex justify-between'>
            <p className='font-bold'>Total Input</p>
            <p>{formatHours(progress.hours)}</p>
          </div>
          { progress.level < 7 &&
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
        </Card>
        <Card>
          <Calendar />
        </Card>
      </div>
    </>
  )
}

export default App
