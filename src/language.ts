function lang(englishName: String, iso: String)
{
    return {name: englishName, iso}
}

export function getLanguage(query: String)
{
    const filtered = LANGUAGES.filter((element) => element.name === query || element.iso === query) 
    return filtered.length > 0 ? filtered[0] : null
} 

const LANGUAGES = [
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