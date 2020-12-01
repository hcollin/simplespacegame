import { TECHIDS } from "../data/dataTechnology";
import { Building } from "./Buildings";
import { Trade } from "./Communication";
import { CombatRoundReport, DetailReportType } from "./Report";
import { SystemModel } from "./StarSystem";
import { ShipUnit } from "./Units";

export interface GameObject {
    id: string;
}

export enum GameState {
    "NONE",
    "INIT",
    "OPEN",
    "TURN",
    "BUSY",
    "PROCESSING",
    "CLEANUP",
    "ENDED",
}

export interface GameSetup {
    playerCount: number;
    distances: string;
    density: string;
    specials: string;
    length: string;
}

export interface PreGameSetup extends GameSetup {
    name: string;
    autoJoin: boolean;
    faction?: FactionSetup;
}

export interface FactionSetup {
    name: string;
    color: string;
    iconFileName: string;
    fontFamily: string;
    playerId: string;
}

export interface GameModel extends GameObject {
    setup: GameSetup;
    turn: number;
    name: string;
    factions: FactionModel[];
    units: ShipUnit[];
    systems: SystemModel[];
    factionsReady: string[];
    state: GameState;
    trades: Trade[];
    playerIds: string[];    
}

export interface Fleet {
    units: ShipUnit[];
    target: Coordinates | null;
}

export interface Coordinates {
    x: number;
    y: number;
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
    technologyFields: FactionTechSetting[]; // What field, total points, priority of techs
    state: FactionState;
    color: string;
    iconFileName: string;
    playerId: string;
    style: FactionStyle;
    technology: string[];
    debt: number;
    aps: number;
}

export interface FactionStyle {
    fontFamily?: string;
    fleetIcon?: string;
}

export enum TechnologyField {
    CHEMISTRY = "Chemistry",
    PHYSICS = "Physics",
    BIOLOGY = "Biology",
    BUSINESS = "Economy",
    MATERIAL = "Material",
    INFORMATION = "Information",
}

export interface Technology {
    id: TECHIDS;
    fieldreqs: [TechnologyField, number][];
    techprereq: TECHIDS[];
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

export interface Report {
    factions: string[];
    turn: number;
    type: DetailReportType;
    reportId: string;
}

export interface SpaceCombat {
    units: ShipUnit[];
    origUnits: ShipUnit[];
    system: SystemModel | null;
    round: number;
    roundLog: CombatRoundReport[];
    currentRoundLog: CombatRoundReport;
    done: boolean;
}
