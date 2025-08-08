import { getLanguage } from "../language"

interface Props {
    language: string
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export function NavBar({ language, setLanguage }: Props) 
{
    function changeLanguage(event: React.ChangeEvent<HTMLSelectElement>)
    {
        setLanguage(event.target.value)
    }

    const languagesLearnig = ["en", "de", "ja", "es"]
    const options = languagesLearnig.map(isoCode => 
        <option value={isoCode} selected={isoCode === language}>{getLanguage(isoCode)?.name || "???"}</option>)

    return <nav className="bg-gray-800 text-white p-2.5 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div className="dropdown">
            <select id="selectedLanguage" className="dropdown-toggle" onChange={changeLanguage}>
                {options}
            </select>
        </div>
        <button className="settings-btn" id="settingsBtn">Settings</button>
    </nav>
}