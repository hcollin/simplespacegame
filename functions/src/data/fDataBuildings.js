"use strict";
exports.__esModule = true;
exports.DATABUILDINGS = exports.BUILDINGTYPE = void 0;
var fDataTechnology_1 = require("./fDataTechnology");
var BUILDINGTYPE;
(function (BUILDINGTYPE) {
    BUILDINGTYPE["BIODOME"] = "Biodome";
    BUILDINGTYPE["TRADEPOST"] = "Trade Post";
    BUILDINGTYPE["INDSECTOR"] = "Industry Sector";
    BUILDINGTYPE["BUNKERS"] = "Bunkers";
    BUILDINGTYPE["COREMINE"] = "Core Mine";
    BUILDINGTYPE["GAIAPROJECT"] = "Gaia Project";
    BUILDINGTYPE["FACTAUTOM"] = "Factory Automation";
    BUILDINGTYPE["REPAIRSTATION"] = "Repair Station";
    BUILDINGTYPE["ORBCANNONS"] = "Orbital Cannons";
    BUILDINGTYPE["UNIVERSITY"] = "University";
    BUILDINGTYPE["ROBOTWORKERS"] = "Robot Workers";
    BUILDINGTYPE["CMDCENTER"] = "Command Center";
    BUILDINGTYPE["SPACEPORT"] = "Space Port";
    BUILDINGTYPE["GALEXCH"] = "Galatic Exchange";
    BUILDINGTYPE["GATEWAY"] = "Gateway";
    BUILDINGTYPE["RINGWORLD"] = "Ring World";
    BUILDINGTYPE["DYSONSP"] = "Dyson Sphere";
    BUILDINGTYPE["ARCOLOGY"] = "Arcology";
    BUILDINGTYPE["SENATE"] = "Galactic Senate";
})(BUILDINGTYPE = exports.BUILDINGTYPE || (exports.BUILDINGTYPE = {}));
;
var DATABUILDINGS = [
    {
        name: "Bio Dome",
        type: BUILDINGTYPE.BIODOME,
        buildTime: 2,
        cost: 5,
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
        name: "Trade Post",
        type: BUILDINGTYPE.TRADEPOST,
        buildTime: 3,
        cost: 5,
        description: "Gain +1 research point and +1 money per turn if the system has Natives.",
        keywords: [],
        minIndustry: 0,
        minEconomy: 1,
        minWelfare: 1,
        techPreqs: [],
        maintenanceCost: 0,
        score: 2
    },
    {
        name: "Industry Sector",
        type: BUILDINGTYPE.INDSECTOR,
        buildTime: 2,
        cost: 5,
        description: "Increase industry maximum by 1",
        keywords: [],
        minIndustry: 1,
        minEconomy: 1,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 0,
        score: 0
    }, {
        name: "Bunkers",
        type: BUILDINGTYPE.BUNKERS,
        buildTime: 4,
        cost: 10,
        description: "Provides +3 to defence value during when invaded.",
        keywords: [],
        minIndustry: 1,
        minEconomy: 0,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 2,
        score: 1
    }, {
        name: "Core Mine",
        type: BUILDINGTYPE.COREMINE,
        buildTime: 3,
        cost: 15,
        description: "Generate +3 money per turn. Can be built on Rich mineral or Rare Mineral systems.",
        keywords: [],
        minIndustry: 3,
        minEconomy: 1,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 0,
        score: 1
    }, {
        name: "Gaia Project",
        type: BUILDINGTYPE.GAIAPROJECT,
        buildTime: 4,
        cost: 20,
        description: "System provides 1 command and 3 research points per turn, can only be built on Gaia planets.",
        keywords: [],
        minIndustry: 0,
        minEconomy: 3,
        minWelfare: 3,
        techPreqs: [],
        maintenanceCost: 1,
        score: 1
    }, {
        name: "Factory Automation",
        type: BUILDINGTYPE.FACTAUTOM,
        buildTime: 3,
        cost: 15,
        description: "Increase maximum industry of this planet by 3.",
        keywords: [],
        minIndustry: 2,
        minEconomy: 2,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 2,
        score: 1
    }, {
        name: "Repair Station",
        type: BUILDINGTYPE.REPAIRSTATION,
        buildTime: 3,
        cost: 15,
        description: "Repair damaged ship 3x faster while they are in this system",
        keywords: [],
        minEconomy: 0,
        minIndustry: 2,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 2,
        score: 0
    },
    {
        name: "Orbital Cannons",
        type: BUILDINGTYPE.ORBCANNONS,
        buildTime: 3,
        cost: 15,
        description: "Each invading troop has 25% chance to be destroyed during landing",
        keywords: [],
        minIndustry: 3,
        minEconomy: 0,
        minWelfare: 0,
        techPreqs: [],
        maintenanceCost: 1,
        score: 1
    },
    {
        name: "University",
        type: BUILDINGTYPE.UNIVERSITY,
        buildTime: 3,
        cost: 20,
        description: "Provides +3 research point per turn",
        keywords: [fDataTechnology_1.TECHIDS.EfficientBur],
        minEconomy: 4,
        minIndustry: 0,
        minWelfare: 2,
        techPreqs: [fDataTechnology_1.TECHIDS.HigherEdu],
        maintenanceCost: 2,
        score: 1
    }, {
        name: "Robot Workers",
        type: BUILDINGTYPE.ROBOTWORKERS,
        buildTime: 2,
        cost: 20,
        description: "Reduces the credit cost of ships built in this system by 25%",
        keywords: [],
        minIndustry: 4,
        minEconomy: 2,
        minWelfare: 0,
        techPreqs: [fDataTechnology_1.TECHIDS.AutoRepBots1],
        maintenanceCost: 3,
        score: 1
    }, {
        name: "Command Center",
        type: BUILDINGTYPE.CMDCENTER,
        buildTime: 8,
        cost: 50,
        description: "Gain 1 additional command per turn",
        keywords: [],
        minIndustry: 3,
        minEconomy: 4,
        minWelfare: 5,
        techPreqs: [fDataTechnology_1.TECHIDS.HypTheory],
        maintenanceCost: 4,
        score: 2
    }, {
        name: "Space Port",
        type: BUILDINGTYPE.SPACEPORT,
        buildTime: 5,
        cost: 50,
        description: "Doubles the money production by economy in this system",
        keywords: [],
        minIndustry: 2,
        minEconomy: 4,
        minWelfare: 3,
        techPreqs: [],
        maintenanceCost: 0,
        score: 3
    },
    {
        name: "Galactic Exchange",
        type: BUILDINGTYPE.GALEXCH,
        buildTime: 10,
        cost: 75,
        description: "Provide +1 money per turn per colonized system in 20ly radius",
        keywords: [],
        minIndustry: 1,
        minEconomy: 5,
        minWelfare: 2,
        techPreqs: [fDataTechnology_1.TECHIDS.MerchGuilds],
        maintenanceCost: 3,
        score: 3
    },
    {
        name: "Gateway",
        type: BUILDINGTYPE.GATEWAY,
        buildTime: 10,
        cost: 80,
        description: "Reduces travel time between friendly gateways to 1 turn.",
        keywords: [],
        minIndustry: 6,
        minEconomy: 3,
        minWelfare: 1,
        techPreqs: [fDataTechnology_1.TECHIDS.HypTheory, fDataTechnology_1.TECHIDS.LevitatBuild],
        maintenanceCost: 5,
        score: 1
    },
    {
        name: "Ring World",
        type: BUILDINGTYPE.RINGWORLD,
        buildTime: 10,
        cost: 100,
        description: "System gains +3 building slots and provides +2 to economy and welfare maximums.",
        keywords: [],
        minIndustry: 5,
        minEconomy: 5,
        minWelfare: 5,
        techPreqs: [],
        maintenanceCost: 5,
        score: 5
    },
    {
        name: "Dyson Sphere",
        type: BUILDINGTYPE.DYSONSP,
        buildTime: 15,
        cost: 100,
        description: "System can build any ship or building in a single turn.",
        keywords: [],
        minIndustry: 7,
        minEconomy: 4,
        minWelfare: 0,
        techPreqs: [fDataTechnology_1.TECHIDS.DysonShpe],
        maintenanceCost: 5,
        score: 5
    },
    {
        name: "Arcology",
        type: BUILDINGTYPE.ARCOLOGY,
        buildTime: 15,
        cost: 125,
        description: "Increase the maximum welfare, economy and industry by +5 on the system that contains Arcology",
        keywords: [],
        minEconomy: 5,
        minIndustry: 5,
        minWelfare: 5,
        techPreqs: [fDataTechnology_1.TECHIDS.Arcology],
        maintenanceCost: 4,
        score: 5
    },
    {
        name: "Galactic Senate",
        type: BUILDINGTYPE.SENATE,
        buildTime: 20,
        cost: 150,
        description: "Gain +1 VP for every 30 total welfare point per turn. Limited to 1 per faction.",
        keywords: [],
        minIndustry: 6,
        minEconomy: 6,
        minWelfare: 6,
        techPreqs: [fDataTechnology_1.TECHIDS.GalacticSen],
        maintenanceCost: 10,
        score: 0
    },
];
exports.DATABUILDINGS = DATABUILDINGS;
