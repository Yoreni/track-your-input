interface Language 
{
    name: string
    iso: string
    defaultDifficulty: Difficulty
}

export type Difficulty = "related" | "distant" | "unrelated"; // to english speakers

function lang(englishName: string, iso: string, defaultDifficulty: Difficulty): Language
{
    return {name: englishName, iso, defaultDifficulty}
}

export function getLanguage(query: string)
{
    const filtered = LANGUAGES.filter((element) => element.name === query || element.iso === query) 
    return filtered.length > 0 ? filtered[0] : null
} 

export const LANGUAGES = [
    lang("English", "en", "distant"),
    lang("German", "de", "distant"),
    lang("Spanish", "es", "distant"),
    lang("Portuguese", "pt", "distant"),
    lang("Italian", "it", "distant"),
    lang("French", "fr", "distant"),
    lang("Japanese", "ja", "unrelated"),
    lang("Korean", "ko", "unrelated"),
    lang("Dutch", "nl", "distant"),
    lang("Thai", "th", "unrelated"),
    lang("Mandarin", "zh", "unrelated"),
    lang("Russian", "ru", "distant"),
    lang("Polish", "pl", "distant"),
    lang("Hindi", "hi", "distant"),
    lang("Hungarian", "hu", "unrelated"),
]