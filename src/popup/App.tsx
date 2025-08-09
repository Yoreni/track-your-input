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
import { loadSettings, saveSettings, type Settings } from '../Settings';

function App() 
{
  const selectedDefault = "de"
  const [language, setLanguage] = useState(selectedDefault);
  const [input, setInput] = useState<WatchData[]>([]);
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    browser.storage.local.get('youtubeWatchTimes').then((data: any) => {
      if (!data.youtubeWatchTimes)
        data = {}
      else
        data = data.youtubeWatchTimes
      setInput(Object.values(data) || [])
    }).catch(error => {
      console.log("Could not load input data")
      console.error(error)
    })
  }, [])

  useEffect(() => {
    loadSettings().then((data: any) => {
      setSettings(data)
    })
  }, [])

useEffect(() => {
  if (!settings) 
    return;

  (async () => {
    try {
      await saveSettings(settings);
    } catch (err) {
      console.error("Error with saving settings:", err);
    }
  })();
}, [settings]);


  return ( input && settings && 
    <>
      <NavBar language={language} setLanguage={setLanguage}/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12 pb-1">
        <Card>
          <DailyGoal input={input} language={language} goal={settings.learning[language].dailyGoal} setSettings={setSettings}/>
        </Card>
        <Card>
          <InputCounter input={input} language={language}/>
        </Card>
        <Card>
          <Calendar input={input} language={language}/>
        </Card>
        <Card>
          <Statistics input={input} language={language}/>
        </Card>
        <Card>
          <p>Selected language: {language}</p>
        </Card>
      </div>
    </>
  )
}

export default App
