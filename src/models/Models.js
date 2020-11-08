"use strict";
exports.__esModule = true;
exports.ReportType = exports.TechnologyField = exports.FactionState = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["INIT"] = 0] = "INIT";
    GameState[GameState["OPEN"] = 1] = "OPEN";
    GameState[GameState["TURN"] = 2] = "TURN";
    GameState[GameState["PROCESSING"] = 3] = "PROCESSING";
    GameState[GameState["ENDED"] = 4] = "ENDED";
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
    TechnologyField["BUSINESS"] = "Business";
    TechnologyField["SOCIOLOGY"] = "Social";
    TechnologyField["INFORMATION"] = "Information";
})(TechnologyField = exports.TechnologyField || (exports.TechnologyField = {}));
var ReportType;
(function (ReportType) {
    ReportType["COMBAT"] = "COMBAT";
    ReportType["COMMAND"] = "COMMAND";
    ReportType["EVENT"] = "EVENT";
})(ReportType = exports.ReportType || (exports.ReportType = {}));
