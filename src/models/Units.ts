import { TECHIDS } from "../data/dataTechnology";
import { Coordinates, GameObject } from "./Models";



export enum SHIPCLASS {
    FIGHTER = "Fighter",
    PATROL = "Patrol",
    CORVETTE = "Corvette",
    FRIGATE = "Frigate",
    DESTROYER = "Destroyer",
    CRUISER = "Cruiser",
    BATTLESHIP = "Battleship",
    CARRIER = "Carrier",
};

export enum WEAPONTYPE {
    ENERGY = "Energy Weapon",
    KINETIC = "Kinetic Weapon",
    MORALE = "Psychological Weapon",
    MISSILE = "Missile",
    ODD = "Strange Weapon",
};

export enum SHIPKEYWORD {
    TRASPORTED1 = "Takes 1 Cargo Space",
    TRASPORTED2 = "Takes 2 Cargo Space",
    TRASPORTED3 = "Takes 3 Cargo Space",
    BIOSHIP = "BioShip",
};


export interface ShipWeapon {
    name: string;
    damage: number|[number, number];
    accuracy: number;
    cooldown: number;
    cooldownTime: number;
    type: WEAPONTYPE;
    special: string[];
}

export interface ShipDesign extends GameObject {
    name: string;
    
    type: SHIPCLASS;
    cost: number;
    minIndustry: number;
    techReq: TECHIDS[];
    troops: number;
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

