import { Trade } from "./Communication";
import { ShipUnit } from "./Units";

export interface GameObject {
    id: string;
}

export enum GameState {
    "INIT",
    "OPEN",
    "TURN",
    "PROCESSING",
    "ENDED",
}

export interface GameModel extends GameObject {
    turn: number;
    factions: FactionModel[];
    units: ShipUnit[];
    systems: SystemModel[];
    factionsReady: string[];
    state: GameState;
    trades: Trade[];
}

export interface Fleet {
    units: ShipUnit[];
    target: Coordinates|null;

}

export interface OldShip extends GameObject{
    name: string;
    weapons: number;
    hull: number;
    speed: number;

    cost: number;
    minIndustry: number;

    description?: string;
}

export interface OldUnitModel extends OldShip {
    location: Coordinates;
    damage: number;
    factionId: string;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface SystemModel extends GameObject {
    name: string;
    location: Coordinates;
    ownerFactionId: string;

    industry: number;
    economy: number;
    defense: number;
    welfare: number;
    
    color: string;
    ringWorld: boolean;
    keywords: string[];
    reports: Report[];
}

export enum FactionState {
    "INIT",
    "PLAYING",
    "DONE",
    "WON",
    "LOST",
}

export interface FactionTechSetting {
    field: TechnologyField;
    points: number;
    priority: number;
}

export interface FactionModel extends GameObject {
    name: string;
    money: number;
    technologyFields: FactionTechSetting[];  // What field, total points, priority of techs
    state: FactionState;
    color: string;
    iconFileName: string;
    playerId: string;
    style: FactionStyle;
    technology: string[];
}

export interface FactionStyle {
    fontFamily?: string;
    fleetIcon?: string;
}

export enum TechnologyField {
    
    CHEMISTRY = "Chemistry",
    PHYSICS = "Physics",
    BIOLOGY = "Biology",
    
    BUSINESS = "Business",
    SOCIOLOGY = "Social",
    INFORMATION = "Information",
}


export interface Technology {
    id: string;
    fieldreqs: [TechnologyField, number][];
    techprereq: string[];
    name: string;
    description: string;
}



export interface CombatEvent {
    units: ShipUnit[];
    system: SystemModel;
    round: number;
    log: string[];
    resolved: boolean;
}

export enum ReportType {
    COMBAT = "COMBAT",
    COMMAND = "COMMAND",
    EVENT = "EVENT",
}

export interface Report {
    factions: string[];
    turn: number;
    type: ReportType;
    text: string[];
}

export interface SpaceCombat {
    units: ShipUnit[];
    system: SystemModel | null;
    round: number;
    log: string[];
    done: boolean;
}
