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

const defaultSettings: Settings = {
  learning: {},
  showExcatTime: false,
  languagesAreNotCountries: false,
  darkMode: false
}

const languageDefaultSettings = {
  dailyGoal: 15,
}

const languagesLearnig = ["en", "de", "ja", "es"]

export async function loadSettings(): Promise<Settings>
{
    const loadedSettings = await browser.storage.local.get('settings')
    let settings: Settings = makeDefaultSettings()

    if (loadedSettings?.showExcatTime)
      settings.showExcatTime = loadedSettings.showExcatTime
    if (loadedSettings?.languagesAreNotCountries)
      settings.languagesAreNotCountries = loadedSettings.languagesAreNotCountries
    if (loadedSettings?.darkMode)
      settings.darkMode = loadedSettings.darkMode
    if (loadedSettings?.learning)
      settings.learning = loadedSettings.learning
    
    return settings
}

function makeDefaultSettings(): Settings
{
    let settings = {...defaultSettings}
    for (const language of languagesLearnig)
        settings.learning[language] = {...languageDefaultSettings}
    return settings;
}