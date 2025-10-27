import { EXTENSION_API } from "./extension-api";

export interface Settings 
{
  learning: Record<string, LanguageSettings>
  showExcatTime: boolean
  languagesAreNotCountries: boolean
  darkMode: boolean
}

export interface LanguageSettings 
{
  dailyGoal: number;
  startingHours: number;
}

export const defaultSettings: Settings = {
  learning: {},
  showExcatTime: false,
  languagesAreNotCountries: false,
  darkMode: false
}

export const languageDefaultSettings = {
  dailyGoal: 15,
  staringHours: 0
}

const KEY = 'settings'

export async function saveSettings(settings: Settings)
{
  try
  {
    await EXTENSION_API.setLocalStorage(KEY, settings);
  }
  catch (error)
  {
    console.error(`Could not save settings ${error}`)
  }
}

export async function loadSettings(): Promise<Settings>
{
  try
  {
    const loadedSettings = (await EXTENSION_API.getLocalStorage(KEY))
    if (!loadedSettings[KEY])
      return makeDefaultSettings()
    return loadedSettings[KEY] as Settings
  }
  catch(error)
  {
    console.error(`Could not load settings ${error}`)
    return makeDefaultSettings()
  }
}

function makeDefaultSettings(): Settings
{
    let settings = {...defaultSettings}
    return settings;
}