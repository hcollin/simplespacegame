import { GameObject } from "./Models";

export enum CommandType {
    SystemBuild = "SystemBuild",
    SystemIndustry = "SystemIndustry",
    SystemEconomy = "SystemEconomy",
    SystemWelfere = "SystemWelfare",
    SystemDefense = "SystemDefense",
    FleetMove = "FleetMove",
    FleetInvade = "FleetInvade",
    FleetColonize = "FleetColonize",
    FleetDefend = "FleetDefend",
    GeneralClaimObjective = "GeneralClaimObjective",
}

export interface Command extends GameObject {
    gameId: string;
    factionId: string;
    type: CommandType;

}