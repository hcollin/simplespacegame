"use strict";
exports.__esModule = true;
exports.TechnologyField = exports.FactionState = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["NONE"] = 0] = "NONE";
    GameState[GameState["INIT"] = 1] = "INIT";
    GameState[GameState["OPEN"] = 2] = "OPEN";
    GameState[GameState["TURN"] = 3] = "TURN";
    GameState[GameState["BUSY"] = 4] = "BUSY";
    GameState[GameState["PROCESSING"] = 5] = "PROCESSING";
    GameState[GameState["CLEANUP"] = 6] = "CLEANUP";
    GameState[GameState["ENDED"] = 7] = "ENDED";
})(GameState = exports.GameState || (exports.GameState = {}));
var FactionState;
(function (FactionState) {
    FactionState[FactionState["INIT"] = 0] = "INIT";
    FactionState[FactionState["PLAYING"] = 1] = "PLAYING";
    FactionState[FactionState["DONE"] = 2] = "DONE";
    FactionState[FactionState["WON"] = 3] = "WON";
    FactionState[FactionState["LOST"] = 4] = "LOST";
})(FactionState = exports.FactionState || (exports.FactionState = {}));
var TechnologyField;
(function (TechnologyField) {
    TechnologyField["CHEMISTRY"] = "Chemistry";
    TechnologyField["PHYSICS"] = "Physics";
    TechnologyField["BIOLOGY"] = "Biology";
    TechnologyField["BUSINESS"] = "Economy";
    TechnologyField["MATERIAL"] = "Material";
    TechnologyField["INFORMATION"] = "Information";
})(TechnologyField = exports.TechnologyField || (exports.TechnologyField = {}));
