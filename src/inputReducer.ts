import type { WatchData, WatchDataEntry } from "./WatchData";

export type InputReducerAction =
  | { type: 'set'; data: WatchData}
  | { type: 'add'; language: string; data: WatchDataEntry }
  | { type: 'delete'; language: string, id: string }
  | { type: 'edit'; language: string, data: WatchDataEntry }

export function inputReducer(state: WatchData, action: InputReducerAction): WatchData
{
    switch (action.type)
    {
      case "set":
        return action.data
      case "add":
        return addInputEntry(state, action.language, action.data)
      case "delete":
        return deleteInputEntry(state, action.language, action.id)
      case "edit":
        return editInputEntry(state, action.language, action.data)
    }
}

function addInputEntry(state: WatchData, lang: string, entry: WatchDataEntry)
{
    const currentInput = state[lang] || []
    const updatedInputList = [...currentInput, entry]
    return {...state, [lang]: updatedInputList}
}

function deleteInputEntry(state: WatchData, lang: string, idToDelete: string) 
{
    const currentInputList = state[lang] || [];
    const updatedInputList = currentInputList.filter(entry => entry.id !== idToDelete);
    return { ...state, [lang]: updatedInputList };
}

function editInputEntry(state: WatchData, lang: string, newValues: WatchDataEntry) 
{
    const currentInputList = state[lang] || [];
    const updatedInputList = currentInputList.map(entry => 
    {
        console.log(entry.id, newValues.id)
        if (entry.id !== newValues.id)
            return entry

        return { 
            ...entry,
            description: newValues.description || entry.description,
            time: newValues.time || entry.time,
            date: newValues.date || entry.date 
        } 
    });
    return { ...state, [lang]: updatedInputList };
}