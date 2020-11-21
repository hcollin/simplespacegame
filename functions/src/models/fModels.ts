import { Building } from "./fBuildings";
import { Trade } from "./fCommunication";
import { CombatRoundReport, DetailReportType } from "./fReport";
import { ShipUnit } from "./fUnits";

export interface GameObject {
    id: string;
}

export enum GameState {
    "NONE",
    "INIT",
    "OPEN",
    "TURN",
    "PROCESSING",
    "CLEANUP",
    "ENDED",
}


export interface GameSetup {
    playerCount: number;
    distances: string;
    density: string;
    specials: string;
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
    target: Coordinates|null;

}

export interface Coordinates {
    x: number;
    y: number;
}

export enum SystemKeyword {
    HOMEWORLD = "Homeworld",
    MINERALRICH = "Mineral Rich",
    MINERALPOOR = "Mineral Poor",
    MINERALRARE = "Rare Minerals",
    HOSTILE = "Hostile Environment",
    GAIA = "Gaia world",
    NATIVES = "Natives",
    ARTIFACTS = "Alien Artifacts"
};

export interface SystemModel extends GameObject {
    name: string;
    location: Coordinates;
    ownerFactionId: string;

    industry: number;
    economy: number;
    defense: number;
    welfare: number;
    
    color: string;
    keywords: (string|SystemKeyword)[];
    reports: Report[];

    buildings: Building[];
    description?: string;

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
