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
exports.__esModule = true;
var fModels_1 = require("./src/models/fModels");
var turnProcessor_1 = require("./src/turnProcessor");
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp();
var db = admin.firestore();
var Collections;
(function (Collections) {
    Collections["GAMES"] = "Games";
    Collections["COMMANDS"] = "Commands";
})(Collections || (Collections = {}));
/**
 * PLayer is ready Cloud function
 *
 * Stores the provided commands to the Commands Collection and triggers the turn processing if all players are ready.
 *
 */
exports.playerReady = functions.https.onCall(function (data, context) {
    console.log("playerReady started", data);
    function readyPlayer(gameId, factionId) {
        return __awaiter(this, void 0, void 0, function () {
            var game, gameRef, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, db.collection("Games").doc(data.gameId).get()];
                    case 2:
                        gameRef = _a.sent();
                        game = gameRef.data();
                        if (!game) {
                            console.error("No game found with id: " + gameId);
                            return [2 /*return*/];
                        }
                        if (game.factionsReady.includes(factionId)) {
                            throw new Error("Faction " + factionId + " is already set to ready!");
                        }
                        game.factionsReady.push(factionId);
                        return [4 /*yield*/, db
                                .collection("Games")
                                .doc(game.id)
                                .set(__assign({}, game))];
                    case 3:
                        _a.sent();
                        if (!(game.factionsReady.length === game.factions.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, runTurnProcessor(game.id)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error("Could not load the game", gameId, e_1);
                        return [2 /*return*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    return readyPlayer(data.gameId, data.factionId);
});
exports.playerCancelReady = functions.https.onCall(function (data, context) {
    // console.log("playerCancelReady started", data);
    function cancelPlayerReady(gameId, factionId) {
        return __awaiter(this, void 0, void 0, function () {
            var game, gameRef, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, db.collection("Games").doc(data.gameId).get()];
                    case 2:
                        gameRef = _a.sent();
                        game = gameRef.data();
                        if (!game) {
                            console.error("No game found with id: " + gameId);
                            return [2 /*return*/];
                        }
                        game.factionsReady = game.factionsReady.filter(function (fid) { return fid !== factionId; });
                        return [4 /*yield*/, db
                                .collection("Games")
                                .doc(game.id)
                                .set(__assign({}, game))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.error("Could not load the game", gameId, e_2);
                        return [2 /*return*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return cancelPlayerReady(data.gameId, data.factionId);
});
/**
 * Run the turn processor by force for provided gameId
 */
exports.processTurn = functions.https.onCall(function (data, context) {
    return runTurnProcessor(data.gameId);
});
function runTurnProcessor(gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var game, commands, gameRef, cmdsSnap, e_3, turnCommands, _a, newGame, comms, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    game = null;
                    commands = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, db.collection("Games").doc(gameId).get()];
                case 2:
                    gameRef = _b.sent();
                    game = gameRef.data();
                    return [4 /*yield*/, db.collection("Commands").where("gameId", "==", gameId).get()];
                case 3:
                    cmdsSnap = _b.sent();
                    cmdsSnap.forEach(function (item) {
                        var cmd = item.data();
                        commands.push(cmd);
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _b.sent();
                    console.error("Could not load the game", gameId, e_3);
                    return [2 /*return*/];
                case 5:
                    if (game === null || !game) {
                        return [2 /*return*/];
                    }
                    // Make sure all players are ready
                    if (game.factionsReady.length !== game.factions.length) {
                        console.warn("Not all player ready: ", gameId);
                        return [2 /*return*/];
                    }
                    game.state = fModels_1.GameState.PROCESSING;
                    return [4 /*yield*/, db
                            .collection("Games")
                            .doc(game.id)
                            .set(__assign({}, game))];
                case 6:
                    _b.sent();
                    turnCommands = commands.filter(function (cmd) {
                        if (!game)
                            return false;
                        if (cmd.completed)
                            return false;
                        if (cmd.turn <= game.turn)
                            return true;
                    });
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, turnProcessor_1.processTurn(game, turnCommands, db)];
                case 8:
                    _a = _b.sent(), newGame = _a[0], comms = _a[1];
                    // console.log("new turn: ", newGame.turn, GameState[newGame.state]);
                    // console.log("commands done now", comms);
                    comms.forEach(function (cmd) {
                        if (cmd.completed || cmd.save === true) {
                            db.collection("Commands")
                                .doc(cmd.id)
                                .set(__assign({}, cmd));
                        }
                        if (cmd["delete"] === true) {
                            console.log("Delete command", cmd);
                            db.collection("Commands")
                                .doc(cmd.id)["delete"]();
                        }
                    });
                    return [4 /*yield*/, db
                            .collection("Games")
                            .doc(newGame.id)
                            .set(__assign({}, newGame))];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_4 = _b.sent();
                    console.error("FAILED TO PROCESS THE TURN", e_4);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
