import { BUILDINGTYPE } from "../data/fDataBuildings";
import { TECHIDS } from "../data/fDataTechnology";

export interface BuildingDesign {
    type: BUILDINGTYPE;
    name: string;
    description: string;
    image?: string;
    cost: number;
    minIndustry: number;
    minEconomy: number;
    minWelfare: number;
    buildTime: number;
    techPreqs: TECHIDS[];
    keywords: string[];
    maintenanceCost: number;
    score: number;
}

export interface Building extends BuildingDesign {
    id: string;
}

export interface BuildingUnderConstruction extends BuildingDesign {
    cmdId: string;
    turnsLeft: number;
    cancellable: boolean;
}
