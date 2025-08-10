// import { useState } from 'react'
import { useEffect, useState } from 'react';
import './App.css'
import { NavBar } from './NavBar'
import { loadWatchData, saveWatchData, type WatchData } from '../WatchData';
import { loadSettings, saveSettings, type Settings } from '../Settings';
import { useSave } from '../useSave';
import { ProgressDashboard } from './ProgressDashboard';
import { formatBytes, type Screen } from '../utils';
import { Card } from './Card';

function App() 
{
  const selectedDefault = "en"
  const [language, setLanguage] = useState(selectedDefault);
  const [input, setInput] = useState<WatchData[]>([]);
  const [settings, setSettings] = useState<Settings>();
  const [screen, setScreen] = useState<Screen>("PROGRESS")
  const [bytesInUse, setBytesInUse] = useState(-2)
  const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo>()

  useEffect(() => {
    loadSettings().then((data: any) => {
      setSettings(data)
    })
    loadWatchData().then((data: any) => {
      setInput(data)
    })
    if (browser.storage.local.getBytesInUse)
    {
      browser.storage.local.getBytesInUse().then((bytes) =>
      {
        if (!bytes)
          bytes = -1
        setBytesInUse(bytes)
      })
    }
    browser.runtime.getBrowserInfo().then(data => setBrowserInfo(data))
  }, [])

  useSave(settings, saveSettings)
  useSave(input, saveWatchData)

  return ( input && settings &&
    <>
      <NavBar language={language} setLanguage={setLanguage} setScreen={setScreen} screen={screen}/>
      {
        screen === "PROGRESS" ?
          <ProgressDashboard input={input} setInput={setInput} settings={settings} setSettings={setSettings} language={language} />
        : <>
        <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12 pb-1">
          <Card>
            <div className='flex justify-between'>
              <p className='text-lg'>Display Excat Time</p>
              <input type="checkbox"/>
            </div>
            <div className='flex justify-between'>
              <p className='text-lg'>Dark Mode</p>
              <input type="checkbox"/>
            </div>
            {bytesInUse > 0 && <p>{formatBytes(bytesInUse)} used</p>}
            {browserInfo && <>
              <p className='text-gray-400 text-sm'>{browserInfo.vendor} {browserInfo.name} {browserInfo.version}-{browserInfo.buildID}</p>
            </>}
          </Card>
        </div>
        </>
      }
    </>
  )
}

export default App
