import { useEffect, useState, type ReactNode } from 'react';
import './App.css'
import { NavBar } from './NavBar'
import { loadWatchData, saveWatchData, type EditWatchDataEntry, type WatchData, type WatchDataEntry } from '../WatchData';
import { defaultSettings, loadSettings, saveSettings, type Settings } from '../Settings';
import { useSave } from '../useSave';
import { ProgressDashboard } from './ProgressDashboard';
import { type Screen } from '../utils';
import { SettingsPage } from './SettingsPage';
import { HistoryPage } from './HistoryPage';

async function loadSelectedLanguage()
{
  const KEY = "selectedLanguage"
  const loaded = (await browser.storage.local.get(KEY))
  if (!loaded[KEY])
    return "en"
  return loaded[KEY]
} 

function App() 
{
  const [language, setLanguage] = useState("");
  const [input, setInput] = useState<WatchData>({});
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [screen, setScreen] = useState<Screen>("PROGRESS")

  const screenComponents: Record<Screen, ReactNode> = {
    "PROGRESS": <ProgressDashboard input={getInputForLanguage(language)} addInputEntry={(entry: WatchDataEntry) => addInputEntry(language, entry)} settings={settings} setSettings={setSettings} language={language} />,
    "HISTORY": <HistoryPage input={getInputForLanguage(language)} deleteInput={(id: string) => deleteInputEntry(language, id)} editInput={(id: string, values: EditWatchDataEntry) => editInputEntry(language, id, values)}/>,
    "SETTINGS": <SettingsPage settings={settings} setSettings={setSettings} input={input} setInput={setInput}/>
  }

  useEffect(() => {
    loadSettings().then((data: Settings) => {
      setSettings(data)
      document.documentElement.classList.toggle("dark", data?.darkMode)
    })
    loadWatchData().then((data: any) => {
      setInput(data)
    })
    loadSelectedLanguage().then((data: string) => {
      setLanguage(data)
    })
  }, [])

  useEffect(() => 
  { // if user deletes the langauge that the user selected
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
  useSave(input, saveWatchData)
  useSave(language, async (language: string) => await browser.storage.local.set({selectedLanguage: language}))

  function getInputForLanguage(isoCode: string) : WatchDataEntry[]
  {
    return input[isoCode] || [];
  }

  function addInputEntry(lang: string, entry: WatchDataEntry)
  {
    try
    {
      setInput(last => {
        const currentInput = input[lang] || []
        const updatedInputList = [...currentInput, entry]
        return {...last, [lang]: updatedInputList}
      })
    }
    catch(error)
    {
      console.error("could not add input", error)
    }
  }

  function deleteInputEntry(lang: string, idToDelete: string) 
  {
    try 
    {
      setInput(last => 
      {
        const currentInputList = last[lang] || [];
        const updatedInputList = currentInputList.filter(entry => entry.id !== idToDelete);
        return { ...last, [lang]: updatedInputList };
      });
    } 
    catch (error) 
    {
      console.error("Could not delete input entry", error);
    }
  }

  function editInputEntry(lang: string, idToEdit: string, newValues: EditWatchDataEntry) 
  {
    try 
    {
      setInput(last => 
      {
        const currentInputList = last[lang] || [];
        const updatedInputList = currentInputList.map(entry => 
        {
          if (entry.id !== idToEdit)
            return entry
          return { 
              ...entry,
              description: newValues.description || entry.description,
              time: newValues.time || entry.time,
              date: newValues.date || entry.date 
          } 
        });
        return { ...last, [lang]: updatedInputList };
      });
    } 
    catch (error) 
    {
      console.error("Could not edit input entry", error);
    }
}

  return ( input && settings &&
    <>
      <NavBar language={language} learning={Object.keys(settings.learning)} setLanguage={setLanguage} setScreen={setScreen} screen={screen}/>
      <div className='pt-12 pb-1 bg-gray-200 dark:bg-gray-800 min-h-dvh '>
        {screenComponents[screen]}
      </div>
    </>
  )
}

export default App
