import { BUILDINGTYPE } from "../data/dataBuildings";
import { TECHIDS } from "../data/dataTechnology";
import { Building } from "../models/Buildings";
import { GameModel, SystemModel } from "../models/Models";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { factionHasTechnology } from "../tech/techTools";
import { SystemEconomy } from "../utils/systemUtils";


function starHasBuilding(star: SystemModel, bt: BUILDINGTYPE): boolean {
    return star.buildings.find((b: Building) => b.type === bt) !== undefined;
}


export function buildingUniversity(star: SystemModel): number {
    if(star.ownerFactionId === "") return 0;
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    if(starHasBuilding(star, BUILDINGTYPE.UNIVERSITY)) {
        return 1;
    }
    return 0;
}


export function buildingRobotWorkers(star: SystemModel): number {
    if(starHasBuilding(star, BUILDINGTYPE.AUTOSTARDOCK)) {
        return 1.25;
    }
    return 1;
}

export function buildingCommandCenter(star: SystemModel): number {
    if(starHasBuilding(star, BUILDINGTYPE.CMDCENTER)) {
        return 1;
    }
    return 0;
}

export function buildingArcology(star: SystemEconomy): SystemEconomy {
    if(starHasBuilding(star, BUILDINGTYPE.AUTOSTARDOCK)) {
        star.economyMax += 5;
        star.industryMax += 5;
        star.welfareMax += 5;        
    }
    return {...star};


}