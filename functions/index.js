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
var functions = require('firebase-functions');
var admin = require('firebase-admin');
// MODELS
var Models_1 = require("../src/models/Models");
var turnProcessor_1 = require("./processes/turnProcessor");
admin.initializeApp();
var db = admin.firestore();
/**
 * PLayer is ready Cloud function
 *
 * Stores the provided commands to the Commands Collection and triggers the turn processing if all players are ready.
 *
 */
exports.playerReady = functions.https.onCall(function (data, context) {
    console.log("playerReady started", data);
    function readyPlayer(gameId, factionId, commands) {
        return __awaiter(this, void 0, void 0, function () {
            var game, gameRef, i, cmd, docRef, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
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
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < commands.length)) return [3 /*break*/, 6];
                        cmd = commands[i];
                        cmd.turn = game.turn;
                        cmd.factionId = factionId;
                        return [4 /*yield*/, db.collection("Commands").add(cmd)];
                    case 4:
                        docRef = _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        game.factionsReady.push(factionId);
                        return [4 /*yield*/, db.collection("Games").doc(game.id).set(__assign({}, game))];
                    case 7:
                        _a.sent();
                        if (!(game.factionsReady.length === game.factions.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, runTurnProcessor(game.id)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_1 = _a.sent();
                        console.error("Could not load the game", gameId, e_1);
                        return [2 /*return*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    return readyPlayer(data.gameId, data.factionId, data.commands);
});
/**
 * Run the turn processor by force for provided gameId
 */
exports.processTurn = functions.https.onCall(function (data, context) {
    return runTurnProcessor(data.gameId);
});
function runTurnProcessor(gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var game, commands, gameRef, cmdsSnap, e_2, turnCommands, newGame, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = null;
                    commands = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, db.collection("Games").doc(gameId).get()];
                case 2:
                    gameRef = _a.sent();
                    game = gameRef.data();
                    return [4 /*yield*/, db.collection("Commands").where("gameId", "==", gameId).get()];
                case 3:
                    cmdsSnap = _a.sent();
                    cmdsSnap.forEach(function (item) {
                        var cmd = item.data();
                        commands.push(cmd);
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error("Could not load the game", gameId, e_2);
                    return [2 /*return*/];
                case 5:
                    if (game === null) {
                        return [2 /*return*/];
                    }
                    // Make sure all players are ready
                    // if (game.factionsReady.length !== game.factions.length) {
                    //     console.warn("Not all player ready: ", gameId);
                    //     return;
                    // }
                    console.log("Turn to process", game.turn);
                    game.state = Models_1.GameState.PROCESSING;
                    return [4 /*yield*/, db.collection("Games").doc(game.id).set(__assign({}, game))];
                case 6:
                    _a.sent();
                    turnCommands = commands.filter(function (cmd) { return cmd.turn === game.turn; });
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, turnProcessor_1.processTurn(game, commands)];
                case 8:
                    newGame = _a.sent();
                    console.log("new turn: ", newGame.turn, Models_1.GameState[newGame.state]);
                    newGame.state = Models_1.GameState.TURN;
                    return [4 /*yield*/, db.collection("Games").doc(newGame.id).set(newGame)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_3 = _a.sent();
                    console.error("FAILED TO PROCESS THE TURN", e_3);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
