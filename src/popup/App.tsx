// import { useState } from 'react'
import { useEffect, useState } from 'react';
import './App.css'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { NavBar } from './NavBar'
import { Statistics } from './Statistics';
import { InputCounter } from './InputCounter';
import type { WatchData } from '../WatchData';
import { DailyGoal } from './DailyGoal';

function App() 
{
  const selectedDefault = "de"
  const [language, setLanguage] = useState(selectedDefault);
  const [input, setInput] = useState<WatchData[]>([]);

  useEffect(() => {
    browser.storage.local.get('youtubeWatchTimes').then((data: any) => {
      setInput(Object.values(data.youtubeWatchTimes) || [])
      console.log(input)
    })
  })

  return ( input &&
    <>
      <NavBar language={language} setLanguage={setLanguage}/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12 pb-1">
        <Card>
          <DailyGoal input={input}/>
        </Card>
        <Card>
          <InputCounter input={input} language='en'/>
        </Card>
        <Card>
          <Calendar input={input}/>
        </Card>
        <Card>
          <Statistics input={input}/>
        </Card>
        <Card>
          <p>Selected language: {language}</p>
        </Card>
      </div>
    </>
  )
}

export default App
