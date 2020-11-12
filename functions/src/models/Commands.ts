import { Coordinates, GameObject } from "./Models";

export enum CommandType {
    SystemBuild = "SystemBuild",
    SystemIndustry = "SystemIndustry",
    SystemEconomy = "SystemEconomy",
    SystemWelfare = "SystemWelfare",
    SystemDefense = "SystemDefense",
    FleetMove = "FleetMove",
    FleetInvade = "FleetInvade",
    FleetColonize = "FleetColonize",
    FleetDefend = "FleetDefend",
    GeneralClaimObjective = "GeneralClaimObjective",
    TechnologyResearch = "Research",
}

export interface Command extends GameObject {
    gameId: string;
    turn: number;
    completed: boolean;
    factionId: string;
    type: CommandType;
}

export interface SystemPlusCommand extends Command {
    targetSystem: string;
}

export interface FleetCommand extends Command {
    unitIds: string[];
    target: Coordinates;
}

export interface BuildUnitCommand extends Command {
    shipName: string;
    target: Coordinates;
}


export interface ResearchCommand extends Command {
    techId: string;
}