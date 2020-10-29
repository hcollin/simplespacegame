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
    units: UnitModel[];
    systems: SystemModel[];
    factionsReady: string[];
    state: GameState;
}

export interface Fleet {
    units: UnitModel[];
    target: Coordinates|null;

}

export interface Ship extends GameObject{
    name: string;
    weapons: number;
    hull: number;
    speed: number;

    cost: number;
    minIndustry: number;
}

export interface UnitModel extends Ship {
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

export type FactionTechSetting = [TechnologyField, number, number];

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
    PHYSICS = "Physics",
    CHEMISTRY = "Chemistry",
    BIOLOGY = "Biology",
    BUSINESS = "Business",
    SOCIOLOGY = "Social",
}


export interface Technology {
    id: string;
    requirements: [TechnologyField, number][];
    name: string;
    description: string;
}



export interface CombatEvent {
    units: UnitModel[];
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