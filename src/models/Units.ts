import { SHIPENGINEIDS, SHIPSYSTEMID } from "../data/dataShips";
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
 * Ship Designs that are stored per faction. A few of these are automatically created when the game starts.
 * 
 * New ShipDesigns are created from ShipCustomDesign interface and functions for this conversion are located in unitUtils.
 * 
 *  - convertShipDesignToDesignerModel() 
 *  - convertShipCustomDesignToShipDesign()
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
	engineId: SHIPENGINEIDS;
	systemIds: SHIPSYSTEMID[];
}

/**
 * The interface used to store a ship that is under construction. This value is stored into the command itself.
 */
export interface ShipUnderConstruction extends ShipDesign {
	cmdId: string;
	timeLeft: number;
	cancellable: boolean;
}

/**
 * This is the main interface for Ships in the game. It extends the ShipDesign with information that makes it a specific unit.
 */
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
	id: SHIPENGINEIDS;
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

export interface ShipSystem {
	id: SHIPSYSTEMID;
	name: string;
	description: string;
	part: ShipPart;
}

/**
 * ShipCustomDesign is used while the ship is being designed. It is a temporary data storage and is not stored.
 */
export interface ShipCustomDesign {
	name: string;
	pointsMax: number;
	pointsUsed: number;
	cost: number;
	buildTime: number;
	weapons: ShipWeapon[];
	hullType: SHIPCLASS;
	hullAdjustment: number;
	armor: number;
	shieldAdjustment: number;
	shieldRegenAdjust: number;
	troops: number;
	fighters: number;
    engine: ShipEngine;
    systems: ShipSystem[];
}

/**
 * More detailed information for each SHIPCLASS that is used in the designer
 */
export interface ShipDesignSpec {
	shipClass: SHIPCLASS;
	points: number;
	hull: number;
	baseAgility: number;
	sizeModifier: number;
}
