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
exports.createBuildingFromDesign = exports.getBuildingUnderConstruction = exports.getBuildingTime = exports.buildingCanBeBuiltOnSystem = exports.getBuildingDesignByType = void 0;
var fDataBuildings_1 = require("../data/fDataBuildings");
var fCommands_1 = require("../models/fCommands");
var fRandUtils_1 = require("./fRandUtils");
function getBuildingDesignByType(btype) {
    var bd = fDataBuildings_1.DATABUILDINGS.find(function (bd) { return bd.type === btype; });
    if (!bd) {
        throw new Error("Unknown building type " + btype + ". Cannot build.");
    }
    return bd;
}
exports.getBuildingDesignByType = getBuildingDesignByType;
function buildingCanBeBuiltOnSystem(building, star, faction) {
    if (building.minEconomy > star.economy)
        return false;
    if (building.minIndustry > star.industry)
        return false;
    if (building.minWelfare > star.welfare)
        return false;
    if (building.cost > faction.money)
        return false;
    building.techPreqs.forEach(function (req) {
        if (!faction.technology.includes(req)) {
            return false;
        }
    });
    return true;
}
exports.buildingCanBeBuiltOnSystem = buildingCanBeBuiltOnSystem;
function getBuildingTime(buildingType) {
    var bd = fDataBuildings_1.DATABUILDINGS.find(function (bd) { return bd.type === buildingType; });
    if (!bd) {
        throw new Error("Invalid building type " + buildingType);
    }
    return bd.buildTime;
}
exports.getBuildingTime = getBuildingTime;
function getBuildingUnderConstruction(commands, star, game) {
    var buildingCommand = commands.find(function (cmd) {
        if (cmd.type === fCommands_1.CommandType.SystemBuildingBuild) {
            var bCmd_1 = cmd;
            if (bCmd_1.targetSystem === star.id) {
                return true;
            }
        }
        return false;
    });
    if (!buildingCommand) {
        return null;
    }
    var bCmd = buildingCommand;
    var design = fDataBuildings_1.DATABUILDINGS.find(function (bd) { return bd.type === bCmd.buildingType; });
    if (!design) {
        return null;
    }
    return __assign(__assign({}, design), { turnsLeft: bCmd.turnsLeft, cmdId: bCmd.id, cancellable: bCmd.turn === game.turn });
}
exports.getBuildingUnderConstruction = getBuildingUnderConstruction;
function createBuildingFromDesign(bdesign) {
    return __assign(__assign({}, bdesign), { id: fRandUtils_1.rndId() });
}
exports.createBuildingFromDesign = createBuildingFromDesign;
