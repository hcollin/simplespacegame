import { GameObject } from "./fModels";
import { ShipUnit } from "./fUnits";

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
    origUnits: ShipUnit[];
    
}

export interface CombatRoundReport {
    round: number;
    messages: string[];
    attacks: CombatRoundAttackReport[];
    status: CombatRoundStatus[];

}


export interface CombatRoundAttackReport {
    attacker: string;
    weapon: string;
    weaponId: string;
    target: string;
    result: "HIT"|"MISS"|"RELOAD"|"SPECIAL";
    hitRoll: number;
    hitTarget: number;
    damage: number;
    
}

export interface CombatRoundStatus {
    unitId: string;
    hull: number;
    damage: number;
    shields: number;
    morale: number;
    destroyed: boolean;
    retreated: boolean;
}





