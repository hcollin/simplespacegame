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
exports.damagePotential = exports.getHitChance = exports.weaponCanFire = exports.spaceCombatRoundCleanUp = exports.spaceCombatMorale = exports.spaceCombatDamageResolve = exports.spaceCombatInflictDamage = exports.spaceCombatAttackShoot = exports.spaceCombatAttackChooseTarget = exports.spaceCombatAttacks = exports.spaceCombatPostCombat = exports.spaceCombatPreCombat = exports.spaceCombatMain = exports.processTurn = void 0;
var fBuildingRules_1 = require("./buildings/fBuildingRules");
var fDataBuildings_1 = require("./data/fDataBuildings");
var fDataShips_1 = require("./data/fDataShips");
var fDataTechnology_1 = require("./data/fDataTechnology");
var functionConfigs_1 = require("./functionConfigs");
var fCommands_1 = require("./models/fCommands");
var fModels_1 = require("./models/fModels");
var fReport_1 = require("./models/fReport");
var fUnits_1 = require("./models/fUnits");
var fShipTech_1 = require("./tech/fShipTech");
var fBuildingUtils_1 = require("./utils/fBuildingUtils");
var fFactionUtils_1 = require("./utils/fFactionUtils");
var fGeneralUtils_1 = require("./utils/fGeneralUtils");
var fLocationUtils_1 = require("./utils/fLocationUtils");
var fMathUtils_1 = require("./utils/fMathUtils");
var fRandUtils_1 = require("./utils/fRandUtils");
var fSystemUtils_1 = require("./utils/fSystemUtils");
var fTechUtils_1 = require("./utils/fTechUtils");
var fUnitUtils_1 = require("./utils/fUnitUtils");
var fWeaponUtils_1 = require("./utils/fWeaponUtils");
function processTurn(origGame, commands, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = __assign({}, origGame);
                    game.systems = game.systems.map(function (sm) {
                        sm.reports = [];
                        return sm;
                    });
                    console.log("START TURN PROCESSING!", game.name, game.turn);
                    if (!commands) return [3 /*break*/, 4];
                    return [4 /*yield*/, processSystemCommands(commands, game, firestore)];
                case 1:
                    game = _a.sent();
                    game = processMovementCommands(commands, game);
                    // Process trades
                    game = processTrades(game);
                    game = processResearchCommands(commands, game);
                    return [4 /*yield*/, processCombats(game, firestore)];
                case 2:
                    game = _a.sent();
                    return [4 /*yield*/, processInvasion(game, firestore)];
                case 3:
                    game = _a.sent();
                    _a.label = 4;
                case 4:
                    // Process economy
                    game = processEconomy(game);
                    // Process Repairs
                    game = processRepairs(game);
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
            }
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
function processSystemCommands(commands, oldGame, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var game, i, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = __assign({}, oldGame);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < commands.length)) return [3 /*break*/, 4];
                    cmd = commands[i];
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
                    if (!(cmd.type === fCommands_1.CommandType.SystemBuildingBuild)) return [3 /*break*/, 3];
                    return [4 /*yield*/, processSystemBuildBuildingCommand(cmd, game, firestore)];
                case 2:
                    game = _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, game];
            }
        });
    });
}
function processInvasion(oldGame, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var game, invadedSystems, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    game = __assign({}, oldGame);
                    invadedSystems = [];
                    _a = oldGame;
                    return [4 /*yield*/, fGeneralUtils_1.asyncArrayMap(oldGame.systems, function (sm) { return __awaiter(_this, void 0, void 0, function () {
                            var factionTroopCount, invasionTexts;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        factionTroopCount = new Map();
                                        invasionTexts = [];
                                        oldGame.units.forEach(function (um) {
                                            if (fLocationUtils_1.inSameLocation(sm.location, um.location) && sm.ownerFactionId !== um.factionId) {
                                                var attackingFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, um.factionId);
                                                if (fBuildingUtils_1.systemHasBuilding(sm, fDataBuildings_1.BUILDINGTYPE.ORBCANNONS)) {
                                                    var afterOrbitalCannon = fBuildingRules_1.buildingOrbitalCannon(sm, um.troops);
                                                    invasionTexts.push("Orbital cannons shot down " + (um.troops - afterOrbitalCannon) + " " + attackingFaction.name + " troops while they were landing.");
                                                    invasionTexts.push(afterOrbitalCannon + " " + attackingFaction.name + "  troops started the invasion");
                                                    if (afterOrbitalCannon <= 0) {
                                                        invasionTexts.push("Orbital cannon shot down all " + attackingFaction.name + " troops");
                                                    }
                                                    fGeneralUtils_1.mapAdd(factionTroopCount, um.factionId, afterOrbitalCannon);
                                                }
                                                else {
                                                    invasionTexts.push(um.troops + " " + attackingFaction.name + "  troops started the invasion");
                                                    fGeneralUtils_1.mapAdd(factionTroopCount, um.factionId, um.troops);
                                                }
                                            }
                                        });
                                        if (!(factionTroopCount.size > 0)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, fGeneralUtils_1.asyncMapForeach(factionTroopCount, function (troops, factionId) { return __awaiter(_this, void 0, void 0, function () {
                                                var defenses, attackingFaction, ownerFaction, ownerName, report;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            defenses = fSystemUtils_1.getSystemDefence(game, sm);
                                                            attackingFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, factionId);
                                                            ownerFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, sm.ownerFactionId);
                                                            ownerName = ownerFaction ? ownerFaction.name : "Neutral faction";
                                                            invasionTexts.push(ownerName + " is defending with " + defenses + " defense value.");
                                                            if (troops > defenses) {
                                                                sm.ownerFactionId = factionId;
                                                                invadedSystems.push(sm);
                                                                invasionTexts.push(attackingFaction.name + " succesfully invades " + sm.name + " from " + ownerName);
                                                            }
                                                            else {
                                                                invasionTexts.push("Invasion of " + sm.name + " by " + attackingFaction.name + " from " + ownerName + " has failed!");
                                                            }
                                                            return [4 /*yield*/, createNewReport({
                                                                    id: "",
                                                                    factionIds: [sm.ownerFactionId, factionId],
                                                                    gameId: game.id,
                                                                    systemId: sm.id,
                                                                    invaders: troops,
                                                                    defenders: defenses,
                                                                    texts: invasionTexts,
                                                                    title: "Invasion of " + sm.name,
                                                                    turn: game.turn,
                                                                    type: fReport_1.DetailReportType.Invasion
                                                                }, firestore)];
                                                        case 1:
                                                            report = _a.sent();
                                                            game = addReportToSystem(game, sm, fReport_1.DetailReportType.System, [sm.ownerFactionId], report.id);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, sm];
                                }
                            });
                        }); })];
                case 1:
                    _a.systems = _b.sent();
                    return [2 /*return*/, game];
            }
        });
    });
}
function processEconomy(game) {
    game.factions = game.factions.map(function (fm) {
        var values = fFactionUtils_1.factionValues(game, fm.id);
        fm.money += values.income;
        var _a = fFactionUtils_1.calculateFactionDebt(game, fm), debt = _a[0], payback = _a[1];
        fm.debt = debt;
        fm.money -= payback;
        return __assign({}, fm);
    });
    return __assign({}, game);
}
function processRepairs(oldGame) {
    var game = __assign({}, oldGame);
    // Repairing units and fighters
    game.units = game.units.map(function (unit) {
        var star = fSystemUtils_1.getSystemByCoordinates(game, unit.location);
        if (star) {
            if (star.ownerFactionId === unit.factionId) {
                if (unit.damage > 0) {
                    var repairValue = star.industry * unit.sizeIndicator * fBuildingRules_1.buildingRepairStation(star);
                    unit.damage = repairValue > unit.damage ? 0 : unit.damage - repairValue;
                }
                if (unit.fighters < unit.fightersMax) {
                    unit.fighters = unit.fighters + 1 * fBuildingRules_1.buildingRepairStation(star);
                }
            }
        }
        var unitOwnerFaction = fFactionUtils_1.getFactionFromArrayById(game.factions, unit.factionId);
        unit.damage -= fShipTech_1.techAutoRepairBots(unitOwnerFaction, unit);
        if (unit.damage < 0) {
            unit.damage = 0;
        }
        return __assign({}, unit);
    });
    return game;
}
function processCombats(game, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var combats, i, combat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    combats = [];
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
                                    origUnits: [],
                                    system: star,
                                    round: 0,
                                    done: false,
                                    roundLog: [],
                                    currentRoundLog: {
                                        attacks: [],
                                        messages: [],
                                        round: 0,
                                        status: []
                                    }
                                });
                            }
                        }
                    });
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < combats.length)) return [3 /*break*/, 4];
                    combat = combats[i];
                    if (!combat) return [3 /*break*/, 3];
                    return [4 /*yield*/, resolveCombat(game, combat, firestore)];
                case 2:
                    game = _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    combats.forEach(function (combat) { });
                    return [2 /*return*/, __assign({}, game)];
            }
        });
    });
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
        var shipDesign = fUnitUtils_1.getDesignByName(command.shipName);
        var system = getSystemFromGame(game, command.targetSystem);
        if (command.turn === game.turn) {
            var cost = shipDesign.cost * fBuildingRules_1.buildingRobotWorkers(system);
            if (faction.money >= cost) {
                faction.money = faction.money - cost;
                command.turnsLeft--;
                if (fBuildingRules_1.buildingDysonSphere(system)) {
                    command.turnsLeft = 0;
                }
                if (command.turnsLeft === 0) {
                    markCommandDone(command);
                    var unit = fUnitUtils_1.createShipFromDesign(shipDesign, command.factionId, system.location);
                    game.units.push(unit);
                    return updateFactionInGame(game, faction);
                }
                command.save = true;
                return updateFactionInGame(game, faction);
            }
        }
        else {
            command.turnsLeft--;
            if (fBuildingRules_1.buildingDysonSphere(system)) {
                command.turnsLeft = 0;
            }
            if (command.turnsLeft === 0) {
                markCommandDone(command);
                var unit = fUnitUtils_1.createShipFromDesign(shipDesign, command.factionId, system.location);
                game.units.push(unit);
                return updateFactionInGame(game, faction);
            }
            else {
                command.save = true;
            }
        }
    }
    return __assign({}, game);
}
function processSystemBuildBuildingCommand(command, game, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var faction, bdesign, system, cost, system_1, report, system_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command.factionId);
                    if (!faction) return [3 /*break*/, 5];
                    bdesign = fBuildingUtils_1.getBuildingDesignByType(command.buildingType);
                    system = getSystemFromGame(game, command.targetSystem);
                    if (!(command.turn === game.turn)) return [3 /*break*/, 4];
                    cost = bdesign.cost * fBuildingRules_1.buildingRobotWorkers(system);
                    if (!(faction.money >= cost)) return [3 /*break*/, 3];
                    faction.money = faction.money - cost;
                    command.turnsLeft--;
                    if (fBuildingRules_1.buildingDysonSphere(system)) {
                        command.turnsLeft = 0;
                    }
                    if (!(command.turnsLeft === 0)) return [3 /*break*/, 2];
                    markCommandDone(command);
                    system_1 = getSystemFromGame(game, command.targetSystem);
                    system_1.buildings.push(fBuildingUtils_1.createBuildingFromDesign(bdesign));
                    return [4 /*yield*/, createNewReport({
                            id: "",
                            factionIds: [system_1.ownerFactionId],
                            gameId: game.id,
                            systemId: system_1.id,
                            text: bdesign.name + " built in " + system_1.name,
                            title: bdesign.name + " built in " + system_1.name,
                            turn: game.turn,
                            type: fReport_1.DetailReportType.System
                        }, firestore)];
                case 1:
                    report = _a.sent();
                    addReportToSystem(game, system_1, fReport_1.DetailReportType.System, [system_1.ownerFactionId], report.id);
                    return [2 /*return*/, updateFactionInGame(updateSystemInGame(game, system_1), faction)];
                case 2:
                    command.save = true;
                    return [2 /*return*/, updateFactionInGame(game, faction)];
                case 3: return [3 /*break*/, 5];
                case 4:
                    command.turnsLeft--;
                    if (fBuildingRules_1.buildingDysonSphere(system)) {
                        command.turnsLeft = 0;
                    }
                    // Finish building
                    if (command.turnsLeft === 0) {
                        system_2 = getSystemFromGame(game, command.targetSystem);
                        system_2.buildings.push(fBuildingUtils_1.createBuildingFromDesign(bdesign));
                        markCommandDone(command);
                        return [2 /*return*/, updateSystemInGame(game, system_2)];
                    }
                    else {
                        command.save = true;
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/, __assign({}, game)];
            }
        });
    });
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
    // Warpgate building!
    if (command.turn === game.turn) {
        var unit = getUnitFromGame(game, command.unitIds[0]);
        var startStar = fSystemUtils_1.getSystemByCoordinates(game, unit.location);
        var endStar = fSystemUtils_1.getSystemByCoordinates(game, command.target);
        if (fBuildingRules_1.buildingGateway(startStar, endStar, unit.factionId)) {
            newPoint = endStar.location;
        }
    }
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
function createNewReport(report, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var docRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, firestore.collection("Reports").add(report)];
                case 1:
                    docRef = _a.sent();
                    report.id = docRef.id;
                    return [4 /*yield*/, firestore
                            .collection("Reports")
                            .doc(report.id)
                            .set(__assign({}, report))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, report];
            }
        });
    });
}
function resolveCombat(game, origCombat, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var factionIds, combat, destroyedUnits, report, docRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (origCombat.system === null) {
                        throw new Error("Combat cannot happen outside of a system, the null is only used in testing needs to be removed");
                    }
                    factionIds = origCombat.units.reduce(function (fids, u) {
                        if (!fids.has(u.factionId)) {
                            fids.add(u.factionId);
                        }
                        return fids;
                    }, new Set());
                    combat = spaceCombatMain(game, origCombat.units, origCombat.system);
                    destroyedUnits = origCombat.units
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
                    report = convertSpaceCombatToCombatReport(game, origCombat, combat);
                    return [4 /*yield*/, firestore.collection("Reports").add(report)];
                case 1:
                    docRef = _a.sent();
                    report.id = docRef.id;
                    return [4 /*yield*/, firestore
                            .collection("Reports")
                            .doc(report.id)
                            .set(__assign({}, report))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, addReportToSystem(game, origCombat.system, fReport_1.DetailReportType.Combat, Array.from(factionIds), report.id)];
            }
        });
    });
}
function convertSpaceCombatToCombatReport(game, origCombat, combat) {
    var report = {
        id: "",
        gameId: game.id,
        systemId: origCombat.system.id,
        title: "Combat Report!",
        turn: game.turn,
        type: fReport_1.DetailReportType.Combat,
        factionIds: game.factions.map(function (fm) { return fm.id; }),
        rounds: combat.roundLog,
        units: combat.units,
        origUnits: origCombat.units
    };
    return report;
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
function addReportToSystem(game, system, type, factionIds, reportId) {
    system.reports.push({
        factions: factionIds,
        turn: game.turn,
        type: type,
        reportId: reportId
    });
    return updateSystemInGame(game, system);
}
function markCommandDone(command) {
    command.completed = true;
}
/***********************************************************************************************************
 * SPACE COMBAT
 */
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
    combat.origUnits = __spreadArrays(combat.units);
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
                var target = spaceCombatAttackChooseTarget(c, ship, weapon, game);
                if (target) {
                    var oldDmg = target.damage + target.shields;
                    var rc = spaceCombatAttackShoot(game, c, ship, weapon, target);
                    var newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg)
                        hit = true;
                    return __assign({}, rc);
                }
            }
            else {
                var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, ship.factionId);
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
    combat.done = true;
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
        weapon.cooldown--;
        return false;
    }
    // Fire!
    weapon.cooldown = weapon.cooldownTime;
    return true;
}
exports.weaponCanFire = weaponCanFire;
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
