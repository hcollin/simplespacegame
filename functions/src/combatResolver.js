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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.updateUnitInCombat = exports.damagePotential = exports.getHitChance = exports.updateCooldownTime = exports.weaponCanFire = exports.spaceCombatRoundCleanUp = exports.spaceCombatMorale = exports.spaceCombatDamageResolve = exports.spaceCombatInflictDamage = exports.spaceCombatAttackShoot = exports.spaceCombatAttackChooseTarget = exports.spaceCombatAttacks = exports.spaceCombatPostCombat = exports.spaceCombatPreCombat = exports.spaceCombatMain = void 0;
var fDataShips_1 = require("./data/fDataShips");
var functionConfigs_1 = require("./functionConfigs");
var fUnits_1 = require("./models/fUnits");
var fShipTech_1 = require("./tech/fShipTech");
var fFactionUtils_1 = require("./utils/fFactionUtils");
var fGeneralUtils_1 = require("./utils/fGeneralUtils");
var fRandUtils_1 = require("./utils/fRandUtils");
var fUnitUtils_1 = require("./utils/fUnitUtils");
var fWeaponUtils_1 = require("./utils/fWeaponUtils");
function spaceCombatMain(game, units, system) {
    var combat = {
        units: __spreadArrays(units),
        origUnits: __spreadArrays(units),
        system: system,
        round: 0,
        roundLog: [],
        currentRoundLog: {
            round: 0,
            messages: [],
            attacks: [],
            status: []
        },
        done: false
    };
    // PRE COMBAT
    combat = spaceCombatPreCombat(game, combat, system);
    // TODO
    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;
        combat.currentRoundLog = {
            round: combat.round,
            messages: [],
            attacks: [],
            status: []
        };
        combat = spaceCombatAttacks(game, combat);
        combat = spaceCombatDamageResolve(game, combat);
        combat = spaceCombatMorale(game, combat);
        combat = spaceCombatRoundCleanUp(game, combat);
        // if(combat.round >= 10) {
        //     combat.done = true;
        // }
        combat.roundLog.push(__assign({}, combat.currentRoundLog));
        if (combat.round > 100)
            combat.done = true;
    }
    // POST COMBAT
    return spaceCombatPostCombat(combat);
}
exports.spaceCombatMain = spaceCombatMain;
function spaceCombatPreCombat(game, origCombat, system) {
    var combat = __assign({}, origCombat);
    // Deploy Fighters
    var designations = fRandUtils_1.shuffle(["Alpha", "Beta", "Gamma", "Delta", "Phi", "Tau", "Red", "Blue", "Green", "Gold", "Yellow", "Brown", "Tan"]);
    var fighters = combat.units.reduce(function (fighters, unit) {
        if (unit.fighters > 0) {
            var des = designations.pop();
            for (var i = 0; i < unit.fighters; i++) {
                var fighter = fUnitUtils_1.createShipFromDesign(fDataShips_1["default"][0], unit.factionId, { x: 0, y: 0 });
                fighter.name = des + " squadron " + i;
                fighters.push(fighter);
            }
        }
        return fighters;
    }, []);
    combat.units = __spreadArrays(combat.units, fighters);
    combat.origUnits = __spreadArrays(combat.units.map(function (s) {
        return __assign({}, s);
    }));
    return __assign({}, combat);
}
exports.spaceCombatPreCombat = spaceCombatPreCombat;
function spaceCombatPostCombat(combat) {
    // Fighters returning to their ships if possible
    var fightersPerFaction = new Map();
    combat.units.forEach(function (s) {
        if (s.type === fUnits_1.SHIPCLASS.FIGHTER) {
            fGeneralUtils_1.mapAdd(fightersPerFaction, s.factionId, 1);
        }
    });
    combat.units = combat.units
        .map(function (su) {
        su.shields = su.shieldsMax;
        su.experience += combat.round;
        if (su.fightersMax > 0) {
            var fightersLeft = fightersPerFaction.get(su.factionId);
            if (fightersLeft) {
                if (su.fightersMax > fightersLeft) {
                    su.fighters = fightersLeft;
                    fightersPerFaction.set(su.factionId, 0);
                }
                else {
                    su.fighters = su.fightersMax;
                    fightersPerFaction.set(su.factionId, fightersLeft - su.fightersMax);
                }
            }
        }
        return su;
    })
        .filter(function (s) { return s.type !== fUnits_1.SHIPCLASS.FIGHTER; });
    return __assign({}, combat);
}
exports.spaceCombatPostCombat = spaceCombatPostCombat;
function spaceCombatAttacks(game, origCombat) {
    var attackers = __spreadArrays(origCombat.units);
    var combat = __assign({}, origCombat);
    return attackers.reduce(function (combat, ship) {
        var hit = false;
        var nCombat = ship.weapons.reduce(function (c, weapon) {
            // if(weapon.cooldownTime > 0) console.log(c.round, ship.id, weapon);
            if (weaponCanFire(weapon)) {
                ship = updateWeaponInUnit(ship, updateCooldownTime(weapon));
                var target = spaceCombatAttackChooseTarget(c, ship, weapon, game);
                c = updateUnitInCombat(c, ship);
                if (target) {
                    var oldDmg = target.damage + target.shields;
                    c.currentRoundLog.messages.push(ship.name + ":" + weapon.name + ":FIRES:" + target.name);
                    var rc = spaceCombatAttackShoot(game, c, ship, weapon, target);
                    var newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg)
                        hit = true;
                    return __assign({}, rc);
                }
            }
            else {
                c.currentRoundLog.messages.push(ship.name + ":" + weapon.name + ": Cannot fire");
                ship = updateWeaponInUnit(ship, updateCooldownTime(weapon));
                c = updateUnitInCombat(c, ship);
                var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, ship.factionId);
                console.log("WEAPON:", ship.name, weapon, c.round);
                c.currentRoundLog.attacks.push({
                    attacker: ship.id,
                    weapon: weapon.name,
                    weaponId: weapon.id,
                    result: "RELOAD",
                    hitRoll: weapon.cooldown + 1,
                    damage: 0,
                    hitTarget: 0,
                    target: ""
                });
            }
            return __assign({}, c);
        }, __assign({}, combat));
        if (hit) {
            ship.experience++;
        }
        return __assign({}, nCombat);
    }, __assign({}, origCombat));
}
exports.spaceCombatAttacks = spaceCombatAttacks;
function spaceCombatAttackChooseTarget(combat, attacker, weapon, game) {
    var target = combat.units.find(function (su) {
        return su.factionId !== attacker.factionId && su.damage < su.hull;
    });
    if (target) {
        // console.log(`${combat.round}: ${attacker.name} choosing target for ${weapon.name}:`);
        // console.log(`\tInitial target: ${target.name}`);
        var betterTarget = combat.units.reduce(function (t, pos) {
            if (pos.factionId !== attacker.factionId) {
                var posHps = pos.hull + pos.shields - pos.damage;
                var curHps = t.hull + t.shields - t.damage;
                if (pos.damage >= pos.hull || pos.hull === 0) {
                    return t;
                }
                var points = 0;
                // Hit chance
                var oldHitChance = getHitChance(weapon, attacker, t, game);
                var newHitChance = getHitChance(weapon, attacker, pos, game);
                if (newHitChance < 0) {
                    return t;
                }
                var hitChanceValue = Math.round((newHitChance - oldHitChance) / 10);
                points += hitChanceValue > 10 ? 10 : hitChanceValue < -10 ? -10 : hitChanceValue;
                // Damage potential
                var oldDmgPot = damagePotential(weapon, attacker, t, game);
                var newDmgPot = damagePotential(weapon, attacker, pos, game);
                if (newDmgPot < 0) {
                    return t;
                }
                var dmgPotValue = newDmgPot > 150 ? -1 : Math.round(newDmgPot / 10);
                var oldDmgPotValue = oldDmgPot > 150 ? -1 : Math.round(oldDmgPot / 10);
                points += dmgPotValue > oldDmgPotValue ? 1 : 0;
                // console.log("\t", pos.typeClassName, pos.name, hitChanceValue, dmgPotValue, points);
                // const valueO = oldHitChance / 10 + oldDmgPot;
                // const valueN = newHitChance / 10 + newDmgPot;
                if (points <= 0) {
                    // console.log(`\t KEEP: ${t.name} H%${oldHitChance} Dmg: ${oldDmgPot}`);
                    return t;
                }
                else {
                    // console.log(`\t NEW : ${pos.name} H%:${newHitChance/10}  Dmg:${newDmgPot} Val:${valueN}`);
                    return pos;
                }
            }
            return t;
        }, target);
        // console.log(`\tselected: ${betterTarget.name}`);
        if (betterTarget)
            return betterTarget;
        return target;
    }
    combat.currentRoundLog.messages.push("No valid target found for " + attacker.name + ". Combat ends.");
    var factionsWithUnitsInCombat = combat.units.reduce(function (fs, unit) {
        if (!fs.includes(unit.factionId)) {
            fs.push(unit.factionId);
        }
        return fs;
    }, []);
    if (factionsWithUnitsInCombat.length < 2) {
        combat.done = true;
    }
    return null;
}
exports.spaceCombatAttackChooseTarget = spaceCombatAttackChooseTarget;
function spaceCombatAttackShoot(game, combat, attacker, weapon, target) {
    var attackFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    var targetFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, target.factionId);
    if (!attackFaction || !targetFaction)
        return combat;
    var hitChance = getHitChance(weapon, attacker, target, game); //50 + weapon.accuracy - target.agility;
    var hitRoll = fRandUtils_1.rnd(1, 100);
    combat.currentRoundLog.messages.push(attacker.name + ":" + weapon.name + ":" + hitRoll + "/" + hitChance);
    if (hitRoll <= hitChance) {
        var targetFactionUnit = fUnitUtils_1.getFactionAdjustedUnit(targetFaction, target);
        var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, attackFaction);
        var _a = spaceCombatInflictDamage(factionWeapon, target), nTarget_1 = _a[0], dmg = _a[1];
        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            weaponId: weapon.id,
            result: "HIT",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: dmg,
            target: target.id
        });
        combat.units = combat.units.map(function (su) {
            if (su.id === nTarget_1.id) {
                return __assign({}, nTarget_1);
            }
            return su;
        });
    }
    else {
        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            weaponId: weapon.id,
            result: "MISS",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: 0,
            target: target.id
        });
    }
    return __assign({}, combat);
}
exports.spaceCombatAttackShoot = spaceCombatAttackShoot;
function spaceCombatInflictDamage(weapon, targetUnit) {
    var _a, _b, _c;
    var loop = 1 +
        (weapon.special.includes(fDataShips_1.SHIPWEAPONSPECIAL.DOUBLESHOT) ? 1 : 0) +
        (weapon.special.includes(fDataShips_1.SHIPWEAPONSPECIAL.RAPIDFIRE) ? 2 : 0) +
        (weapon.special.includes(fDataShips_1.SHIPWEAPONSPECIAL.HAILOFFIRE) ? 4 : 0);
    var totalDmg = 0;
    for (var i = 0; i < loop; i++) {
        var dmg = Array.isArray(weapon.damage) ? fRandUtils_1.rnd(weapon.damage[0], weapon.damage[1]) : weapon.damage;
        var newDmg = 0;
        switch (weapon.type) {
            case fUnits_1.WEAPONTYPE.KINETIC:
                _a = spaceCombatKineticDamage(dmg, weapon, targetUnit), targetUnit = _a[0], newDmg = _a[1];
                break;
            case fUnits_1.WEAPONTYPE.MISSILE:
                _b = spaceCombatMissileDamage(dmg, weapon, targetUnit), targetUnit = _b[0], newDmg = _b[1];
                break;
            default:
                _c = spaceCombatDefaultDamage(dmg, weapon, targetUnit), targetUnit = _c[0], newDmg = _c[1];
                break;
        }
        totalDmg += newDmg;
        // if (targetUnit.shields  > 0) {
        // 	if (targetUnit.shields >= dmg) {
        // 		targetUnit.shields -= dmg;
        // 	} else {
        //         const dmgThrough = dmg - targetUnit.shields;
        // 		targetUnit.damage += dmgThrough - targetUnit.armor;
        // 		targetUnit.shields = 0;
        // 	}
        // } else {
        // 	targetUnit.damage += dmg - targetUnit.armor;
        // }
    }
    return [__assign({}, targetUnit), totalDmg];
}
exports.spaceCombatInflictDamage = spaceCombatInflictDamage;
// Kinetic weapons ignore shields but are more heavily affected by armor
function spaceCombatKineticDamage(damage, weapon, target) {
    var dmg = damage - getArmorValue(weapon, target);
    target.damage += Math.round(dmg > 0 ? dmg : 0);
    return [__assign({}, target), Math.round(dmg > 0 ? dmg : 0)];
}
// Energy weapons are baseline weapons
function spaceCombatDefaultDamage(damage, weapon, target) {
    var damageLeft = damage;
    if (target.shields > 0) {
        if (target.shields > damageLeft) {
            target.shields -= damageLeft;
            damageLeft = 0;
        }
        else {
            damageLeft -= target.shields;
            target.shields = 0;
        }
    }
    var dmgPreCheck = damageLeft - getArmorValue(weapon, target);
    var totDmg = dmgPreCheck >= 0 ? dmgPreCheck : 0;
    target.damage += totDmg;
    return [__assign({}, target), totDmg];
}
// Missle weapons cause double damage to shields
function spaceCombatMissileDamage(damage, weapon, target) {
    var damageLeft = damage;
    if (target.shields > 0) {
        if (target.shields > damageLeft * 2) {
            target.shields -= damageLeft * 2;
            damageLeft = 0;
        }
        else {
            damageLeft -= Math.ceil(target.shields / 2);
            target.shields = 0;
        }
    }
    var dmgPreCheck = damageLeft - getArmorValue(weapon, target);
    var totDmg = dmgPreCheck >= 0 ? dmgPreCheck : 0;
    // const totDmg = Math.round(damageLeft >= 0 ? damageLeft : 0);
    target.damage += totDmg;
    return [__assign({}, target), totDmg];
}
function getArmorValue(weapon, target) {
    var mult = weapon.type === fUnits_1.WEAPONTYPE.KINETIC ? 1.25 : 1;
    return weapon.special.includes(fDataShips_1.SHIPWEAPONSPECIAL.ARMOURPIERCE) ? 0 : target.armor * mult;
}
function spaceCombatDamageResolve(game, combat) {
    combat.units = combat.units.filter(function (unit) {
        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, unit.factionId);
        if (!faction)
            throw new Error("Invalid facion on unit " + unit.id + " " + unit.factionId);
        var factionUnit = fUnitUtils_1.getFactionAdjustedUnit(faction, unit);
        var destroyed = unit.damage >= factionUnit.hull;
        var status = {
            unitId: unit.id,
            damage: unit.damage,
            shields: unit.shields,
            hull: unit.hull,
            morale: 100,
            retreated: false,
            destroyed: destroyed
        };
        combat.currentRoundLog.status.push(status);
        if (destroyed) {
            var logText = unit.factionId + " " + unit.name + " is destroyed with " + unit.damage + " / " + factionUnit.hull + "!";
            combat.currentRoundLog.messages.push(logText);
            return false;
        }
        else {
            var logText = unit.factionId + " " + unit.name + " HULL DAMAGE: " + unit.damage + " / " + factionUnit.hull + " SHIELDS: " + unit.shields + " / " + factionUnit.shieldsMax;
            combat.currentRoundLog.messages.push(logText);
        }
        return true;
    });
    return combat;
}
exports.spaceCombatDamageResolve = spaceCombatDamageResolve;
function spaceCombatMorale(game, combat) {
    return combat;
}
exports.spaceCombatMorale = spaceCombatMorale;
function spaceCombatRoundCleanUp(game, combat) {
    combat.units = combat.units.map(function (su) {
        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, su.factionId);
        if (!faction)
            throw new Error("Invalid facion on unit " + su.id + " " + su.factionId);
        var factionUnit = fUnitUtils_1.getFactionAdjustedUnit(faction, su);
        // Shield Regeneration
        if (factionUnit.shieldsMax > 0) {
            if (su.shields < factionUnit.shieldsMax) {
                su.shields += factionUnit.shieldRegeneration;
                if (su.shields > factionUnit.shieldsMax) {
                    su.shields = factionUnit.shieldsMax;
                }
            }
        }
        su.damage -= fShipTech_1.techAutoRepairBots2(faction, su);
        if (su.damage < 0) {
            su.damage = 0;
        }
        return su;
    });
    if (combat.units.length === 0)
        combat.done = true;
    if (combat.round >= functionConfigs_1.COMBAT_MAXROUNDS) {
        combat.done = true;
    }
    return __assign({}, combat);
}
exports.spaceCombatRoundCleanUp = spaceCombatRoundCleanUp;
function weaponCanFire(weapon) {
    // No cool down
    if (weapon.cooldownTime === 0) {
        return true;
    }
    // Weapon is reloading
    if (weapon.cooldown > 0) {
        return false;
    }
    // Fire!
    return true;
}
exports.weaponCanFire = weaponCanFire;
function updateCooldownTime(weapon) {
    // No cool down
    if (weapon.cooldownTime === 0) {
        return weapon;
    }
    // Weapon is reloading
    if (weapon.cooldown > 0) {
        weapon.cooldown--;
        return __assign({}, weapon);
    }
    // Fire!
    weapon.cooldown = weapon.cooldownTime;
    return __assign({}, weapon);
}
exports.updateCooldownTime = updateCooldownTime;
function getHitChance(weapon, attacker, target, game) {
    var attFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    var tarFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    if (!attFaction || !tarFaction)
        return 0;
    var targetUnit = fUnitUtils_1.getFactionAdjustedUnit(tarFaction, target);
    var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, attFaction);
    var chance = 50 + factionWeapon.accuracy - targetUnit.agility + fWeaponUtils_1.specialAntiFighter(weapon, attacker, targetUnit);
    var sizeMod = (target.sizeIndicator - attacker.sizeIndicator) * 2;
    return chance + sizeMod;
}
exports.getHitChance = getHitChance;
function damagePotential(weapon, attacker, target, game) {
    var attFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    var tarFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    if (!attFaction || !tarFaction)
        return 0;
    var targetUnit = fUnitUtils_1.getFactionAdjustedUnit(tarFaction, target);
    var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, attFaction);
    var maxDamage = fUnitUtils_1.getMaxDamageForWeapon(factionWeapon, true, targetUnit.armor);
    var hpleft = targetUnit.hull - target.damage + target.shields;
    return Math.round(((maxDamage - targetUnit.armor) / hpleft) * 100);
}
exports.damagePotential = damagePotential;
function updateUnitInCombat(combat, unit) {
    combat.units = combat.units.map(function (s) {
        if (s.id === unit.id) {
            return __assign({}, unit);
        }
        return s;
    });
    return __assign({}, combat);
}
exports.updateUnitInCombat = updateUnitInCombat;
function updateWeaponInUnit(unit, weapon) {
    unit.weapons = unit.weapons.map(function (w) {
        if (w.id === weapon.id) {
            return __assign({}, weapon);
        }
        return w;
    });
    return __assign({}, unit);
}
