"use strict";
exports.__esModule = true;
var GameState;
(function (GameState) {
    GameState[GameState["NONE"] = 0] = "NONE";
    GameState[GameState["INIT"] = 1] = "INIT";
    GameState[GameState["OPEN"] = 2] = "OPEN";
    GameState[GameState["TURN"] = 3] = "TURN";
    GameState[GameState["PROCESSING"] = 4] = "PROCESSING";
    GameState[GameState["CLEANUP"] = 5] = "CLEANUP";
    GameState[GameState["ENDED"] = 6] = "ENDED";
})(GameState = exports.GameState || (exports.GameState = {}));
var SystemKeyword;
(function (SystemKeyword) {
    SystemKeyword["HOMEWORLD"] = "Homeworld";
    SystemKeyword["MINERALRICH"] = "Mineral Rich";
    SystemKeyword["MINERALPOOR"] = "Mineral Poor";
    SystemKeyword["MINERALRARE"] = "Rare Minerals";
    SystemKeyword["HOSTILE"] = "Hostile Environment";
    SystemKeyword["GAIA"] = "Gaia world";
    SystemKeyword["NATIVES"] = "Natives";
    SystemKeyword["ARTIFACTS"] = "Alien Artifacts";
})(SystemKeyword = exports.SystemKeyword || (exports.SystemKeyword = {}));
;
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
