import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { GameModel, UnitModel } from "../models/Models";
import { inSameLocation } from "../utils/locationUtils";
import useSelectedSystem from "./useSelectedSystem";

export default function useUnitsInSelectedSystem(): UnitModel[] {

    const [units, setUnits] = useState<UnitModel[]>([]);

    const [system] = useSelectedSystem();

    const [game] = useService<GameModel>("GameService");

    useEffect(() => {
        if(game) {
            if(system === null) {
                setUnits([]);
            } else {
                setUnits(game.units.filter((u: UnitModel) => inSameLocation(u.location, system.location)));
            }
        }

    }, [system, game]);


    return units;
}