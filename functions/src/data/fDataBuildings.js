"use strict";
exports.__esModule = true;
exports.DATABUILDINGS = exports.BUILDINGTYPE = void 0;
var fDataTechnology_1 = require("./fDataTechnology");
var BUILDINGTYPE;
(function (BUILDINGTYPE) {
    BUILDINGTYPE["UNIVERSITY"] = "University";
    BUILDINGTYPE["AUTOSTARDOCK"] = "AutoStarDock";
    BUILDINGTYPE["CMDCENTER"] = "Command Center";
    BUILDINGTYPE["REPAIRSTATION"] = "Repair Station";
    BUILDINGTYPE["ARCOLOGY"] = "Arcology";
    BUILDINGTYPE["BIODOME"] = "Biodome";
})(BUILDINGTYPE = exports.BUILDINGTYPE || (exports.BUILDINGTYPE = {}));
var DATABUILDINGS = [
    {
        name: "Bio Dome",
        type: BUILDINGTYPE.BIODOME,
        buildTime: 2,
        cost: 3,
        description: "Provides +1 to maximum welfare and economy",
        keywords: [],
        minEconomy: 1,
        minIndustry: 1,
        minWelfare: 1,
        techPreqs: [],
        maintenanceCost: 1,
        score: 1
    },
    {
        name: "University",
        type: BUILDINGTYPE.UNIVERSITY,
        buildTime: 2,
        cost: 12,
        description: "Provides +1 research point per turn",
        keywords: [],
        minEconomy: 3,
        minIndustry: 1,
        minWelfare: 2,
        techPreqs: [fDataTechnology_1.TECHIDS.HigherEdu],
        maintenanceCost: 1,
        score: 2
    },
    {
        name: "Robot Workers",
        type: BUILDINGTYPE.AUTOSTARDOCK,
        buildTime: 4,
        cost: 17,
        description: "Reduces the credit cost of ships built in this system by 25%",
        keywords: [],
        minEconomy: 1,
        minIndustry: 5,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 0,
        score: 2
    },
    {
        name: "Command Center",
        type: BUILDINGTYPE.CMDCENTER,
        buildTime: 3,
        cost: 15,
        description: "Gain 1 additional command per turn",
        keywords: [],
        minEconomy: 2,
        minIndustry: 3,
        minWelfare: 1,
        techPreqs: [],
        maintenanceCost: 1,
        score: 3
    },
    {
        name: "Repair Station",
        type: BUILDINGTYPE.REPAIRSTATION,
        buildTime: 2,
        cost: 9,
        description: "Repair damaged ship 3x faster while they are in this system",
        keywords: [],
        minEconomy: 1,
        minIndustry: 4,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 2,
        score: 3
    },
    {
        name: "Arcology",
        type: BUILDINGTYPE.ARCOLOGY,
        buildTime: 6,
        cost: 26,
        description: "Increase the maximum welfare, economy and industry by +5 on the system that contains Arcology",
        keywords: [],
        minEconomy: 3,
        minIndustry: 4,
        minWelfare: 4,
        techPreqs: [fDataTechnology_1.TECHIDS.Arcology],
        maintenanceCost: 2,
        score: 10
    }
];
exports.DATABUILDINGS = DATABUILDINGS;
