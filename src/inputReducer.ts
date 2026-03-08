import type { WatchData, WatchDataEntry } from "./WatchData";

export type InputReducerAction = SetAction | AddAction | DeleteAction | EditAction;

interface SetAction {
  type: 'set';
  data: WatchData;
}

interface AddAction {
  type: 'add';
  language: string;
  data: WatchDataEntry;
}

interface DeleteAction {
  type: 'delete';
  language: string;
  id: string;
}

interface EditAction {
  type: 'edit';
  language: string;
  data: WatchDataEntry;
}

export function inputReducer(state: WatchData, action: InputReducerAction): WatchData
{
    switch (action.type)
    {
      case "set":
        return action.data
      case "add":
        return addInputEntry(state, action)
      case "delete":
        return deleteInputEntry(state, action)
      case "edit":
        return editInputEntry(state, action)
    }
}

function addInputEntry(state: WatchData, {language, data}: AddAction)
{
    const currentInput = state[language] || []
    const updatedInputList = [...currentInput, data]
    return {...state, [language]: updatedInputList}
}

function deleteInputEntry(state: WatchData, {language, id}: DeleteAction) 
{
    const currentInputList = state[language] || [];
    const updatedInputList = currentInputList.filter(entry => entry.id !== id);
    return { ...state, [language]: updatedInputList };
}

function editInputEntry(state: WatchData, {language, data}: EditAction) 
{
    const currentInputList = state[language] || [];
    const updatedInputList = currentInputList.map(entry => 
    {
        console.log(entry.id, data.id)
        if (entry.id !== data.id)
            return entry

        return { 
            ...entry,
            description: data.description || entry.description,
            time: data.time || entry.time,
            date: data.date || entry.date 
        } 
    });
    return { ...state, [language]: updatedInputList };
}