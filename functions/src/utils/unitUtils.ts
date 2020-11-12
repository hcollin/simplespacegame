import DATASHIPS, { shipNameGenerator } from "../data/dataShips";
import { TECHIDS } from "../data/dataTechnology";
import { FactionModel, Coordinates } from "../models/Models";
import { ShipDesign, ShipUnit, ShipWeapon } from "../models/Units";
import { techEvasionEngine, techHeavyRounds, techIonEngines, techTargetingComputerOne, techTargetingComputerThree, techTargetingComputerTwo, techTimeslipPrediction, techWarpEngines } from "../tech/shipTech";
import { rndId } from "./randUtils";
// import { getFactionById } from "./factionJokiUtils";


// SHIP VALUES
// The functions should be used to access the provided ship design value if tech and faction specific modifiers need to be taken account

export function getAdjustedShip(shipDesign: ShipDesign, faction?: FactionModel): ShipDesign {
    
    const ship: ShipDesign = { ...shipDesign };
    if (!faction) return ship;
    ship.agility = getShipAgility(shipDesign, faction);
    ship.speed = getShipSpeed(shipDesign, faction);
    ship.cost = getShipCost(shipDesign, faction);
    ship.minIndustry = getShipIndustry(shipDesign, faction);
    
    ship.techReq    = getShipTechReq(shipDesign, faction);
    ship.troops    = getShipTroops(shipDesign, faction);
    ship.hull    = getShipHull(shipDesign, faction);
    ship.armor    = getShipArmor(shipDesign, faction);

    ship.shieldRegeneration = getShipShieldsReg(shipDesign, faction);
    ship.shieldsMax = getShipShieldsMax(shipDesign, faction);
    ship.agility = getShipAgility(shipDesign, faction);
    
    return ship;
}

export function getShipSpeed(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.speed;
    return ship.speed + techIonEngines(faction) + techWarpEngines(faction);
}

export function getShipIndustry(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.minIndustry;
    return ship.minIndustry;
}

export function getShipTechReq(ship: ShipDesign, faction?: FactionModel): TECHIDS[] {
    if (!faction) return ship.techReq;
    return ship.techReq;
}

export function getShipCost(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.cost;
    return ship.cost;
}

export function getShipTroops(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.troops;
    return ship.troops;
}

export function getShipHull(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.hull;
    return ship.hull;
}

export function getShipArmor(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.armor;
    return ship.armor;
}

export function getShipShieldsMax(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.shieldsMax;
    return ship.shieldsMax;
}
export function getShipShieldsReg(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.shieldRegeneration;
    return ship.shieldRegeneration;
}

export function getShipAgility(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.agility;
    return techTimeslipPrediction(faction, techEvasionEngine(faction, ship.agility));
}


// WEAPON VALUES

export function getWeaponDamage(weapon: ShipWeapon, faction?: FactionModel): number | [number, number] {
    if (!faction) return weapon.damage;
    return techHeavyRounds(faction, weapon.damage)
}

export function getWeaponAccuracy(weapon: ShipWeapon, faction?: FactionModel): number {
    if (!faction) return weapon.accuracy;
    return weapon.accuracy + techTargetingComputerOne(faction) + techTargetingComputerTwo(faction) + techTargetingComputerThree(faction);
}

export function getWeaponCooldownTime(weapon: ShipWeapon, faction?: FactionModel): number {
    if (!faction) return weapon.cooldownTime;
    return weapon.cooldownTime;
}

export function getFactionAdjustedWeapon(weapon: ShipWeapon, faction?: FactionModel): ShipWeapon {
    if (!faction) return {...weapon};

    const w: ShipWeapon = {...weapon};

    w.damage = getWeaponDamage(weapon, faction);
    w.accuracy = getWeaponAccuracy(weapon, faction);
    w.cooldownTime = getWeaponCooldownTime(weapon, faction);
    return w;
}


export function getFactionAdjustedUnit(faction: FactionModel, origUnit: ShipUnit): ShipUnit {

    // const faction = getFactionById(origUnit.factionId);

    const ship: ShipUnit = {...origUnit};
    ship.agility = getShipAgility(origUnit, faction);
    ship.speed = getShipSpeed(origUnit, faction);
    ship.cost = getShipCost(origUnit, faction);
    ship.minIndustry = getShipIndustry(origUnit, faction);
    
    ship.techReq    = getShipTechReq(origUnit, faction);
    ship.troops    = getShipTroops(origUnit, faction);
    ship.hull    = getShipHull(origUnit, faction);
    ship.armor    = getShipArmor(origUnit, faction);

    ship.shieldRegeneration = getShipShieldsReg(origUnit, faction);
    ship.shieldsMax = getShipShieldsMax(origUnit, faction);
    ship.agility = getShipAgility(origUnit, faction);
    
    return ship;
}


/// FROM HELPERS

export function createShipFromDesign(design: ShipDesign, factionId: string, location: Coordinates): ShipUnit {
    const ship: ShipUnit = {
        ...design,
        id: rndId(),
        damage: 0,
        morale: 100,
        shields: design.shieldsMax,
        location: location,
        factionId: factionId,
        experience: 0,
        name: shipNameGenerator(design.type),
    };

    return ship;
}

export function getDesignByName(name: string): ShipDesign {
    const sd = DATASHIPS.find((s: ShipDesign) => s.name === name);
    if(!sd) {
        throw new Error(`Unknown ship desgin ${name}`);
    }
    return sd;
}




// export function getUnitSpeed(um: ShipUnit): number {
//     if (um.speed === 0) return 0;
//     const faction = getFactionById(um.factionId);
//     return getShipSpeed(um, faction);
// }