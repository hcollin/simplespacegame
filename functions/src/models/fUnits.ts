import { TECHIDS } from "../data/fDataTechnology";
import { Coordinates, GameObject } from "./fModels";


export enum SHIPCLASS {
    FIGHTER = "Fighter",
    PATROL = "Patrol",
    CORVETTE = "Corvette",
    FRIGATE = "Frigate",
    DESTROYER = "Destroyer",
    CRUISER = "Cruiser",
    BATTLESHIP = "Battleship",
    CARRIER = "Carrier",
}

export enum WEAPONTYPE {
    ENERGY = "Energy Weapon",
    KINETIC = "Kinetic Weapon",
    MORALE = "Psychological Weapon",
    MISSILE = "Missile",
    ODD = "Strange Weapon",
}

export enum SHIPKEYWORD {
    TRASPORTED1 = "Takes 1 Cargo Space",
    TRASPORTED2 = "Takes 2 Cargo Space",
    TRASPORTED3 = "Takes 3 Cargo Space",
    BIOSHIP = "BioShip",
}

export interface ShipWeapon {
    id: string;
    name: string;
    damage: number | [number, number];
    accuracy: number;
    cooldown: number;
    cooldownTime: number;
    type: WEAPONTYPE;
    special: string[];
    part: ShipPart;
}

/**
 * HARD CODED SHIP DESIGN DATA
 */
export interface ShipDesign extends GameObject {
    name: string;
    typeClassName: string;
    sizeIndicator: number; // 1 = one man fighter, 2 - freighter, 7  10 - Death Star
    type: SHIPCLASS;
    cost: number;
    minIndustry: number;
    techReq: TECHIDS[];
    troops: number;
    fighters: number;
    fightersMax: number;
    speed: number;
    keywords: string[];
    hull: number;
    armor: number;
    shieldsMax: number;
    shieldRegeneration: number;
    agility: number;
    weapons: ShipWeapon[];
    description: string;
    buildTime: number;
}

export interface ShipUnderConstruction extends ShipDesign {
    cmdId: string;
    timeLeft: number;
    cancellable: boolean;
}

export interface ShipUnit extends ShipDesign {
    damage: number;
    shields: number;
    morale: number;
    location: Coordinates;
    factionId: string;
    experience: number;
}

export enum ShipPartSlot {
    WEAPON = "Weapon",
    ENGINE = "Engine",
    SHIELD = "Shields",
    OTHER = "Other",
}

export interface ShipPart {
	points: number;
    notAvailableInClasses: SHIPCLASS[];
    techPreReq: TECHIDS | null;
    slot: ShipPartSlot;
}

export interface ShipEngine {
    id: string;
    name: string;
    speed: number;
    range: number;
    agility: number;
    part: ShipPart;
}

export interface ShipShield {
    id: string;
    name: string;
    shieldsPerPoint: number;
    regenPerPoint: number;
    part: ShipPart;
}
