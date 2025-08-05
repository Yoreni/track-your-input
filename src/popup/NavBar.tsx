import { getLanguage } from "../language"

export function NavBar()
{
    const languagesLearnig = ["en", "de", "ja", "es"]
    const selectedDefault = "de"
    const options = languagesLearnig.map(isoCode => 
    <option value={isoCode} selected={isoCode === selectedDefault}>{getLanguage(isoCode)?.name || "???"}</option>)

    return <nav className="bg-gray-800 text-white p-2.5 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div className="dropdown">
            <select id="selectedLanguage" className="dropdown-toggle">
                {options}
            </select>
        </div>
        <button className="settings-btn" id="settingsBtn">Settings</button>
    </nav>
}