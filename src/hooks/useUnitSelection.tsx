import { JokiEvent } from "jokits";
import { joki } from "jokits-react";
import { useEffect, useState } from "react";
import { ShipUnit } from "../models/Units";


interface UnitSelectionActions {
    add: (unit: ShipUnit) => void;
    set: (units: ShipUnit[]) => void;
    rem: (unitId: string) => void;
    has: (unitId: string) => boolean;
    clr: () => void;
}

let globalUnits: ShipUnit[] = []

export default function useUnitSelection(): [ShipUnit[], UnitSelectionActions] {

    const [selectedUnits, setSelectedUnits] = useState<ShipUnit[]>(globalUnits);
    

    // useEffect(() => {
    //     globalUnits = selectedUnits;
    // }, [selectedUnits]);

    useEffect(() => {
        return joki.on({
            from: "useSelectedUnit",
            action: "change",
            fn: (event: JokiEvent) => {
                setSelectedUnits(event.data);
            }
        })

    }, []);

    function addUnit(unit: ShipUnit) {
        const nUnits = [...selectedUnits];
        nUnits.push(unit);
        globalUnits = nUnits;
        sendUpdate(nUnits);
    }

    function setUnits(units: ShipUnit[]) {
        globalUnits = units;
        sendUpdate([...units]);
    }

    function remUnit(unitId: string) {
        const nUnits = selectedUnits.filter((um: ShipUnit) => um.id !== unitId);
        globalUnits = nUnits;
        sendUpdate(nUnits);
    }

    function hasUnit(unitId: string): boolean {
        return selectedUnits.find((um: ShipUnit) => um.id === unitId) !== undefined;
    }

    function clearUnits() {
        globalUnits = [];
        sendUpdate([]);
    }

    function sendUpdate(units: ShipUnit[]) {
        joki.trigger({
            from: "useSelectedUnit",
            action: "change",
            data: units
        });
    }

    return [selectedUnits, {
        add: addUnit,
        set: setUnits,
        rem: remUnit,
        has: hasUnit,
        clr: clearUnits
    }]


}