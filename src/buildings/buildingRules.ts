import { BUILDINGTYPE } from "../data/dataBuildings";

import { Building } from "../models/Buildings";
import { SystemModel } from "../models/Models";
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
    if(starHasBuilding(star, BUILDINGTYPE.ROBOTWORKERS)) {
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
    if(starHasBuilding(star, BUILDINGTYPE.ROBOTWORKERS)) {
        star.economyMax += 5;
        star.industryMax += 5;
        star.welfareMax += 5;        
    }
    return {...star};
}


export function buildingBioDome(star: SystemEconomy): SystemEconomy {
    if(starHasBuilding(star, BUILDINGTYPE.BIODOME)) {
        star.economyMax += 1;
        star.welfareMax += 1;        
    }
    return {...star};
}