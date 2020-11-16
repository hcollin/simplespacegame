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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fDataTechnology_1 = require("./data/fDataTechnology");
var functionConfigs_1 = require("./functionConfigs");
var fCommands_1 = require("./models/fCommands");
var fModels_1 = require("./models/fModels");
var fBuildingUtils_1 = require("./utils/fBuildingUtils");
var fFactionUtils_1 = require("./utils/fFactionUtils");
var fLocationUtils_1 = require("./utils/fLocationUtils");
var fMathUtils_1 = require("./utils/fMathUtils");
var fRandUtils_1 = require("./utils/fRandUtils");
var fTechUtils_1 = require("./utils/fTechUtils");
var fUnitUtils_1 = require("./utils/fUnitUtils");
function processTurn(origGame, commands) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            game = __assign({}, origGame);
            game.systems = game.systems.map(function (sm) {
                sm.reports = [];
                return sm;
            });
            console.log("START TURN PROCESSING!", game.name, game.turn);
            if (commands) {
                game = processSystemCommands(commands, game);
                game = processMovementCommands(commands, game);
                // Process trades
                game = processTrades(game);
                game = processResearchCommands(commands, game);
                game = processCombats(game);
                game = processInvasion(game);
            }
            // Process economy
            game = processEconomy(game);
            // Process Research
            game = processResearch(game);
            // Win Conditions
            game = processWinConditions(game);
            // Increase turn counter
            game.turn++;
            // Clear ready states
            game.factionsReady = [];
            // // Clear Commands
            // api.api.trigger({
            //     from: serviceId,
            //     action: "nextTurn",
            // });
            game.state = fModels_1.GameState.TURN;
            // await saveGame();
            // sendUpdate();
            return [2 /*return*/, [__assign({}, game), __spreadArrays((commands || []))]];
        });
    });
}
exports.processTurn = processTurn;
function processWinConditions(game) {
    var winners = [];
    // Score based winning to be done
    // If there is a winner(s) mark them down and end the game.
    if (winners.length > 0) {
        game.factions = game.factions.map(function (fm) {
            if (winners.includes(fm.id)) {
                fm.state = fModels_1.FactionState.WON;
            }
            else {
                fm.state = fModels_1.FactionState.LOST;
            }
            return __assign({}, fm);
        });
        game.state = fModels_1.GameState.ENDED;
    }
    return __assign({}, game);
}
function processMovementCommands(commands, oldGame) {
    var game = __assign({}, oldGame);
    commands.forEach(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.FleetMove) {
            game = processFleetMoveCommand(cmd, game);
        }
    });
    return game;
}
function processResearch(oldGame) {
    var game = __assign({}, oldGame);
    game.factions = game.factions.map(function (fm) {
        var pointsGenerated = fFactionUtils_1.researchPointGenerationCalculator(game, fm);
        var distribution = fFactionUtils_1.researchPointDistribution(pointsGenerated, fm);
        fm.technologyFields = fm.technologyFields.map(function (tech, index) {
            tech.points += distribution[index];
            return __assign({}, tech);
        });
        return fm;
    });
    return game;
}
function processTrades(oldGame) {
    var game = __assign({}, oldGame);
    game.trades = game.trades.map(function (tr) {
        var success = false;
        var fromFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, tr.from);
        var toFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, tr.to);
        if (fromFaction && toFaction) {
            if (fromFaction.money >= tr.money) {
                fromFaction.money -= tr.money;
                toFaction.money += tr.money;
                success = true;
            }
        }
        if (success && fromFaction && toFaction) {
            tr.length--;
            game = updateFactionInGame(game, fromFaction);
            game = updateFactionInGame(game, toFaction);
        }
        return __assign({}, tr);
    });
    return game;
}
function processResearchCommands(commands, oldGame) {
    var game = __assign({}, oldGame);
    commands.forEach(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.TechnologyResearch) {
            var command_1 = cmd;
            var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command_1.factionId);
            if (faction) {
                var tech = fDataTechnology_1.DATATECHNOLOGY.find(function (t) { return t.id === command_1.techId; });
                if (tech && faction && fTechUtils_1.canAffordTech(tech, faction)) {
                    faction.technologyFields = fTechUtils_1.factionPaysForTech(faction.technologyFields, tech);
                    faction.technology.push(tech.id);
                    game = updateFactionInGame(game, faction);
                    markCommandDone(cmd);
                }
            }
        }
    });
    return game;
}
function processSystemCommands(commands, oldGame) {
    var game = __assign({}, oldGame);
    commands.forEach(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.SystemEconomy) {
            game = processSystemEconomyCommand(cmd, game);
        }
        if (cmd.type === fCommands_1.CommandType.SystemWelfare) {
            game = processSystemWelfareCommand(cmd, game);
        }
        if (cmd.type === fCommands_1.CommandType.SystemDefense) {
            game = processSysteDefenseCommand(cmd, game);
        }
        if (cmd.type === fCommands_1.CommandType.SystemIndustry) {
            game = processSystemIndustryCommand(cmd, game);
        }
        if (cmd.type === fCommands_1.CommandType.SystemBuildUnit) {
            game = processSystemBuildUnitCommand(cmd, game);
        }
        if (cmd.type === fCommands_1.CommandType.SystemBuildingBuild) {
            game = processSystemBuildBuildingCommand(cmd, game);
        }
    });
    return game;
}
function processInvasion(oldGame) {
    var game = __assign({}, oldGame);
    var invadedSystems = [];
    oldGame.units.forEach(function (um) {
        var star = game.systems.find(function (s) { return fLocationUtils_1.inSameLocation(s.location, um.location); });
        if (star && star.ownerFactionId !== um.factionId) {
            star.ownerFactionId = um.factionId;
            invadedSystems.push(star);
        }
    });
    invadedSystems.forEach(function (sm) {
        game = addReportToSystem(game, sm, fModels_1.ReportType.EVENT, [sm.ownerFactionId], ["System Conquered"]);
    });
    return game;
}
function processEconomy(game) {
    game.factions = game.factions.map(function (fm) {
        var values = fFactionUtils_1.factionValues(game, fm.id);
        fm.money += values.income;
        return __assign({}, fm);
    });
    return __assign({}, game);
}
function processCombats(game) {
    var combats = [];
    game.systems.forEach(function (star) {
        var unitsInSystem = game.units.filter(function (unit) { return fLocationUtils_1.inSameLocation(star.location, unit.location); });
        if (unitsInSystem.length > 0) {
            var factions = unitsInSystem.reduce(function (factions, unit) {
                factions.add(unit.factionId);
                return factions;
            }, new Set());
            if (factions.size > 1) {
                combats.push({
                    units: unitsInSystem,
                    system: star,
                    round: 0,
                    log: [],
                    done: false
                });
            }
        }
    });
    combats.length > 0 && console.log("COMBATS", combats);
    combats.forEach(function (combat) {
        game = resolveCombat(game, combat);
    });
    return __assign({}, game);
}
function processSystemEconomyCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.economy++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}
function processSystemWelfareCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.welfare++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}
function processSystemIndustryCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.industry++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}
function processSystemBuildUnitCommand(command, game) {
    var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command.factionId);
    if (faction) {
        var unit = fUnitUtils_1.createShipFromDesign(fUnitUtils_1.getDesignByName(command.shipName), command.factionId, command.target);
        if (faction.money >= unit.cost) {
            game.units.push(unit);
            faction.money = faction.money - unit.cost;
            markCommandDone(command);
            return updateFactionInGame(game, faction);
        }
    }
    markCommandDone(command);
    return __assign({}, game);
}
function processSystemBuildBuildingCommand(command, game) {
    var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command.factionId);
    if (faction) {
        var bdesign = fBuildingUtils_1.getBuildingDesignByType(command.buildingType);
        if (command.turn === game.turn) {
            // If faction can afford the building pay the cost and start building;
            if (faction.money >= bdesign.cost) {
                faction.money = faction.money - bdesign.cost;
                command.turnsLeft--;
                if (command.turnsLeft === 0) {
                    markCommandDone(command);
                    var system = getSystemFromGame(game, command.targetSystem);
                    system.buildings.push(fBuildingUtils_1.createBuildingFromDesign(bdesign));
                    return updateFactionInGame(updateSystemInGame(game, system), faction);
                }
                command.save = true;
                return updateFactionInGame(game, faction);
            }
            // If the cannot build the building just do not execute this command
            //TODO: Add info to turn report about this. When turn reports exist...
        }
        else {
            command.turnsLeft--;
            // Finish building
            if (command.turnsLeft === 0) {
                var system = getSystemFromGame(game, command.targetSystem);
                system.buildings.push(fBuildingUtils_1.createBuildingFromDesign(bdesign));
                markCommandDone(command);
                return updateSystemInGame(game, system);
            }
            else {
                command.save = true;
            }
        }
    }
    return __assign({}, game);
}
function processSysteDefenseCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.defense++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}
function processFleetMoveCommand(command, game) {
    var newPoint = null;
    var nGame = __assign({}, game);
    command.unitIds.forEach(function (uid) {
        var unit = getUnitFromGame(game, uid);
        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, unit.factionId);
        if (newPoint === null) {
            newPoint = fMathUtils_1.travelingBetweenCoordinates(unit.location, command.target, fUnitUtils_1.getShipSpeed(unit, faction));
        }
        var nUnit = __assign({}, unit);
        nUnit.location = newPoint;
        if (fLocationUtils_1.inSameLocation(newPoint, command.target)) {
            markCommandDone(command);
        }
        nGame = updateUnitInGame(nGame, nUnit);
    });
    return __assign({}, nGame);
}
function getSystemFromGame(game, systemId) {
    var system = game.systems.find(function (sm) { return sm.id === systemId; });
    if (!system) {
        throw new Error("Invalid system id " + systemId);
    }
    return system;
}
function getUnitFromGame(game, unitId) {
    var unit = game.units.find(function (u) { return u.id === unitId; });
    if (!unit) {
        throw new Error("Invalid unit id " + unitId);
    }
    return unit;
}
function resolveCombat(game, origCombat) {
    if (origCombat.system === null) {
        throw new Error("Combat cannot happen outside of a system, the null is only used in testing needs to be removed");
    }
    var factionIds = origCombat.units.reduce(function (fids, u) {
        if (!fids.has(u.factionId)) {
            fids.add(u.factionId);
        }
        return fids;
    }, new Set());
    var combat = spaceCombatMain(game, origCombat.units, origCombat.system);
    var destroyedUnits = origCombat.units
        .filter(function (ou) {
        var isAlive = combat.units.find(function (au) { return au.id === ou.id; });
        if (!isAlive) {
            return true;
        }
        return false;
    })
        .map(function (u) { return u.id; });
    game.units = game.units.reduce(function (units, unit) {
        if (destroyedUnits.includes(unit.id))
            return units;
        var cunit = combat.units.find(function (au) { return au.id === unit.id; });
        if (cunit) {
            units.push(cunit);
        }
        else {
            units.push(unit);
        }
        return units;
    }, []);
    return addReportToSystem(game, origCombat.system, fModels_1.ReportType.COMBAT, Array.from(factionIds), combat.log);
    // return updateSystemInGame(game, system);
}
function updateSystemInGame(game, updatedSystem) {
    game.systems = game.systems.reduce(function (systems, sys) {
        if (sys.id === updatedSystem.id) {
            systems.push(updatedSystem);
        }
        else {
            systems.push(sys);
        }
        return systems;
    }, []);
    return __assign({}, game);
}
function updateUnitInGame(game, updatedUnit) {
    game.units = game.units.map(function (um) {
        if (um.id === updatedUnit.id) {
            return updatedUnit;
        }
        return um;
    });
    return __assign({}, game);
}
function updateFactionInGame(game, faction) {
    game.factions = game.factions.map(function (fm) {
        if (fm.id === faction.id) {
            return faction;
        }
        return fm;
    });
    return __assign({}, game);
}
function addReportToSystem(game, system, type, factionIds, texts) {
    system.reports.push({
        factions: factionIds,
        turn: game.turn,
        type: type,
        text: texts
    });
    return updateSystemInGame(game, system);
}
function markCommandDone(command) {
    command.completed = true;
}
function spaceCombatMain(game, units, system) {
    var combat = {
        units: __spreadArrays(units),
        system: system,
        round: 0,
        log: [],
        done: false
    };
    combat.log.push("Space combat starts");
    // PRE COMBAT
    // TODO
    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;
        combat.log.push("ROUND " + combat.round);
        combat = spaceCombatAttacks(game, combat);
        combat = spaceCombatDamageResolve(game, combat);
        combat = spaceCombatMorale(game, combat);
        combat = spaceCombatRoundCleanUp(game, combat);
        // if(combat.round >= 10) {
        //     combat.done = true;
        // }
    }
    // POST COMBAT
    combat.units = combat.units.map(function (su) {
        su.shields = su.shieldsMax;
        su.experience += combat.round;
        return su;
    });
    combat.log.push("Space combat ends");
    return combat;
}
exports.spaceCombatMain = spaceCombatMain;
function spaceCombatAttacks(game, origCombat) {
    var attackers = __spreadArrays(origCombat.units);
    var combat = __assign({}, origCombat);
    attackers.forEach(function (ship) {
        var hit = false;
        ship.weapons.forEach(function (weapon) {
            if (weaponCanFire(weapon)) {
                var target = spaceCombatAttackChooseTarget(combat, ship, weapon);
                if (target) {
                    var oldDmg = target.damage + target.shields;
                    combat = spaceCombatAttackShoot(game, combat, ship, weapon, target);
                    var newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg)
                        hit = true;
                }
            }
            else {
                var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, ship.factionId);
                combat.log.push("RELOADING: " + faction.name + " " + ship.name + " is reloading " + weapon.name + ", " + (weapon.cooldown + 1) + " round until ready to fire");
            }
        });
        if (hit) {
            ship.experience++;
        }
    });
    return combat;
}
exports.spaceCombatAttacks = spaceCombatAttacks;
function spaceCombatAttackChooseTarget(combat, attacker, weapon) {
    var target = combat.units.find(function (su) {
        return su.factionId !== attacker.factionId;
    });
    if (target) {
        // const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
        //     if(t.factionId !== attacker.factionId) {
        //         const oldHitChance = getHitChance(attacker.factionId, weapon, attacker, t);
        //         const newHitChance = getHitChance(attacker.factionId, weapon, attacker, pos);
        //         const oldDmgPot = damagePotential(weapon, t);
        //         const newDmgPot = damagePotential(weapon, pos);
        //         const valueO = oldHitChance + oldDmgPot;
        //         const valueN = newHitChance + newDmgPot;
        //         if(valueO > valueN) {
        //             return t;
        //         } else {
        //             return pos;
        //         }
        //     }
        //     return t;
        // }, target);
        return target;
    }
    combat.done = true;
    return null;
}
exports.spaceCombatAttackChooseTarget = spaceCombatAttackChooseTarget;
function spaceCombatAttackShoot(game, combat, attacker, weapon, target) {
    var attackFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, attacker.factionId);
    var targetFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, target.factionId);
    if (!attackFaction || !targetFaction)
        return combat;
    var hitChance = getHitChance(attackFaction, weapon, attacker, target); //50 + weapon.accuracy - target.agility;
    var hitRoll = fRandUtils_1.rnd(1, 100);
    if (hitRoll <= hitChance) {
        var targetFactionUnit = fUnitUtils_1.getFactionAdjustedUnit(targetFaction, target);
        var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, attackFaction);
        var dmg = (Array.isArray(factionWeapon.damage)
            ? fRandUtils_1.rnd(factionWeapon.damage[0], factionWeapon.damage[1])
            : factionWeapon.damage) - targetFactionUnit.armor;
        if (target.shields > 0) {
            if (target.shields >= dmg) {
                target.shields -= dmg;
            }
            else {
                target.damage += dmg - target.shields;
                target.shields = 0;
            }
        }
        else {
            target.damage += dmg;
        }
        combat.log.push("HIT (" + hitRoll + " <= " + hitChance + "): " + attackFaction.name + " " + attacker.name + " shoots " + target.name + " of " + targetFaction.name + " with " + weapon.name + " causing " + dmg + " points of hull damage.");
        combat.units = combat.units.map(function (su) {
            if (su.id === target.id) {
                return target;
            }
            return su;
        });
    }
    else {
        combat.log.push("MISS (" + hitRoll + " > " + hitChance + "): " + attackFaction.name + " " + attacker.name + " misses " + target.name + " of " + targetFaction.name + " with " + weapon.name + ".");
    }
    return __assign({}, combat);
}
exports.spaceCombatAttackShoot = spaceCombatAttackShoot;
function spaceCombatDamageResolve(game, combat) {
    combat.units = combat.units.filter(function (unit) {
        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, unit.factionId);
        if (!faction)
            throw new Error("Invalid facion on unit " + unit.id + " " + unit.factionId);
        var factionUnit = fUnitUtils_1.getFactionAdjustedUnit(faction, unit);
        var destroyed = unit.damage >= factionUnit.hull;
        if (destroyed) {
            combat.log.push(unit.factionId + " " + unit.name + " is destroyed with " + unit.damage + " / " + factionUnit.hull + "!");
            return false;
        }
        else {
            combat.log.push(unit.factionId + " " + unit.name + " HULL DAMAGE: " + unit.damage + " / " + factionUnit.hull + " SHIELDS: " + unit.shields + " / " + factionUnit.shieldsMax);
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
        weapon.cooldown--;
        return false;
    }
    // Fire!
    weapon.cooldown = weapon.cooldownTime;
    return true;
}
exports.weaponCanFire = weaponCanFire;
function getHitChance(faction, weapon, attacker, target) {
    var targetUnit = fUnitUtils_1.getFactionAdjustedUnit(faction, target);
    var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, faction);
    var chance = 50 + factionWeapon.accuracy - targetUnit.agility;
    return chance;
}
exports.getHitChance = getHitChance;
function damagePotential(weapon, target, faction) {
    var targetUnit = fUnitUtils_1.getFactionAdjustedUnit(faction, target);
    var factionWeapon = fUnitUtils_1.getFactionAdjustedWeapon(weapon, faction);
    var maxDamage = Array.isArray(factionWeapon.damage) ? factionWeapon.damage[1] : factionWeapon.damage;
    var hpleft = targetUnit.hull - target.damage + target.shields;
    return Math.round((maxDamage / hpleft) * 100);
}
exports.damagePotential = damagePotential;
