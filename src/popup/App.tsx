// import { useState } from 'react'
import { useEffect, useState } from 'react';
import './App.css'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { NavBar } from './NavBar'
import { ProgressBar } from './ProgressBar';
import { Statistics } from './Statistics';
import { InputCounter } from './InputCounter';
import { isOnSameDay, calculateTotalHours } from '../utils';
import type { WatchData } from '../WatchData';

function App() 
{
  const [input, setInput] = useState<WatchData[]>([]);
  useEffect(() => {
    browser.storage.local.get('youtubeWatchTimes').then((data: any) => {
      setInput(Object.values(data.youtubeWatchTimes) || [])
      console.log(input)
    })
  })

  const inputToday = calculateTotalHours(input.filter((entry: WatchData) => isOnSameDay(new Date(), entry.date)), "en") * 60
  const goal = 60

  return ( input &&
    <>
      <NavBar/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12 pb-1">
        <Card className="">
          <div className='flex justify-between'>
            <p className='font-bold'>Daily Goal</p>
            <p>{Math.floor(inputToday)} / {goal} min</p>
          </div>
          <ProgressBar progress={inputToday / goal} />
        </Card>
        <Card>
          <InputCounter input={input} language='en'/>
        </Card>
        <Card>
          <Calendar />
        </Card>
        <Card>
          <Statistics />
        </Card>
      </div>
    </>
  )
}

export default App
