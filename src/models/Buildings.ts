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
}

export interface Building extends BuildingDesign {
    id: string;
}