import { TECHIDS } from "../data/fDataTechnology";
import { Trade } from "./fCommunication";
import { CombatRoundReport, DetailReportType } from "./fReport";
import { SystemModel } from "./fStarSystem";
import { ShipDesign, ShipUnit } from "./fUnits";


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
    "CLOSED",
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
    discordWebHook: string;
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
    settings: GameSettings;
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

export interface GameSettings {
    discordWebHookUrl: string | null;
    turnTimer: number;
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
    shipDesigns: ShipDesign[];
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
    flavour?: string;
    groups: string[];
    level: number;
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
    title: string;
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
