import { JokiEvent } from "jokits";
import { joki } from "jokits-react";
import { useEffect, useState } from "react";
import { UnitModel } from "../models/Models";


interface UnitSelectionActions {
    add: (unit: UnitModel) => void;
    set: (units: UnitModel[]) => void;
    rem: (unitId: string) => void;
    has: (unitId: string) => boolean;
    clr: () => void;
}

let globalUnits: UnitModel[] = []

export default function useUnitSelection(): [UnitModel[], UnitSelectionActions] {

    const [selectedUnits, setSelectedUnits] = useState<UnitModel[]>(globalUnits);


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

    function addUnit(unit: UnitModel) {
        const nUnits = [...selectedUnits];
        nUnits.push(unit);
        globalUnits = nUnits;
        sendUpdate(nUnits);
    }

    function setUnits(units: UnitModel[]) {
        globalUnits = units;
        sendUpdate([...units]);
    }

    function remUnit(unitId: string) {
        const nUnits = selectedUnits.filter((um: UnitModel) => um.id !== unitId);
        globalUnits = nUnits;
        sendUpdate(nUnits);
    }

    function hasUnit(unitId: string): boolean {
        return selectedUnits.find((um: UnitModel) => um.id === unitId) !== undefined;
    }

    function clearUnits() {
        globalUnits = [];
        sendUpdate([]);
    }

    function sendUpdate(units: UnitModel[]) {
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