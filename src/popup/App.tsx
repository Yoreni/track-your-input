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
import { inputReducer } from '../inputReducer';

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
  const historyComponent = useMemo(() => <HistoryPage inputDispach={inputDispach} />, [input, language])

  const screenComponents: Record<Screen, ReactNode> = {
    "PROGRESS": <ProgressDashboard inputDispach={inputDispach} settings={settings} setSettings={setSettings} />,
    "HISTORY": historyComponent,
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
