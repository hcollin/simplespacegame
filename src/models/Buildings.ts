import { BUILDINGTYPE } from "../data/dataBuildings";
import { TECHIDS } from "../data/dataTechnology";

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
    limit: "NONE" | "1PERSYSTEM" | "1PERFACTION" | "1PERGAME";
}

export interface Building extends BuildingDesign {
    id: string;
}

export interface BuildingUnderConstruction extends BuildingDesign {
    cmdId: string;
    turnsLeft: number;
    cancellable: boolean;
}
