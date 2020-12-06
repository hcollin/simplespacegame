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
exports.processTurn = void 0;
var axios_1 = require("axios");
var fBuildingRules_1 = require("./buildings/fBuildingRules");
var combatResolver_1 = require("./combatResolver");
var fDataBuildings_1 = require("./data/fDataBuildings");
var fDataTechnology_1 = require("./data/fDataTechnology");
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
function processTurn(origGame, commands, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var game, discordRequestConfig, axlog, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = __assign({}, origGame);
                    game.systems = game.systems.map(function (sm) {
                        sm.reports = [];
                        return sm;
                    });
                    console.log("START TURN PROCESSING!", game.name, game.turn);
                    if (!commands) return [3 /*break*/, 2];
                    game = processScrapCommands(commands, game);
                    return [4 /*yield*/, processSystemCommands(commands, game, firestore)];
                case 1:
                    game = _a.sent();
                    game = processMovementCommands(commands, game);
                    // Process trades
                    game = processTrades(game);
                    game = processResearchCommands(commands, game);
                    _a.label = 2;
                case 2: return [4 /*yield*/, processCombats(game, firestore)];
                case 3:
                    game = _a.sent();
                    if (!commands) return [3 /*break*/, 5];
                    return [4 /*yield*/, processBombardmentCommands(game, commands)];
                case 4:
                    game = _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, processInvasion(game, firestore)];
                case 6:
                    game = _a.sent();
                    // Process economy
                    game = processEconomy(game);
                    // Process Repairs
                    game = processRepairs(game);
                    // Process Research
                    game = processResearch(game);
                    // Win Conditions
                    game = processWinConditions(game);
                    return [4 /*yield*/, processValidateRemainingCommands(game, commands)];
                case 7:
                    game = _a.sent();
                    // Make sure building commands are still valid
                    // Turn final processing
                    game = processStartNewTurn(game);
                    // Clear ready states
                    // // Clear Commands
                    // api.api.trigger({
                    //     from: serviceId,
                    //     action: "nextTurn",
                    // });
                    game.state = fModels_1.GameState.TURN;
                    if (!(game.settings.discordWebHookUrl !== null)) return [3 /*break*/, 11];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    discordRequestConfig = {
                        url: game.settings.discordWebHookUrl,
                        method: "post",
                        headers: {
                            "Content-type": "application/json"
                        },
                        data: {
                            content: "Game " + game.name + " turn " + game.turn
                        }
                    };
                    return [4 /*yield*/, axios_1["default"](discordRequestConfig)];
                case 9:
                    axlog = _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_1 = _a.sent();
                    console.error(game.name + ":" + game.id + ":Error while sending notification to discord", game.settings);
                    console.log(e_1);
                    return [3 /*break*/, 11];
                case 11: 
                // await saveGame();
                // sendUpdate();
                return [2 /*return*/, [__assign({}, game), __spreadArrays((commands || []))]];
            }
        });
    });
}
exports.processTurn = processTurn;
/**
 * Check if any player has won
 *
 * @param game
 */
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
function processValidateRemainingCommands(oldGame, commands) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            game = __assign({}, oldGame);
            commands.forEach(function (cmd) {
                if (cmd.type === fCommands_1.CommandType.SystemBuildUnit) {
                    var bcmd = cmd;
                    var system = fSystemUtils_1.getSystemFromArrayById(game.systems, bcmd.targetSystem);
                    if (system && system.ownerFactionId !== bcmd.factionId) {
                        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, cmd.factionId);
                        var shipDesign = fUnitUtils_1.getDesignByName(bcmd.shipName);
                        faction.money += shipDesign.cost;
                        game = updateFactionInGame(game, faction);
                        cmd["delete"] = true;
                        game = addReportToSystem(game, system, fReport_1.DetailReportType.Generic, [bcmd.factionId], "", "Building " + shipDesign.name + " cancelled in " + system.name);
                    }
                }
                if (cmd.type === fCommands_1.CommandType.SystemBuildingBuild) {
                    var bcmd = cmd;
                    var system = fSystemUtils_1.getSystemFromArrayById(game.systems, bcmd.targetSystem);
                    if (system.ownerFactionId !== bcmd.factionId) {
                        var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, cmd.factionId);
                        var building = fBuildingUtils_1.getBuildingDesignByType(bcmd.buildingType);
                        faction.money += building.cost;
                        game = updateFactionInGame(game, faction);
                        cmd["delete"] = true;
                        game = addReportToSystem(game, system, fReport_1.DetailReportType.Generic, [bcmd.factionId], "", "Building " + building.name + " cancelled in " + system.name);
                    }
                }
            });
            return [2 /*return*/, game];
        });
    });
}
/**
 * Clean after processing and prepareing for the next turn
 *
 * @param game
 */
function processStartNewTurn(game) {
    var nGame = __assign({}, game);
    nGame.factions = nGame.factions.map(function (f) {
        var newAps = fFactionUtils_1.getActionPointGeneration(nGame, f.id);
        f.aps += newAps;
        return f;
    });
    nGame.factionsReady = [];
    nGame.turn++;
    return nGame;
}
/**
 * Process Fleet movement commands
 *
 * @param commands
 * @param oldGame
 */
function processMovementCommands(commands, oldGame) {
    var game = __assign({}, oldGame);
    commands.forEach(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.FleetMove) {
            game = processFleetMoveCommand(cmd, game);
        }
    });
    return game;
}
/**
 * Scrap units from the game either by disbanding or by recycling
 *
 * @param commands
 * @param oldGame
 */
function processScrapCommands(commands, oldGame) {
    var game = __assign({}, oldGame);
    commands.forEach(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.UnitScrap) {
            var scrapCmd_1 = cmd;
            var moneyToFactions_1 = new Map();
            game.units = game.units.filter(function (unit) {
                if (unit.id === scrapCmd_1.unitId) {
                    if (scrapCmd_1.recycle) {
                        fGeneralUtils_1.mapAdd(moneyToFactions_1, unit.factionId, fUnitUtils_1.getRecycleProfit(unit));
                    }
                    return false;
                }
                return true;
            });
            game.factions = game.factions.map(function (f) {
                var mon = moneyToFactions_1.get(f.id);
                if (mon) {
                    f.money += mon;
                    return __assign({}, f);
                }
                return f;
            });
        }
    });
    return game;
}
/**
 * Process Research Point generation for each faction
 *
 * @param oldGame
 */
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
/**
 * Process active trades
 *
 * @param oldGame
 */
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
/**
 * Handle Research commands that actually gives new tech for factions
 *
 * @param commands
 * @param oldGame
 */
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
                    game = updateFactionInGame(payActionPointCost(game, command_1), faction);
                    markCommandDone(cmd);
                }
            }
        }
    });
    return game;
}
/**
 * Process all command given for a system like improving infrastructure and building units and buildings
 *
 * @param commands
 * @param oldGame
 * @param firestore
 */
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
function processBombardmentCommands(oldGame, commands) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            game = __assign({}, oldGame);
            commands.forEach(function (cmd) {
                if (cmd.type === fCommands_1.CommandType.FleetBombard) {
                    var bcmd_1 = cmd;
                    var targetSystem = getSystemFromGame(game, bcmd_1.targetSystem);
                    if (targetSystem.ownerFactionId !== cmd.factionId) {
                        var fleet = game.units.filter(function (u) {
                            return bcmd_1.unitIds.includes(u.id);
                        });
                        var bomb = fUnitUtils_1.fleetBombardmentCalculator(game, fleet, targetSystem);
                        var successfulBombardments = 0;
                        for (var b = 0; b < bomb[1]; b++) {
                            if (fRandUtils_1.roll(bomb[0])) {
                                successfulBombardments++;
                            }
                        }
                        console.log("BOMBARDMENT", bomb, successfulBombardments);
                        targetSystem.defense -= successfulBombardments;
                        if (targetSystem.defense < 0)
                            targetSystem.defense = 0;
                        game = updateSystemInGame(game, targetSystem);
                        game = addReportToSystem(game, targetSystem, fReport_1.DetailReportType.Generic, [targetSystem.ownerFactionId, fleet[0].factionId], "", targetSystem.name + " was bombarded resulting " + successfulBombardments + " defence points of damage");
                    }
                    markCommandDone(cmd);
                }
            });
            return [2 /*return*/, game];
        });
    });
}
/**
 * Process Ground combat
 *
 * @param oldGame
 * @param firestore
 */
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
                                                            game = addReportToSystem(game, sm, fReport_1.DetailReportType.System, [sm.ownerFactionId], report.id, "Invasion in " + sm.name + " by " + attackingFaction.name);
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
    return updateSystemInGame(payActionPointCost(game, command), system);
}
function processSystemWelfareCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.welfare++;
    markCommandDone(command);
    return updateSystemInGame(payActionPointCost(game, command), system);
}
function processSystemIndustryCommand(command, game) {
    var system = getSystemFromGame(game, command.targetSystem);
    system.industry++;
    markCommandDone(command);
    return updateSystemInGame(payActionPointCost(game, command), system);
}
function processSystemBuildUnitCommand(command, oldGame) {
    var game = __assign({}, oldGame);
    var faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command.factionId);
    if (faction) {
        var shipDesign = fUnitUtils_1.getDesignByName(command.shipName);
        var system = getSystemFromGame(game, command.targetSystem);
        if (command.turn === game.turn) {
            var cost = shipDesign.cost * fBuildingRules_1.buildingRobotWorkers(system);
            if (faction.money >= cost) {
                faction.money = faction.money - cost;
                game = payActionPointCost(game, command);
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
function processSystemBuildBuildingCommand(command, oldGame, firestore) {
    return __awaiter(this, void 0, void 0, function () {
        var game, faction, bdesign, system, cost, system_1, report, system_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = __assign({}, oldGame);
                    faction = fFactionUtils_1.getFactionFromArrayById(game.factions, command.factionId);
                    if (!faction) return [3 /*break*/, 5];
                    bdesign = fBuildingUtils_1.getBuildingDesignByType(command.buildingType);
                    system = getSystemFromGame(game, command.targetSystem);
                    if (!(command.turn === game.turn)) return [3 /*break*/, 4];
                    cost = bdesign.cost * fBuildingRules_1.buildingRobotWorkers(system);
                    if (!(faction.money >= cost)) return [3 /*break*/, 3];
                    faction.money = faction.money - cost;
                    game = payActionPointCost(game, command);
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
                    addReportToSystem(game, system_1, fReport_1.DetailReportType.System, [system_1.ownerFactionId], report.id, bdesign.name + " built in " + system_1.name);
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
    return updateSystemInGame(payActionPointCost(game, command), system);
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
    if (command.turn === nGame.turn) {
        nGame = payActionPointCost(nGame, command);
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
                    combat = combatResolver_1.spaceCombatMain(game, origCombat.units, origCombat.system);
                    console.log("COMBAT UNITS AFTER CONFLICT:", combat.units.length, combat.origUnits.length);
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
                    return [2 /*return*/, addReportToSystem(game, origCombat.system, fReport_1.DetailReportType.Combat, Array.from(factionIds), report.id, "Space Combat in " + origCombat.system.name)];
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
        origUnits: __spreadArrays(origCombat.units, combat.origUnits.filter(function (s) { return s.type === fUnits_1.SHIPCLASS.FIGHTER; }))
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
function addReportToSystem(game, system, type, factionIds, reportId, title) {
    system.reports.push({
        factions: factionIds,
        turn: game.turn,
        type: type,
        title: title,
        reportId: reportId
    });
    return updateSystemInGame(game, system);
}
function markCommandDone(command) {
    command.completed = true;
}
function payActionPointCost(oldGame, command) {
    var game = __assign({}, oldGame);
    game.factions = game.factions.map(function (f) {
        if (f.id === command.factionId) {
            f.aps -= command.actionPoints;
            return __assign({}, f);
        }
        return f;
    });
    return game;
}
