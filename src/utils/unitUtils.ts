import { ShipUnit } from "../models/Units";
import { techIonEngines, techWarpEngines } from "../tech/shipTech";
import { getFactionById } from "./factionUtils";



export function getUnitSpeed(um: ShipUnit): number {
    if(um.speed === 0 ) return 0;
    const faction = getFactionById(um.factionId);
    return um.speed + techIonEngines(faction) + techWarpEngines(faction);
}
