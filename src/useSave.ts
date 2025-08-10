import { useEffect } from "react";

export function useSave(value: any, savingFunction: (value: any) => void): void
{
    useEffect(() => {
        if (!value) 
            return;

        (async () => {
            try 
            {
                await savingFunction(value);
            }
            catch (err) 
            {
                console.error("Error with saving:", err);
            }
        })();
    }, [value]);
}