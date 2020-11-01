import { TECHIDS } from "../data/dataTechnology";
import { CombatEvent } from "../models/Models";
import { ShipUnit } from "../models/Units";
import { techIonEngines, techTargetingComputerOne, techWarpEngines } from "../tech/shipTech";
import { factionHasTechnology } from "../tech/techTools";
import { getFactionById } from "./factionUtils";
import { rnd } from "./randUtils";



export function getUnitSpeed(um: ShipUnit): number {
    if(um.speed === 0 ) return 0;
    const faction = getFactionById(um.factionId);
    return um.speed + techIonEngines(faction) + techWarpEngines(faction);
}
