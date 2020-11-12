"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getDesignByName = exports.createShipFromDesign = exports.getFactionAdjustedUnit = exports.getFactionAdjustedWeapon = exports.getWeaponCooldownTime = exports.getWeaponAccuracy = exports.getWeaponDamage = exports.getShipAgility = exports.getShipShieldsReg = exports.getShipShieldsMax = exports.getShipArmor = exports.getShipHull = exports.getShipTroops = exports.getShipCost = exports.getShipTechReq = exports.getShipIndustry = exports.getShipSpeed = exports.getAdjustedShip = void 0;
var dataShips_1 = require("../data/dataShips");
var shipTech_1 = require("../tech/shipTech");
var randUtils_1 = require("./randUtils");
// import { getFactionById } from "./factionJokiUtils";
// SHIP VALUES
// The functions should be used to access the provided ship design value if tech and faction specific modifiers need to be taken account
function getAdjustedShip(shipDesign, faction) {
    var ship = __assign({}, shipDesign);
    if (!faction)
        return ship;
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
exports.getAdjustedShip = getAdjustedShip;
function getShipSpeed(ship, faction) {
    if (!faction)
        return ship.speed;
    return ship.speed + shipTech_1.techIonEngines(faction) + shipTech_1.techWarpEngines(faction);
}
exports.getShipSpeed = getShipSpeed;
function getShipIndustry(ship, faction) {
    if (!faction)
        return ship.minIndustry;
    return ship.minIndustry;
}
exports.getShipIndustry = getShipIndustry;
function getShipTechReq(ship, faction) {
    if (!faction)
        return ship.techReq;
    return ship.techReq;
}
exports.getShipTechReq = getShipTechReq;
function getShipCost(ship, faction) {
    if (!faction)
        return ship.cost;
    return ship.cost;
}
exports.getShipCost = getShipCost;
function getShipTroops(ship, faction) {
    if (!faction)
        return ship.troops;
    return ship.troops;
}
exports.getShipTroops = getShipTroops;
function getShipHull(ship, faction) {
    if (!faction)
        return ship.hull;
    return ship.hull;
}
exports.getShipHull = getShipHull;
function getShipArmor(ship, faction) {
    if (!faction)
        return ship.armor;
    return ship.armor;
}
exports.getShipArmor = getShipArmor;
function getShipShieldsMax(ship, faction) {
    if (!faction)
        return ship.shieldsMax;
    return ship.shieldsMax;
}
exports.getShipShieldsMax = getShipShieldsMax;
function getShipShieldsReg(ship, faction) {
    if (!faction)
        return ship.shieldRegeneration;
    return ship.shieldRegeneration;
}
exports.getShipShieldsReg = getShipShieldsReg;
function getShipAgility(ship, faction) {
    if (!faction)
        return ship.agility;
    return shipTech_1.techTimeslipPrediction(faction, shipTech_1.techEvasionEngine(faction, ship.agility));
}
exports.getShipAgility = getShipAgility;
// WEAPON VALUES
function getWeaponDamage(weapon, faction) {
    if (!faction)
        return weapon.damage;
    return shipTech_1.techHeavyRounds(faction, weapon.damage);
}
exports.getWeaponDamage = getWeaponDamage;
function getWeaponAccuracy(weapon, faction) {
    if (!faction)
        return weapon.accuracy;
    return weapon.accuracy + shipTech_1.techTargetingComputerOne(faction) + shipTech_1.techTargetingComputerTwo(faction) + shipTech_1.techTargetingComputerThree(faction);
}
exports.getWeaponAccuracy = getWeaponAccuracy;
function getWeaponCooldownTime(weapon, faction) {
    if (!faction)
        return weapon.cooldownTime;
    return weapon.cooldownTime;
}
exports.getWeaponCooldownTime = getWeaponCooldownTime;
function getFactionAdjustedWeapon(weapon, faction) {
    if (!faction)
        return __assign({}, weapon);
    var w = __assign({}, weapon);
    w.damage = getWeaponDamage(weapon, faction);
    w.accuracy = getWeaponAccuracy(weapon, faction);
    w.cooldownTime = getWeaponCooldownTime(weapon, faction);
    return w;
}
exports.getFactionAdjustedWeapon = getFactionAdjustedWeapon;
function getFactionAdjustedUnit(faction, origUnit) {
    // const faction = getFactionById(origUnit.factionId);
    var ship = __assign({}, origUnit);
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
exports.getFactionAdjustedUnit = getFactionAdjustedUnit;
/// FROM HELPERS
function createShipFromDesign(design, factionId, location) {
    var ship = __assign(__assign({}, design), { id: randUtils_1.rndId(), damage: 0, morale: 100, shields: design.shieldsMax, location: location, factionId: factionId, experience: 0, name: dataShips_1.shipNameGenerator(design.type) });
    return ship;
}
exports.createShipFromDesign = createShipFromDesign;
function getDesignByName(name) {
    var sd = dataShips_1["default"].find(function (s) { return s.name === name; });
    if (!sd) {
        throw new Error("Unknown ship desgin " + name);
    }
    return sd;
}
exports.getDesignByName = getDesignByName;
// export function getUnitSpeed(um: ShipUnit): number {
//     if (um.speed === 0) return 0;
//     const faction = getFactionById(um.factionId);
//     return getShipSpeed(um, faction);
// }
