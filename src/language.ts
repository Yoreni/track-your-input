interface Language 
{
    name: string
    iso: string
}

function lang(englishName: string, iso: string): Language
{
    return {name: englishName, iso}
}

export function getLanguage(query: string)
{
    const filtered = LANGUAGES.filter((element) => element.name === query || element.iso === query) 
    return filtered.length > 0 ? filtered[0] : null
} 

export const LANGUAGES = [
    lang("English", "en"),
    lang("German", "de"),
    lang("Spanish", "es"),
    lang("Portuguese", "pt"),
    lang("Italian", "it"),
    lang("French", "fr"),
    lang("Japanese", "ja"),
    lang("Korean", "ko"),
    lang("Dutch", "nl"),
    lang("Thai", "th"),
    lang("Mandarin", "zh"),
    lang("Russian", "ru"),
    lang("Polish", "pl"),
]