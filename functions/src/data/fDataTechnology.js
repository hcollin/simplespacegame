"use strict";
exports.__esModule = true;
exports.DATATECHNOLOGY = exports.TECHIDS = void 0;
var fModels_1 = require("../models/fModels");
var TECHIDS;
(function (TECHIDS) {
    TECHIDS["IonEngines"] = "T-P-001";
    TECHIDS["WarpEngines"] = "T-P-002";
    TECHIDS["Marketing"] = "T-B-001";
    TECHIDS["TargetingComp1"] = "T-W-001";
    TECHIDS["TargetingComp2"] = "T-W-002";
    TECHIDS["TargetingComp3"] = "T-W-003";
    TECHIDS["HeavyRounds"] = "T-W-004";
    TECHIDS["EvasionEngine"] = "T-P-003";
    TECHIDS["PredEvasion"] = "T-P-004";
    TECHIDS["DeciAppr"] = "t-S-001";
    TECHIDS["HigherEdu"] = "T-S-002";
})(TECHIDS = exports.TECHIDS || (exports.TECHIDS = {}));
;
exports.DATATECHNOLOGY = [
    {
        id: TECHIDS.IonEngines,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 3],
            [fModels_1.TechnologyField.PHYSICS, 2],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units"
    },
    {
        id: TECHIDS.WarpEngines,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 5],
            [fModels_1.TechnologyField.PHYSICS, 5],
            [fModels_1.TechnologyField.INFORMATION, 2],
        ],
        techprereq: [TECHIDS.IonEngines],
        name: "Warp Engines",
        description: "Gain +3 speed to all units"
    },
    {
        id: TECHIDS.Marketing,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 4],
            [fModels_1.TechnologyField.SOCIOLOGY, 1],
        ],
        techprereq: [],
        name: "Marketing",
        description: "Gain 1 Money per 5 total economy"
    },
    {
        id: TECHIDS.EvasionEngine,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 6],
            [fModels_1.TechnologyField.INFORMATION, 2]
        ],
        techprereq: [],
        name: "Evasion Engine",
        description: "Agility each ship is 10% higher than normal"
    },
    {
        id: TECHIDS.PredEvasion,
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, 6],
            [fModels_1.TechnologyField.INFORMATION, 9]
        ],
        techprereq: [TECHIDS.EvasionEngine],
        name: "TimeSlip Prediction",
        description: "Gain +10 for each ships Agility"
    },
    {
        id: TECHIDS.TargetingComp1,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 5],
        ],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +5% for base attack accuracy"
    },
    {
        id: TECHIDS.TargetingComp2,
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, 5],
            [fModels_1.TechnologyField.INFORMATION, 5],
        ],
        techprereq: [TECHIDS.TargetingComp1],
        name: "Targeting computers II",
        description: "Gain additional +5% for base attack accuracy"
    },
    {
        id: TECHIDS.TargetingComp3,
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, 10],
            [fModels_1.TechnologyField.INFORMATION, 10],
            [fModels_1.TechnologyField.SOCIOLOGY, 5],
        ],
        techprereq: [TECHIDS.TargetingComp3],
        name: "Targeting computers III",
        description: "Gain additional +10% for base attack accuracy"
    },
    {
        id: TECHIDS.HeavyRounds,
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Heavy Rounds",
        description: "The damage output of all Kinetic Weapons is increased by +10%"
    },
    {
        id: TECHIDS.DeciAppr,
        fieldreqs: [
            [fModels_1.TechnologyField.SOCIOLOGY, 7],
            [fModels_1.TechnologyField.INFORMATION, 5],
        ],
        techprereq: [],
        name: "Decision Apparatus",
        description: "Every 7th total welfare point will produce 1 command instead of every 10th."
    },
    {
        id: TECHIDS.HigherEdu,
        fieldreqs: [
            [fModels_1.TechnologyField.SOCIOLOGY, 8],
            [fModels_1.TechnologyField.BIOLOGY, 4],
        ],
        techprereq: [],
        name: "Higher Education",
        description: "High Welfare affects research points less."
    },
];
