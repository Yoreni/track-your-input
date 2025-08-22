export interface Settings 
{
  learning: Record<string, LanguageSettings>
  showExcatTime: boolean
  languagesAreNotCountries: boolean
  darkMode: boolean
}

export interface LanguageSettings 
{
  dailyGoal: number
}

export const defaultSettings: Settings = {
  learning: {},
  showExcatTime: false,
  languagesAreNotCountries: false,
  darkMode: false
}

export const languageDefaultSettings = {
  dailyGoal: 15,
}

const languagesLearnig = ["en", "de", "ja", "es"]
const KEY = 'settings'

export async function saveSettings(settings: Settings)
{
  await browser.storage.local.set({[KEY]: settings});
}

export async function loadSettings(): Promise<Settings>
{
    const loadedSettings = (await browser.storage.local.get(KEY))
    if (!loadedSettings[KEY])
      return makeDefaultSettings()
    return loadedSettings[KEY] as Settings
}

function makeDefaultSettings(): Settings
{
    let settings = {...defaultSettings}
    for (const language of languagesLearnig)
        settings.learning[language] = {...languageDefaultSettings}
    return settings;
}