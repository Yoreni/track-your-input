import { useEffect, useState } from 'react';
import './App.css'
import { NavBar } from './NavBar'
import { loadWatchData2, saveWatchData2, type WatchData, type WatchDataEntry } from '../WatchData';
import { loadSettings, saveSettings, type Settings } from '../Settings';
import { useSave } from '../useSave';
import { ProgressDashboard } from './ProgressDashboard';
import { type Screen } from '../utils';
import { SettingsPage } from './SettingsPage';

function App() 
{
  const selectedDefault = "en"
  const [language, setLanguage] = useState(selectedDefault);
  const [input, setInput] = useState<WatchData>({});
  const [settings, setSettings] = useState<Settings>();
  const [screen, setScreen] = useState<Screen>("PROGRESS")

  useEffect(() => {
    loadSettings().then((data: Settings) => {
      setSettings(data)
      document.documentElement.classList.toggle("dark", data?.darkMode)
    })
    loadWatchData2().then((data: any) => {
      console.log(JSON.stringify(data))
      setInput(data)
    })
  }, [])

  useEffect(() => { // if user deletes the langauge that the user selected
    if (!settings)
      return

    const learning = Object.keys(settings?.learning) 
    if (!learning.includes(language))
    {
      if (learning.length > 0)
        setLanguage(learning[0])
      else
        setLanguage("unknown")
    }
  }, [settings])

  useSave(settings, saveSettings)
  useSave(input, saveWatchData2)

  function getInputForLanguage(isoCode: string) : WatchDataEntry[]
  {
    return input[isoCode] || [];
  }

  function addInputEntry(lang: string, entry: WatchDataEntry)
  {
    setInput(last => {
      const newInputList = [...input[lang], entry]
      return {...last, [lang]: newInputList}
    })
  }

  return ( input && settings &&
    <>
      <NavBar language={language} learning={Object.keys(settings.learning)} setLanguage={setLanguage} setScreen={setScreen} screen={screen}/>
      {
        screen === "PROGRESS" ?
          <ProgressDashboard input={getInputForLanguage(language)} addInputEntry={(entry: WatchDataEntry) => addInputEntry(language, entry)} settings={settings} setSettings={setSettings} language={language} />
        : <SettingsPage settings={settings} setSettings={setSettings} input={input} setInput={setInput}/>
      }
    </>
  )
}

export default App
