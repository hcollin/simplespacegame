import { BUILDINGTYPE } from "../data/fDataBuildings";
import { Coordinates, GameObject } from "./fModels";

export enum CommandType {
    SystemBuildUnit = "SystemBuildUnit",
    SystemBuildingBuild = "SystemBuildingBuild",
    SystemBuildingRemove = "SystemBuildingRemove",
    SystemIndustry = "SystemIndustry",
    SystemEconomy = "SystemEconomy",
    SystemWelfare = "SystemWelfare",
    SystemDefense = "SystemDefense",
    FleetMove = "FleetMove",
    TechnologyResearch = "Research",
}

export interface Command extends GameObject {
    gameId: string;
    turn: number;
    completed: boolean;
    factionId: string;
    type: CommandType;
    actionPoints: number;
    save?: boolean;
}

export interface SystemPlusCommand extends Command {
    targetSystem: string;
}

export interface FleetCommand extends Command {
    unitIds: string[];
    target: Coordinates;
    from: Coordinates;
}

export interface BuildUnitCommand extends Command {
    targetSystem: string;
    shipName: string;
    turnsLeft: number;
}

export interface BuildBuildingCommand extends Command {
    targetSystem: string;
    buildingType: BUILDINGTYPE;
    turnsLeft: number;
}

export interface RemoveBuildingCommand extends Command {
    targetSystem: string;
    buildingId: string;
}

export interface ResearchCommand extends Command {
    techId: string;
}
