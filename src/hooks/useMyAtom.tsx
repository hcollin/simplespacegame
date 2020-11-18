import { JokiEvent } from "jokits";
import { joki } from "jokits-react";
import { useCallback, useEffect, useState } from "react";


const store = new Map<string, any>();


export default function useMyAtom<T>(key: string, defaultValue: T): [T, ((newValue: T) => void)] {

    const [val, setVal] = useState<T>(() => {
        if(store.has(key)) {
            return store.get(key) as T;
        }
        return defaultValue;
    });

    useEffect(() => {

        return joki.on({
            from: "useMyAtom",
            action: key,
            fn: (event: JokiEvent) => {
                if(typeof event.data === "object") {
                    setVal({...event.data} as T);
                } else {
                    setVal(event.data as T);
                }
                
            }
        })
    }, []);


    const setNewValue = useCallback((newValue: T) => {
        setVal(newValue);
        joki.trigger({
            from: "useMyAtom",
            action: key,
            data: newValue
        });
    }, []);

    return [val, setNewValue];
}