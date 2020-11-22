"use strict";
exports.__esModule = true;
exports.DATATECHNOLOGY = exports.TECHIDS = void 0;
var fModels_1 = require("../models/fModels");
var TECHIDS;
(function (TECHIDS) {
    TECHIDS["IonEngines"] = "T-0001";
    TECHIDS["WarpEngines"] = "T-0002";
    TECHIDS["ManouveringJets1"] = "T-0003";
    TECHIDS["ManouveringJets2"] = "T-0004";
    TECHIDS["ManouveringJets3"] = "T-0005";
    TECHIDS["TargetingComp1"] = "T-0006";
    TECHIDS["TargetingComp2"] = "T-0007";
    TECHIDS["TargetingComp3"] = "T-0008";
    TECHIDS["HeavyRounds1"] = "T-0009";
    TECHIDS["HeavyRounds2"] = "T-0010";
    TECHIDS["HeavyRounds3"] = "T-0011";
    TECHIDS["FocusBeam1"] = "T-0012";
    TECHIDS["FocusBeam2"] = "T-0013";
    TECHIDS["FocusBeam3"] = "T-0014";
    TECHIDS["PowerShields"] = "T-0015";
    TECHIDS["AutoRepBots1"] = "T-0016";
    TECHIDS["AutoRepBots2"] = "T-0017";
    TECHIDS["Marketing"] = "T-0018";
    TECHIDS["InitEcoBoost"] = "T-0019";
    TECHIDS["MerchGuilds"] = "T-0020";
    TECHIDS["MineralPros"] = "T-0021";
    TECHIDS["AlterPros"] = "T-0022";
    TECHIDS["AutoDef1"] = "T-0023";
    TECHIDS["AutoDef2"] = "T-0024";
    TECHIDS["AutoDef3"] = "T-0025";
    TECHIDS["DriodDef"] = "T-0026";
    TECHIDS["SpaceMarine1"] = "T-0027";
    TECHIDS["SpaceMarine2"] = "T-0028";
    TECHIDS["TermiTroops"] = "T-0029";
    TECHIDS["HigherEdu"] = "T-0030";
    TECHIDS["DeciAppr"] = "T-0031";
    TECHIDS["GalacticSen"] = "T-0032";
    TECHIDS["Adaptability"] = "T-0033";
    TECHIDS["EfficientBur"] = "T-0034";
    TECHIDS["SpaceDock"] = "T-0035";
    TECHIDS["Ugconstruc"] = "T-0036";
    TECHIDS["LevitatBuild"] = "T-0037";
    TECHIDS["Expansionist"] = "T-0038";
    TECHIDS["Capitalist"] = "T-0039";
    TECHIDS["Scientist"] = "T-0040";
    TECHIDS["Arcology"] = "T-0041";
    TECHIDS["DysonShpe"] = "T-0042";
    TECHIDS["AdvRobotics"] = "T-B01";
    TECHIDS["HypTheory"] = "T-B02";
    TECHIDS["GeneEngine"] = "T-B03";
    TECHIDS["AntimatterCon"] = "T-B04";
})(TECHIDS = exports.TECHIDS || (exports.TECHIDS = {}));
exports.DATATECHNOLOGY = [
    {
        id: TECHIDS.AdvRobotics,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 80],
            [fModels_1.TechnologyField.INFORMATION, 80],
        ],
        techprereq: [],
        name: "Advanced Robotics",
        description: "Worth 5 Victory points"
    },
    {
        id: TECHIDS.HypTheory,
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, 160],
        ],
        techprereq: [],
        name: "Hyper Space Theory",
        description: "Worth 5 Victory points"
    },
    {
        id: TECHIDS.GeneEngine,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 160],
        ],
        techprereq: [],
        name: "Genetic Engineering",
        description: "Worth 5 Victory points"
    },
    {
        id: TECHIDS.AntimatterCon,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
        ],
        techprereq: [],
        name: "Antimatter Construction",
        description: "Worth 5 Victory points"
    },
    {
        id: TECHIDS.IonEngines,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 5],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units"
    },
    {
        id: TECHIDS.WarpEngines,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.IonEngines, TECHIDS.HypTheory],
        name: "Warp Engines",
        description: "Gain +3 speed to all units"
    },
    {
        id: TECHIDS.ManouveringJets1,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 10],
            [fModels_1.TechnologyField.PHYSICS, 5],
        ],
        techprereq: [],
        name: "Manouvering Jets 1",
        description: "The agility of each ship is increased by 5%"
    },
    {
        id: TECHIDS.ManouveringJets2,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 40],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.ManouveringJets1],
        name: "Manouvering Jets 2",
        description: "The agility of each ship is increased by 15%"
    },
    {
        id: TECHIDS.ManouveringJets3,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.ManouveringJets2, TECHIDS.HypTheory],
        name: "Manouvering Jets 3",
        description: "The agility of each ship is increased by 25%"
    },
    {
        id: TECHIDS.TargetingComp1,
        fieldreqs: [[fModels_1.TechnologyField.INFORMATION, 20]],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +5 for base attack accuracy"
    },
    {
        id: TECHIDS.TargetingComp2,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 80],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.TargetingComp1],
        name: "Targeting computers II",
        description: "Gain additional 5 for base attack accuracy"
    },
    {
        id: TECHIDS.TargetingComp3,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 160],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.TargetingComp2, TECHIDS.AdvRobotics],
        name: "Targeting computers III",
        description: "Gain additional +10 for base attack accuracy"
    },
    {
        id: TECHIDS.HeavyRounds1,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Heavy Rounds",
        description: "The damage output of all Kinetic Weapons is increased by 5%"
    },
    {
        id: TECHIDS.HeavyRounds2,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 40],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.HeavyRounds1],
        name: "Heavy Rounds II",
        description: "The damage output of all Kinetic Weapons is increased by 10% more"
    },
    {
        id: TECHIDS.HeavyRounds3,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.HeavyRounds2, TECHIDS.AntimatterCon],
        name: "Heavy Rounds III",
        description: "The damage output of all Kinetic Weapons is increased by 10% more"
    },
    {
        id: TECHIDS.FocusBeam1,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 5],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [],
        name: "Focus Beam",
        description: "The damage output of Energy weapons is increased by 5%"
    },
    {
        id: TECHIDS.FocusBeam2,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 5],
            [fModels_1.TechnologyField.INFORMATION, 10],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.FocusBeam1],
        name: "Focus Beam",
        description: "The damage output of Energy weapons is increased by 10% more"
    },
    {
        id: TECHIDS.FocusBeam3,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 5],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
            [fModels_1.TechnologyField.PHYSICS, 160],
        ],
        techprereq: [TECHIDS.FocusBeam2, TECHIDS.HypTheory],
        name: "Focus Beam",
        description: "The damage output of Energy weapons is increased by 10% more"
    },
    {
        id: TECHIDS.PowerShields,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory],
        name: "Power Shields",
        description: "Shield regeneration increased by 25%"
    },
    {
        id: TECHIDS.AutoRepBots1,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 20],
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Auto Repair Bots",
        description: "Ship will automatically repair their damage by 10% of their hull value each turn."
    },
    {
        id: TECHIDS.AutoRepBots2,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.AutoRepBots1, TECHIDS.AdvRobotics],
        name: "Auto Repair Bots II",
        description: "Ships repair 3 points worth of damage at the end of each combat round"
    },
    {
        id: TECHIDS.Marketing,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 160],
            [fModels_1.TechnologyField.INFORMATION, 20],
        ],
        techprereq: [],
        name: "Hyper Space Marketing",
        description: "Gain 1 Money per 5 total economy"
    },
    {
        id: TECHIDS.InitEcoBoost,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 20],
        ],
        techprereq: [],
        name: "Initial Economy Boost",
        description: "Each planet will automatically generate +1 money each turn"
    },
    {
        id: TECHIDS.MerchGuilds,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.BUSINESS, 20],
            [fModels_1.TechnologyField.INFORMATION, 10],
        ],
        techprereq: [],
        name: "Merchant Guilds",
        description: "Each trade aggreement will gain you +2 money per turn, even if you are the one paying."
    },
    {
        id: TECHIDS.MineralPros,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Mineral Processing",
        description: "Maximum industry in Mineral Rich and Rare mineral planets is increased by 1"
    },
    {
        id: TECHIDS.AlterPros,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Alternative Processing",
        description: "Minerally poor planets gain +1 industry maximum and +1 welfare maximum"
    },
    {
        id: TECHIDS.AutoDef1,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Automated Defences",
        description: "Each system gains +1 defense during invasion"
    },
    {
        id: TECHIDS.AutoDef2,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 10],
            [fModels_1.TechnologyField.MATERIAL, 20],
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [TECHIDS.AutoDef1],
        name: "Automated Defences II",
        description: "Each system gains +3 defense during invasion"
    },
    {
        id: TECHIDS.AutoDef3,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.MATERIAL, 20],
            [fModels_1.TechnologyField.INFORMATION, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [TECHIDS.AutoDef2, TECHIDS.AdvRobotics],
        name: "Automated Defences III",
        description: "Each system gains +5 defense during invasion"
    },
    {
        id: TECHIDS.DriodDef,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.INFORMATION, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 40],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.AutoRepBots1, TECHIDS.AutoDef1],
        name: "Driod Defences",
        description: "Each defence point is worth 2 points when defending against invasions."
    },
    {
        id: TECHIDS.SpaceMarine1,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 1 per ship."
    },
    {
        id: TECHIDS.SpaceMarine2,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [TECHIDS.SpaceMarine1, TECHIDS.GeneEngine],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 3 per ship."
    },
    {
        id: TECHIDS.TermiTroops,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 160],
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.PHYSICS, 5],
        ],
        techprereq: [TECHIDS.GeneEngine, TECHIDS.AdvRobotics],
        name: "Terminator Troops",
        description: "The strength value of invading troops is multiplied by 1.5"
    },
    {
        id: TECHIDS.HigherEdu,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 20],
            [fModels_1.TechnologyField.BIOLOGY, 20],
        ],
        techprereq: [],
        name: "Higher Education",
        description: "High Welfare affects research points less."
    },
    {
        id: TECHIDS.DeciAppr,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.BUSINESS, 80],
            [fModels_1.TechnologyField.INFORMATION, 80],
        ],
        techprereq: [],
        name: "Decision Apparatus",
        description: "Every 7th total welfare point will produce 1 command instead of every 10th."
    },
    {
        id: TECHIDS.GalacticSen,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 40],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AntimatterCon],
        name: "Galactic Senate",
        description: "Welfare maximum is increased on each system by 1."
    },
    {
        id: TECHIDS.Adaptability,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.MATERIAL, 10],
        ],
        techprereq: [TECHIDS.GeneEngine],
        name: "Adaptability",
        description: "Maximum welfare of hostile systems is increased to 3."
    },
    {
        id: TECHIDS.EfficientBur,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 40],
        ],
        techprereq: [TECHIDS.AdvRobotics],
        name: "Efficient Bureaucracy",
        description: "Cost of walfare on each system is decreased by 1 to a minimum of 1."
    },
    {
        id: TECHIDS.SpaceDock,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Space Dock",
        description: "Systems with industry level 5 or higher can build two ships at the same time"
    },
    {
        id: TECHIDS.Ugconstruc,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Underground Construction",
        description: "Each system gains +1 building slot"
    },
    {
        id: TECHIDS.LevitatBuild,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.Ugconstruc, TECHIDS.HypTheory],
        name: "Levitation Buildings",
        description: "Each system gains +1 building slot"
    },
    {
        id: TECHIDS.Expansionist,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 160],
            [fModels_1.TechnologyField.BUSINESS, 160],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.GeneEngine],
        name: "Agenda: Expansionism",
        description: "Gain 1 command per 7 systems you control per turn."
    },
    {
        id: TECHIDS.Capitalist,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 320],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.HypTheory],
        name: "Agenda: Capitalism",
        description: "Gain 5 money per turn per 7 systems you control per turn."
    },
    {
        id: TECHIDS.Scientist,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 80],
            [fModels_1.TechnologyField.BUSINESS, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AntimatterCon],
        name: "Agenda: Science",
        description: "Gain 3 research points per 7 systems you control per turn."
    },
    {
        id: TECHIDS.Arcology,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 40],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.AntimatterCon],
        name: "Arcologies",
        description: "Allows you to build Arcologies."
    },
    {
        id: TECHIDS.DysonShpe,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AdvRobotics],
        name: "Dyson Spheres",
        description: "Allows you to build Dyson Sphere."
    },
];
