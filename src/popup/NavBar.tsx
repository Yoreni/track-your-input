import { getLanguage } from "../language"
import type { Screen } from "../utils"

interface Props {
    language: string
    setLanguage: React.Dispatch<React.SetStateAction<string>>
    screen: Screen
    setScreen: React.Dispatch<React.SetStateAction<Screen>>
    learning: string[]
}

export function NavBar({ language, setLanguage, screen, setScreen, learning }: Props) 
{
    function changeLanguage(event: React.ChangeEvent<HTMLSelectElement>)
    {
        setLanguage(event.target.value)
    }

    const options = learning.map(isoCode => 
        <option value={isoCode} selected={isoCode === language}>{getLanguage(isoCode)?.name || "???"}</option>)

    return <nav className="bg-gray-900 text-white p-2.5 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div className="dropdown">
            <select id="selectedLanguage" className="dropdown-toggle" onChange={changeLanguage}>
                {options}
            </select>
        </div>
        {screen === "PROGRESS" && <button onClick={() => setScreen("SETTINGS")}>Settings</button>}
        {screen !== "PROGRESS" && <button onClick={() => setScreen("PROGRESS")}>Back</button>}

    </nav>
}