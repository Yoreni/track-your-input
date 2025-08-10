// import { useState } from 'react'
import { useEffect, useState } from 'react';
import './App.css'
import { NavBar } from './NavBar'
import { loadWatchData, saveWatchData, type WatchData } from '../WatchData';
import { loadSettings, saveSettings, type Settings } from '../Settings';
import { useSave } from '../useSave';
import { ProgressDashboard } from './ProgressDashboard';

type Screen = "PROGRESS" | "SETTINGS"

function App() 
{
  const selectedDefault = "en"
  const [language, setLanguage] = useState(selectedDefault);
  const [input, setInput] = useState<WatchData[]>([]);
  const [settings, setSettings] = useState<Settings>();
  const [screen, setScreen] = useState<Screen>("PROGRESS")
  setScreen

  useEffect(() => {
    loadSettings().then((data: any) => {
      setSettings(data)
    })
    loadWatchData().then((data: any) => {
      setInput(data)
    })
  }, [])

  useSave(settings, saveSettings)
  useSave(input, saveWatchData)

  return ( input && settings &&
    <>
      <NavBar language={language} setLanguage={setLanguage}/>
      {
        screen === "PROGRESS" ?
          <ProgressDashboard input={input} setInput={setInput} settings={settings} setSettings={setSettings} language={language} />
        : <></>
      }
    </>
  )
}

export default App
