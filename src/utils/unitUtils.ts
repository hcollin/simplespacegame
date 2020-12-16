import { v4 } from "uuid";
import {
    DATASHIPENGINES,
    DATASHIPSYSTEMS,
    getDesignSpecByShipClass,
    shipClassNameGenerator,
    SHIPWEAPONSPECIAL,
} from "../data/dataShips";
import { TECHIDS } from "../data/dataTechnology";
import { Command, CommandType, FleetCommand, UnitScrapCommand } from "../models/Commands";
import { FactionModel, GameModel } from "../models/Models";
import { SystemModel } from "../models/StarSystem";
import {
    SHIPCLASS,
    ShipCustomDesign,
    ShipDesign,
    ShipEngine,
    ShipSystem,
    ShipUnit,
    ShipWeapon,
    WEAPONTYPE,
} from "../models/Units";

import {
    techFocusBeam,
    techHeavyRounds,
    techIonEngines,
    techManouveringJets,
    techPowerShields,
    techTargetingComputerOne,
    techTargetingComputerThree,
    techTargetingComputerTwo,
    techWarpEngines,
} from "../tech/shipTech";
import { getFactionFromArrayById, unitExpenses } from "./factionUtils";
import { inSameLocation } from "./locationUtils";
import { distanceBetweenCoordinates } from "./MathUtils";
import { getSystemByCoordinates } from "./systemUtils";

// SHIP VALUES
// The functions should be used to access the provided ship design value if tech and faction specific modifiers need to be taken account

export function getAdjustedShip(shipDesign: ShipDesign, faction?: FactionModel): ShipDesign {
    const ship: ShipDesign = { ...shipDesign };
    if (!faction) return ship;
    ship.agility = getShipAgility(shipDesign, faction);
    ship.speed = getShipSpeed(shipDesign, faction);
    ship.cost = getShipCost(shipDesign, faction);
    ship.minIndustry = getShipIndustry(shipDesign, faction);

    ship.techReq = getShipTechReq(shipDesign, faction);
    ship.troops = getShipTroops(shipDesign, faction);
    ship.hull = getShipHull(shipDesign, faction);
    ship.armor = getShipArmor(shipDesign, faction);

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
    return techPowerShields(faction, ship);
}

export function getShipAgility(ship: ShipDesign, faction?: FactionModel): number {
    if (!faction) return ship.agility;
    return techManouveringJets(faction, ship.agility);
}

export function getShipMaintenance(ship: ShipDesign, faction?: FactionModel): number {
    return unitExpenses(ship);
}

export function getShipBuildTime(ship: ShipDesign, faction?: FactionModel): number {
    return ship.buildTime;
}

// WEAPON VALUES

export function getWeaponDamage(weapon: ShipWeapon, faction?: FactionModel): number | [number, number] {
    if (!faction) return weapon.damage;
    switch (weapon.type) {
        case WEAPONTYPE.KINETIC:
            return techHeavyRounds(faction, weapon.damage);
        case WEAPONTYPE.ENERGY:
            return techFocusBeam(faction, weapon.damage);
        default:
            return weapon.damage;
    }
}

export function getWeaponAccuracy(weapon: ShipWeapon, faction?: FactionModel): number {
    if (!faction) return weapon.accuracy;
    return (
        weapon.accuracy +
        techTargetingComputerOne(faction) +
        techTargetingComputerTwo(faction) +
        techTargetingComputerThree(faction)
    );
}

export function getWeaponCooldownTime(weapon: ShipWeapon, faction?: FactionModel): number {
    if (!faction) return weapon.cooldownTime;
    return weapon.cooldownTime;
}

export function getFactionAdjustedWeapon(weapon: ShipWeapon, faction?: FactionModel): ShipWeapon {
    if (!faction) return { ...weapon };

    const w: ShipWeapon = { ...weapon };

    w.damage = getWeaponDamage(weapon, faction);
    w.accuracy = getWeaponAccuracy(weapon, faction);
    w.cooldownTime = getWeaponCooldownTime(weapon, faction);
    return w;
}

export function getFactionAdjustedUnit(faction: FactionModel, origUnit: ShipUnit): ShipUnit {
    // const faction = getFactionById(origUnit.factionId);

    const ship: ShipUnit = { ...origUnit };
    ship.agility = getShipAgility(origUnit, faction);
    ship.speed = getShipSpeed(origUnit, faction);
    ship.cost = getShipCost(origUnit, faction);
    ship.minIndustry = getShipIndustry(origUnit, faction);

    ship.techReq = getShipTechReq(origUnit, faction);
    ship.troops = getShipTroops(origUnit, faction);
    ship.hull = getShipHull(origUnit, faction);
    ship.armor = getShipArmor(origUnit, faction);

    ship.shieldRegeneration = getShipShieldsReg(origUnit, faction);
    ship.shieldsMax = getShipShieldsMax(origUnit, faction);
    ship.agility = getShipAgility(origUnit, faction);

    return ship;
}

export function shipCanBeBuiltOnSystemByFaction(ship: ShipDesign, faction: FactionModel, star: SystemModel): boolean {
    if (ship.cost > faction.money) return false;
    if (ship.minIndustry > star.industry) return false;
    if (ship.type === SHIPCLASS.FIGHTER) return false;
    return true;
}

export function getMaxDamageForWeapon(weapon: ShipWeapon, faction: FactionModel | true, armorValue = 0): number {
    const factionWeapon = faction !== true ? getFactionAdjustedWeapon(weapon, faction) : weapon;
    const fireRate = getWeaponFireRate(factionWeapon, true);
    const maxDamage = Array.isArray(factionWeapon.damage) ? factionWeapon.damage[1] : factionWeapon.damage;
    return (maxDamage - armorValue) * fireRate;
}

export function getWeaponFireRate(weapon: ShipWeapon, faction: FactionModel | true): number {
    const factionWeapon = faction !== true ? getFactionAdjustedWeapon(weapon, faction) : weapon;

    return (
        1 +
        (factionWeapon.special.includes(SHIPWEAPONSPECIAL.DOUBLESHOT) ? 1 : 0) +
        (factionWeapon.special.includes(SHIPWEAPONSPECIAL.RAPIDFIRE) ? 2 : 0) +
        (factionWeapon.special.includes(SHIPWEAPONSPECIAL.HAILOFFIRE) ? 4 : 0)
    );
}

export function getRecycleProfit(ship: ShipUnit): number {
    if (ship.hull === 0) return 0;
    const dmgPerc = ship.damage / ship.hull;
    return Math.round(ship.cost * 0.5 * (1 - dmgPerc));
}

export function unitIsInFriendlyOrbit(unit: ShipUnit, stars: SystemModel[]): boolean {
    return (
        stars.find((star: SystemModel) => {
            return inSameLocation(unit.location, star.location);
        }) !== undefined
    );
}

export function unitIsBeingScrapped(unit: ShipUnit, commands: Command[]): UnitScrapCommand | undefined {
    const cmd = commands.find((cmd: Command) => {
        if (cmd.type !== CommandType.UnitScrap) return false;
        const scrapCmd = cmd as UnitScrapCommand;
        return scrapCmd.unitId === unit.id;
    });
    if (cmd) {
        return cmd as UnitScrapCommand;
    }
    return;
}

export function unitIsAlreadyInCommand(unit: ShipUnit, commands: Command[]): Command | undefined {
    return commands.find((cmd: Command) => {
        if (cmd.type === CommandType.UnitScrap) {
            const scrapCmd = cmd as UnitScrapCommand;
            return scrapCmd.unitId === unit.id;
        }
        if (cmd.type === CommandType.FleetMove) {
            const fleetCmd = cmd as FleetCommand;
            return fleetCmd.unitIds.includes(unit.id);
        }
        if (cmd.type === CommandType.FleetBombard) {
            const fleetCmd = cmd as FleetCommand;
            return fleetCmd.unitIds.includes(unit.id);
        }
        return false;
    });
}

export function fleetBombardmentCalculator(game: GameModel, fleet: ShipUnit[]): [number, number] {
    let chance = 10;
    let maxDamage = 1;

    fleet.forEach((unit: ShipUnit) => {
        const unitFaction = getFactionFromArrayById(game.factions, unit.factionId);
        unit.weapons.forEach((w: ShipWeapon) => {
            let weaponDmg = Math.round(getMaxDamageForWeapon(w, unitFaction || true, 0) / 10);
            if (unit.keywords.includes("BOMBARDMENT")) {
                // weaponDmg = weaponDmg * 3;
                maxDamage++;
                chance += 25;
            }
            chance += weaponDmg;
        });
    });

    return [chance, maxDamage];
}



export interface TravelInfo {
    from: SystemModel | null;
    fromFaction: FactionModel | null;
    to: SystemModel | null;
    toFaction: FactionModel | null;
    distance: number;
    turns: number;
    slowestShip: ShipUnit | null;
}
export function getFleetInfo(
    game: GameModel,
    units: ShipUnit[],
    targetSystem: SystemModel | null | undefined
): TravelInfo {
    if (!targetSystem) {
        return {
            from: null,
            fromFaction: null,
            to: null,
            toFaction: null,
            distance: 0,
            slowestShip: null,
            turns: 0,
        };
    }
    const toFaction = getFactionFromArrayById(game.factions, targetSystem.ownerFactionId || "");
    const trInfo: TravelInfo = {
        from: null,
        fromFaction: null,
        to: targetSystem || null,
        toFaction: toFaction || null,
        distance: 0,
        slowestShip: null,
        turns: 0,
    };

    const slowestUnit = units.reduce((slowest: ShipUnit | null, cur: ShipUnit) => {
        if (slowest === null) return cur;

        if (cur.speed < slowest.speed) return cur;
        return slowest;
    }, null);
    if (slowestUnit) {
        const origSystem = getSystemByCoordinates(game, slowestUnit.location);
        if (origSystem) {
            trInfo.from = origSystem;
            const frFaction = getFactionFromArrayById(game.factions, origSystem.ownerFactionId);
            trInfo.fromFaction = frFaction || null;
        }
        const unFaction = getFactionFromArrayById(game.factions, slowestUnit.factionId);
        trInfo.slowestShip = unFaction ? getFactionAdjustedUnit(unFaction, slowestUnit) : slowestUnit;
        trInfo.distance = Math.ceil(distanceBetweenCoordinates(slowestUnit.location, targetSystem.location));
        trInfo.turns = Math.ceil(trInfo.distance / slowestUnit.speed);
    }

    return trInfo;
}
