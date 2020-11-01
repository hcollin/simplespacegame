import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { GameModel } from "../models/Models";
import { ShipUnit } from "../models/Units";
import { inSameLocation } from "../utils/locationUtils";
import useSelectedSystem from "./useSelectedSystem";

export default function useUnitsInSelectedSystem(): ShipUnit[] {

    const [units, setUnits] = useState<ShipUnit[]>([]);

    const [system] = useSelectedSystem();

    const [game] = useService<GameModel>("GameService");

    useEffect(() => {
        if(game) {
            if(system === null) {
                setUnits([]);
            } else {
                setUnits(game.units.filter((u: ShipUnit) => inSameLocation(u.location, system.location)));
            }
        }

    }, [system, game]);


    return units;
}