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
    const settings = await browser.storage.local.get('settings')
    if (Object.keys(settings).length === 0)
        return makeDefaultSettings();
    return settings as Settings
}

function makeDefaultSettings(): Settings
{
    let settings = structuredClone(defaultSettings)
    for (const language of languagesLearnig)
        settings.learning[language] = structuredClone(languageDefaultSettings)
    return settings;
}