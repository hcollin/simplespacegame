import { v4 } from "uuid";
import {
    DATASHIPENGINES,
    DATASHIPSYSTEMS,
    getDesignSpecByShipClass,
    shipClassNameGenerator,
    SHIPENGINEIDS,
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
    ShipPartSlot,
    ShipSystem,
    ShipUnit,
    ShipWeapon,
    WEAPONTYPE,
} from "../models/Units";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
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
import { unitExpenses } from "./factionUtils";
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

export function fleetBombardmentCalculator(game: GameModel, fleet: ShipUnit[], system: SystemModel): [number, number] {
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


/***********************************************************************************************
 * Ship Designer related Utils
 */

/**
 * Converts ShipCustomDesign to ShipDesign
 * @param custom
 */
export function convertShipCustomDesignToShipDesign(custom: ShipCustomDesign): ShipDesign {
    const currentSpec = getDesignSpecByShipClass(custom.hullType);

    const currentHull = currentSpec.hull + custom.hullAdjustment * 5;
    const currentShield = custom.shieldAdjustment * 3;

    const currentAgility =
        currentSpec.baseAgility + custom.engine.agility < 0 ? 0 : currentSpec.baseAgility + custom.engine.agility;

    const design: ShipDesign = {
        id: v4(),
        typeClassName: `${custom.name} class ${custom.hullType}`,
        sizeIndicator: currentSpec.sizeModifier,
        type: custom.hullType,
        name: custom.name,
        cost: custom.cost,
        buildTime: custom.buildTime,
        minIndustry: Math.max(Math.floor(custom.cost / 10), 1),
        techReq: [],
        fighters: custom.fighters,
        fightersMax: custom.fighters,
        troops: custom.troops,
        speed: custom.engine.speed,
        agility: currentAgility,
        armor: custom.armor,
        hull: currentHull,
        shieldRegeneration: custom.shieldRegenAdjust,
        shieldsMax: currentShield,
        keywords: [],
        engineId: custom.engine.id,
        systemIds: [],
        weapons: custom.weapons,

        description: `${custom.name} class ${custom.hullType} is nice little boat`,
    };

    return design;
}

/**
 * Reverse engineer an existing Ship Design to Ship Custom Design
 * 
 * @param ship 
 */
export function convertShipDesignToDesignerModel(ship: ShipDesign): ShipCustomDesign {
    const engine = DATASHIPENGINES.find((eng: ShipEngine) => eng.id === ship.engineId);
    const systems = DATASHIPSYSTEMS.filter((sys: ShipSystem) => ship.systemIds.includes(sys.id));
    const spec = getDesignSpecByShipClass(ship.type);

    const design: ShipCustomDesign = {
        name: ship.name,
        pointsMax: spec.points,
        pointsUsed: 0,
        cost: ship.cost,
        buildTime: ship.buildTime,
        weapons: ship.weapons,
        hullType: ship.type,
        hullAdjustment: Math.round((ship.hull - spec.hull) / 5),
        armor: ship.armor,
        shieldAdjustment: Math.round(ship.shieldsMax / 3),
        shieldRegenAdjust: ship.shieldRegeneration,
        troops: ship.troops,
        fighters: ship.fightersMax,
        engine: engine || DATASHIPENGINES[0],
        systems: systems,
    };
    return shipDesignCalculator(design);
}

/**
 * Return empty Ship Custom Design that can be used as a basis for new Designs
 */
export function emptyShipDesign(): ShipCustomDesign {
    const spec = getDesignSpecByShipClass(SHIPCLASS.CORVETTE);
    const design: ShipCustomDesign = {
        name: shipClassNameGenerator(),
        pointsMax: spec.points,
        pointsUsed: 0,
        cost: 0,
        buildTime: 0,
        weapons: [],
        hullType: spec.shipClass,
        hullAdjustment: 0,
        armor: 0,
        shieldAdjustment: 0,
        shieldRegenAdjust: 0,
        troops: 0,
        fighters: 0,
        engine: DATASHIPENGINES[0],
        systems: [],
    };
    return shipDesignCalculator(design);
}

/**
 * Calculates the points used, cost and build time of the provided design. 
 * 
 * This should be executed everytime the design changes.
 * @param design 
 */
export function shipDesignCalculator(design: ShipCustomDesign): ShipCustomDesign {
    const ship = { ...design };
    const nSpec = getDesignSpecByShipClass(ship.hullType);

    ship.pointsMax = nSpec.points;
    ship.pointsUsed = ship.weapons.reduce((p: number, w: ShipWeapon) => {
        return p + w.part.points;
    }, 0);

    ship.pointsUsed += ship.systems.reduce((p: number, s: ShipSystem) => {
        return p + s.part.points;
    }, 0);
    ship.pointsUsed += ship.hullAdjustment;
    ship.pointsUsed += ship.shieldAdjustment * 2;
    ship.pointsUsed += ship.shieldRegenAdjust * nSpec.sizeModifier;
    ship.pointsUsed += ship.armor * nSpec.sizeModifier;
    ship.pointsUsed += ship.troops * 8;
    ship.pointsUsed += ship.fighters * 12;

    ship.pointsUsed += ship.engine.part.points * nSpec.sizeModifier;

    ship.cost = 3 * nSpec.sizeModifier + Math.round(ship.pointsUsed / 10);
    ship.buildTime = Math.max(1, Math.round(nSpec.sizeModifier / 2));

    return ship;
}

export function validateShipDesign(design: ShipCustomDesign): boolean {
    if (design.pointsUsed > design.pointsMax) return false;
    if (design.shieldAdjustment < 0) return false;
    if (design.shieldAdjustment === 0 && design.shieldRegenAdjust > 0) return false;
    const nSpec = getDesignSpecByShipClass(design.hullType);
    if (nSpec.hull + design.hullAdjustment * 5 < 0) return false;

    return true;
}

export function removeDesign(faction: FactionModel, design: ShipDesign): FactionModel {
    const nf = { ...faction };
    nf.shipDesigns = nf.shipDesigns.filter((d: ShipDesign) => {
        return d.id !== design.id;
    });
    return nf;
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
