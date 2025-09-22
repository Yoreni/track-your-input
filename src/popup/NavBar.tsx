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
        <option value={isoCode}>{getLanguage(isoCode)?.name || "???"}</option>)

    return <nav className="bg-gray-900 text-white p-2 flex justify-between items-center fixed top-0 left-0 w-full z-50 h-11">
        {learning.length > 0 ? <div className="dropdown">
            <select value={language} id="selectedLanguage" className="dropdown-toggle bg-gray-800 text-white p-1 rounded text-sm" onChange={changeLanguage}>
                {options}
            </select>
        </div> : <div></div>}
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1">
            <Tab screen={screen} setScreen={setScreen} label="Progress" value={"PROGRESS"} />
            <Tab screen={screen} setScreen={setScreen} label="History" value={"HISTORY"} />
            <Tab screen={screen} setScreen={setScreen} label="Settings" value={"SETTINGS"} />
        </div>
    </nav>
}

interface TabProps 
{
    screen: Screen
    setScreen: React.Dispatch<React.SetStateAction<Screen>>
    label: string
    value: Screen
}

function Tab( {screen, setScreen, label, value}: TabProps )
{
    const tabButtonStyle = "px-2 py-1 text-sm rounded-md hover:bg-gray-700 transition-colors duration-200"
    const activeTabStyle = "bg-gray-700 font-bold"

    return  <button 
        onClick={() => setScreen(value)} className={`${tabButtonStyle} ${screen === value ? activeTabStyle : ""}`}>
        {label}
    </button>
}