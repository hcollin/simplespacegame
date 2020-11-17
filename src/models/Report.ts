import { GameObject } from "./Models";
import { ShipUnit } from "./Units";

export enum DetailReportType {
    Generic = "Generic report",
    Combat = "Combat report",
    Event = "Event report",
}

export interface DetailReport extends GameObject {
    gameId: string;
    factionIds: string[];
    turn: number;
    title: string;
    type: DetailReportType;
}


export interface GenericReport extends DetailReport {
    text: string[];
}

export interface EventReport extends DetailReport {
    eventCode: string;
    message: string;    
}

export interface CombatReport extends DetailReport {
    units: ShipUnit[];
    systemId: string;
    rounds: CombatRoundReport[];
    
}

export interface CombatRoundReport {
    round: number;
    messages: string[];
    attacks: CombatRoundAttackReport[];
    
}

export interface CombatRoundAttackReport {
    attacker: string;
    weapon: string;
    target: string;
    result: "HIT"|"MISS"|"RELOAD"|"SPECIAL";
    hitRoll: number;
    hitTarget: number;
    damage: number;
    
}







