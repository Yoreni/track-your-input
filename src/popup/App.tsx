import { createContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import './App.css'
import { NavBar } from './NavBar'
import { loadWatchData, saveWatchData, type WatchData, type WatchDataEntry } from '../WatchData';
import { defaultSettings, loadSettings, saveSettings, type Settings } from '../Settings';
import { useSave } from '../useSave';
import { ProgressDashboard } from './ProgressDashboard';
import { type Screen } from '../utils';
import { SettingsPage } from './SettingsPage';
import { HistoryPage } from './HistoryPage';
import { EXTENSION_API } from '../extension-api';

export type InputReducerAction =
  | { type: 'set'; data: WatchData}
  | { type: 'add'; language: string; data: WatchDataEntry }
  | { type: 'delete'; language: string, id: string }
  | { type: 'edit'; language: string, data: WatchDataEntry }

async function loadSelectedLanguage()
{
  const KEY = "selectedLanguage"
  const loaded = (await EXTENSION_API.getLocalStorage(KEY))
  if (!loaded[KEY])
    return "en"
  return loaded[KEY]
} 

export const InputContext = createContext<WatchDataEntry[] | null>(null);
export const LanguageContext = createContext<string>("");

function App() 
{
  const [language, setLanguage] = useState("");
  const [input, inputDispach] = useReducer<WatchData, [action: InputReducerAction]>(inputReducer, {} as WatchData);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [screen, setScreen] = useState<Screen>("PROGRESS")

  const languageInput = useMemo(() => getInputForLanguage(language), [language, input])

  const screenComponents: Record<Screen, ReactNode> = {
    "PROGRESS": <ProgressDashboard inputDispach={inputDispach} settings={settings} setSettings={setSettings} language={language} />,
    "HISTORY": <HistoryPage inputDispach={inputDispach} />,
    "SETTINGS": <SettingsPage settings={settings} setSettings={setSettings} input={input} inputDispach={inputDispach}/>
  }

  useEffect(() => {
    loadSettings().then((data: Settings) => 
    {
      setSettings(data)
      document.documentElement.classList.toggle("dark", data?.darkMode)
    })
    loadWatchData().then((data: any) => 
    {
      inputDispach({type: "set", data})
    })
    loadSelectedLanguage().then((data: any) => 
    {
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
  useSave(language, async (language: string) => await EXTENSION_API.setLocalStorage("selectedLanguage", language))

  function getInputForLanguage(isoCode: string) : WatchDataEntry[]
  {
    return input[isoCode] || [];
  }

  function inputReducer(state: WatchData, action: InputReducerAction): WatchData
  {
    switch (action.type)
    {
      case "set":
        return action.data
      case "add":
        return addInputEntry(state, action.language, action.data)
      case "delete":
        return deleteInputEntry(state, action.language, action.id)
      case "edit":
        return editInputEntry(state, action.language, action.data)
    }
  }

  function addInputEntry(state: WatchData, lang: string, entry: WatchDataEntry)
  {
    const currentInput = state[lang] || []
    const updatedInputList = [...currentInput, entry]
    return {...state, [lang]: updatedInputList}
  }

  function deleteInputEntry(state: WatchData, lang: string, idToDelete: string) 
  {
    const currentInputList = state[lang] || [];
    const updatedInputList = currentInputList.filter(entry => entry.id !== idToDelete);
    return { ...state, [lang]: updatedInputList };
  }

  function editInputEntry(state: WatchData, lang: string, newValues: WatchDataEntry) 
  {
    console.log("editing")
    const currentInputList = state[lang] || [];
    const updatedInputList = currentInputList.map(entry => 
    {
      console.log(entry.id, newValues.id)
      if (entry.id !== newValues.id)
        return entry
      console.log("found", entry)
      return { 
          ...entry,
          description: newValues.description || entry.description,
          time: newValues.time || entry.time,
          date: newValues.date || entry.date 
      } 
    });
    return { ...state, [lang]: updatedInputList };
}

return (
  <LanguageContext.Provider value={language}>
    <InputContext.Provider value={languageInput}>
      <NavBar language={language} learning={Object.keys(settings.learning)} setLanguage={setLanguage} setScreen={setScreen} screen={screen}/>
      <div className='pt-12 pb-1 bg-gray-200 dark:bg-gray-800 min-h-dvh '>
        {screenComponents[screen]}
      </div>
    </InputContext.Provider>
  </LanguageContext.Provider>
)
}

export default App
