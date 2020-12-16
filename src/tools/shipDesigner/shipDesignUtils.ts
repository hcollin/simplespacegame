import { v4 } from "uuid";
import {
    getDesignSpecByShipClass,
    DATASHIPENGINES,
    DATASHIPSYSTEMS,
    shipClassNameGenerator,
} from "../../data/dataShips";
import { FactionModel } from "../../models/Models";
import { ShipCustomDesign, ShipDesign, ShipEngine, ShipSystem, SHIPCLASS, ShipWeapon } from "../../models/Units";

/**
 * Converts ShipCustomDesign to ShipDesign
 * 
 * @param custom ShipCustomDesign
 * @returns ShipDesign 
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

/**
 * Validate provided ShipCustomDesign Object
 * 
 * @param design 
 */
export function validateShipDesign(design: ShipCustomDesign): boolean {
    if (design.pointsUsed > design.pointsMax) return false;
    if (design.shieldAdjustment < 0) return false;
    if (design.shieldAdjustment === 0 && design.shieldRegenAdjust > 0) return false;
    const nSpec = getDesignSpecByShipClass(design.hullType);
    if (nSpec.hull + design.hullAdjustment * 5 < 0) return false;

    return true;
}

/**
 * Remove design from the target Faction. This does NOT update this change to backend.
 * 
 * @param faction 
 * @param design 
 */
export function removeDesign(faction: FactionModel, design: ShipDesign): FactionModel {
    const nf = { ...faction };
    nf.shipDesigns = nf.shipDesigns.filter((d: ShipDesign) => {
        return d.id !== design.id;
    });
    return nf;
}
