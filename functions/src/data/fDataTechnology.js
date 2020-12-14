"use strict";
exports.__esModule = true;
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
    // New tech
    TECHIDS["SuperConductor"] = "Superconductor";
    TECHIDS["LimitedAI"] = "Limited Ai";
    TECHIDS["AGI"] = "Artificial General Intelligence";
    TECHIDS["AutomatedExploration"] = "Automated Exploration";
    TECHIDS["Cybernetics"] = "Cybernetics";
    TECHIDS["Androids"] = "Androids";
    TECHIDS["CyberImmor"] = "Cyber immortality";
    TECHIDS["DimensionalTheo"] = "Dimensional Theory";
    TECHIDS["WarpGates"] = "Warp Gates";
    TECHIDS["Teleportation"] = "Teleportation";
    TECHIDS["AdvancedMat"] = "Advanced Materials";
    TECHIDS["NanoMachines"] = "Nano Machines";
    TECHIDS["SelfReplication"] = "Self Replication";
    TECHIDS["BioNanoMach"] = "Biological Nano Machines";
    TECHIDS["EcoPurification"] = "Eco purification";
    TECHIDS["Terraforming"] = "Terraforming";
    TECHIDS["GaiaInit"] = "Gaia Initiative";
    TECHIDS["DeepSpaceMing"] = "Deep Space Mining";
    TECHIDS["MacroConstruction"] = "Macro construction";
    TECHIDS["ArtifialPlanet"] = "Artificial Planetoids";
    TECHIDS["FusionPower"] = "Fusion Power";
    TECHIDS["Shields"] = "Shields";
    TECHIDS["PersonalShields"] = "Personal Shields";
    TECHIDS["DysonSphere"] = "Dyson Sphere";
    TECHIDS["AntiMatter"] = "Antimatter";
    TECHIDS["AntimatterDrives"] = "Antimatter Drives";
    TECHIDS["DarkMatterTheo"] = "Dark matter theory";
    TECHIDS["FusionCell"] = "Fusion Cell";
    TECHIDS["Antigravity"] = "Antigravity";
    TECHIDS["HyperDimComm"] = "Hyperdimensional communications";
    TECHIDS["Xenobiology"] = "Xenobiology";
    TECHIDS["GeneManipulation"] = "Gene Manipulation";
    TECHIDS["Uplifting"] = "Upligting";
    TECHIDS["RapidEvolution"] = "Rapid Evolution";
    TECHIDS["PsychicManif"] = "Psychic Manifestation";
    TECHIDS["HiveMind"] = "Hive Mind";
    TECHIDS["Enlightenment"] = "Englightenment";
    TECHIDS["BioConstruction"] = "Bio Construction";
    TECHIDS["LivingMetal"] = "Living Metal";
    TECHIDS["Biocomputer"] = "Biocomputer";
    TECHIDS["root"] = "ROOT";
})(TECHIDS = exports.TECHIDS || (exports.TECHIDS = {}));
var baseCost = 5;
var costLevels = [1, 4, 7];
exports.DATATECHNOLOGY = [
    // {
    //     id: TECHIDS.root,
    //     name: "ROOT",
    //     level: 0,
    //     groups: [],
    //     techprereq: [],
    //     fieldreqs: [],
    //     description: "",
    //     flavour:""
    // },
    {
        id: TECHIDS.SuperConductor,
        name: "Superconductors",
        level: 0,
        groups: [],
        techprereq: [],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[0]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[0]],
        ],
        description: "",
        flavour: "Superconduction in room temperatures moves the barriers of information and physics to the realm of science fiction."
    },
    {
        id: TECHIDS.LimitedAI,
        name: "Limited AI",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.SuperConductor],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.AGI,
        name: "Artificial General Intelligence",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.LimitedAI],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.AutomatedExploration,
        name: "Automated Exploration",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.LimitedAI],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Cybernetics,
        name: "Cybernetics",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.SuperConductor],
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Androids,
        name: "Androids",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.Cybernetics],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.CyberImmor,
        name: "Cyber Immortality",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.Cybernetics],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.DimensionalTheo,
        name: "Dimensional Theory",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.SuperConductor],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.WarpGates,
        name: "Warp Gates",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.DimensionalTheo],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Teleportation,
        name: "Teleportation",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.DimensionalTheo],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.AdvancedMat,
        name: "Advanced Materials",
        level: 0,
        groups: [],
        techprereq: [],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[0]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[0]],
        ],
        description: "",
        flavour: "Advancements in both traditional materials and biological materials allow us to alter our environment beyond recognition"
    },
    {
        id: TECHIDS.NanoMachines,
        name: "Nano Machines",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.AdvancedMat],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.SelfReplication,
        name: "Self Replication",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.NanoMachines],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.BioNanoMach,
        name: "Biological Nano Machines",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.NanoMachines],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.EcoPurification,
        name: "Eco Purification",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.AdvancedMat],
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Terraforming,
        name: "Terraforming",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.EcoPurification],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.GaiaInit,
        name: "Gaia Initiative",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.EcoPurification],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.DeepSpaceMing,
        name: "Deep Space Mining",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.AdvancedMat],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.MacroConstruction,
        name: "Macro Construction",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.DeepSpaceMing],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.ArtifialPlanet,
        name: "Artificial Planetoids",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.DeepSpaceMing],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.FusionPower,
        name: "Fusion power",
        level: 0,
        groups: [],
        techprereq: [],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[0]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[0]],
        ],
        description: "",
        flavour: "The holy grail of energy efficiency is replicating the process of stars."
    },
    {
        id: TECHIDS.Shields,
        name: "Energy Shields",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.FusionPower],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.PersonalShields,
        name: "Personal Shields",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.Shields],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.DysonSphere,
        name: "Dyson Sphere",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.Shields],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.AntiMatter,
        name: "Anti Matter",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.FusionPower],
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.AntimatterDrives,
        name: "Antimatter Drives",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.AntiMatter],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.DarkMatterTheo,
        name: "Dark Matter Theory",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.AntiMatter],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.FusionCell,
        name: "Fusion Cells",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.FusionPower],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Antigravity,
        name: "Antigravity",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.FusionCell],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.HyperDimComm,
        name: "Hyperdimensional Communications",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.FusionCell],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Xenobiology,
        name: "Xenobiology",
        level: 0,
        groups: [],
        techprereq: [],
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[0]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[0]],
        ],
        description: "",
        flavour: "We are not alone that much is certain, but it is absolutely paramount to understand our cosmic neighbours better."
    },
    {
        id: TECHIDS.GeneManipulation,
        name: "Gene Manipulation",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.Xenobiology],
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Uplifting,
        name: "Uplifting",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.GeneManipulation],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.RapidEvolution,
        name: "Rapid Evolution",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.GeneManipulation],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.PsychicManif,
        name: "Psychic Manifestation",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.Xenobiology],
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.HiveMind,
        name: "Hive Mind",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.PsychicManif],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Enlightenment,
        name: "Enlightenment",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.PsychicManif],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.BioConstruction,
        name: "Bioconstruction",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.Xenobiology],
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[1]],
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[1]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.LivingMetal,
        name: "Living Metal",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.BioConstruction],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
    {
        id: TECHIDS.Biocomputer,
        name: "Biocomputer",
        level: 2,
        groups: [],
        techprereq: [TECHIDS.BioConstruction],
        fieldreqs: [
            [fModels_1.TechnologyField.PHYSICS, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.INFORMATION, baseCost * costLevels[2]],
            [fModels_1.TechnologyField.BIOLOGY, baseCost * costLevels[2]],
        ],
        description: "",
        flavour: ""
    },
];
exports.DATATECHNOLOGYOLD = [
    {
        id: TECHIDS.AdvRobotics,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 80],
            [fModels_1.TechnologyField.INFORMATION, 80],
        ],
        techprereq: [],
        name: "Advanced Robotics",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.HypTheory,
        fieldreqs: [[fModels_1.TechnologyField.PHYSICS, 160]],
        techprereq: [],
        name: "Hyper Space Theory",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.GeneEngine,
        fieldreqs: [[fModels_1.TechnologyField.BIOLOGY, 160]],
        techprereq: [],
        name: "Genetic Engineering",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.AntimatterCon,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 80],
        ],
        techprereq: [],
        name: "Antimatter Construction",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.IonEngines,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 5],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units",
        groups: [],
        level: 0
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
        description: "Gain +3 speed to all units",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.ManouveringJets1,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 10],
            [fModels_1.TechnologyField.PHYSICS, 5],
        ],
        techprereq: [],
        name: "Manouvering Jets 1",
        description: "The agility of each ship is increased by 5%",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.ManouveringJets2,
        fieldreqs: [
            [fModels_1.TechnologyField.CHEMISTRY, 40],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.ManouveringJets1],
        name: "Manouvering Jets 2",
        description: "The agility of each ship is increased by 15%",
        groups: [],
        level: 0
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
        description: "The agility of each ship is increased by 25%",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.TargetingComp1,
        fieldreqs: [[fModels_1.TechnologyField.INFORMATION, 20]],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +5 for base attack accuracy",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.TargetingComp2,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 80],
            [fModels_1.TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.TargetingComp1],
        name: "Targeting computers II",
        description: "Gain additional 5 for base attack accuracy",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.TargetingComp3,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 160],
            [fModels_1.TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.TargetingComp2, TECHIDS.AdvRobotics],
        name: "Targeting computers III",
        description: "Gain additional +10 for base attack accuracy",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.HeavyRounds1,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Heavy Rounds",
        description: "The damage output of all Kinetic Weapons is increased by 5%",
        groups: [],
        level: 0
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
        description: "The damage output of all Kinetic Weapons is increased by 10% more",
        groups: [],
        level: 0
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
        description: "The damage output of all Kinetic Weapons is increased by 10% more",
        groups: [],
        level: 0
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
        description: "The damage output of Energy weapons is increased by 5%",
        groups: [],
        level: 0
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
        name: "Focus Beam II",
        description: "The damage output of Energy weapons is increased by 10% more",
        groups: [],
        level: 0
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
        name: "Focus Beam III",
        description: "The damage output of Energy weapons is increased by 10% more",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.PowerShields,
        fieldreqs: [
            [fModels_1.TechnologyField.INFORMATION, 40],
            [fModels_1.TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory],
        name: "Power Shields",
        description: "Shield regeneration increased by 25%",
        groups: [],
        level: 0
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
        description: "Ship will automatically repair their damage by 10% of their hull value each turn.",
        groups: [],
        level: 0
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
        description: "Ships repairs damage between combat rounds. The amount depends on the ship size.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.Marketing,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 160],
            [fModels_1.TechnologyField.INFORMATION, 20],
        ],
        techprereq: [],
        name: "Hyper Space Marketing",
        description: "Gain 1 Money per 5 total economy",
        groups: [],
        level: 0
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
        description: "Each planet will automatically generate +1 money each turn",
        groups: [],
        level: 0
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
        description: "Each trade agreement will gain you +2 money per turn, even if you are the one paying.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.MineralPros,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Mineral Processing",
        description: "Maximum industry in Mineral Rich and Rare mineral planets is increased by 1",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.AlterPros,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Alternative Processing",
        description: "Minerally poor planets gain +1 industry maximum and +1 welfare maximum",
        groups: [],
        level: 0
    },
    {
        //FN DONE
        id: TECHIDS.AutoDef1,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 10],
            [fModels_1.TechnologyField.INFORMATION, 20],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
            [fModels_1.TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Automated Defences",
        description: "Each system gains +1 defense during invasion",
        groups: [],
        level: 0
    },
    {
        //FN DONE
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
        description: "Each system gains +3 defense during invasion",
        groups: [],
        level: 0
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
        description: "Each system gains +5 defense during invasion",
        groups: [],
        level: 0
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
        description: "Each defence point is worth 2 points when defending against invasions.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.SpaceMarine1,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 1 per ship.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.SpaceMarine2,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 80],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [TECHIDS.SpaceMarine1, TECHIDS.GeneEngine],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 3 per ship.",
        groups: [],
        level: 0
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
        description: "The strength value of invading troops is multiplied by 1.5",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.HigherEdu,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 20],
            [fModels_1.TechnologyField.BIOLOGY, 20],
        ],
        techprereq: [],
        name: "Higher Education",
        description: "High Welfare affects research points less.",
        groups: [],
        level: 0
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
        description: "Every 7th total welfare point will produce 1 command instead of every 10th.",
        groups: [],
        level: 0
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
        description: "Welfare maximum is increased on each system by 1.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.Adaptability,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 40],
            [fModels_1.TechnologyField.MATERIAL, 10],
        ],
        techprereq: [TECHIDS.GeneEngine],
        name: "Adaptability",
        description: "Maximum welfare of hostile systems is increased to 3.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.EfficientBur,
        fieldreqs: [
            [fModels_1.TechnologyField.BUSINESS, 40],
            [fModels_1.TechnologyField.INFORMATION, 40],
        ],
        techprereq: [TECHIDS.AdvRobotics],
        name: "Efficient Bureaucracy",
        description: "Cost of walfare on each system is decreased by 1 to a minimum of 1.",
        groups: [],
        level: 0
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
        description: "Systems with industry level 5 or higher can build two ships at the same time",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.Ugconstruc,
        fieldreqs: [
            [fModels_1.TechnologyField.MATERIAL, 40],
            [fModels_1.TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Underground Construction",
        description: "Each system gains +1 building slot",
        groups: [],
        level: 0
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
        description: "Each system gains +1 building slot",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.Expansionist,
        fieldreqs: [
            [fModels_1.TechnologyField.BIOLOGY, 160],
            [fModels_1.TechnologyField.BUSINESS, 160],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.GeneEngine],
        name: "Agenda: Expansionism",
        description: "Gain 1 command per 7 systems you control per turn.",
        groups: [],
        level: 0
    },
    {
        id: TECHIDS.Capitalist,
        fieldreqs: [[fModels_1.TechnologyField.BUSINESS, 320]],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.HypTheory],
        name: "Agenda: Capitalism",
        description: "Gain 5 money per turn per 7 systems you control per turn.",
        groups: [],
        level: 0
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
        description: "Gain 3 research points per 7 systems you control per turn.",
        groups: [],
        level: 0
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
        description: "Allows you to build Arcologies.",
        groups: [],
        level: 0
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
        description: "Allows you to build Dyson Sphere.",
        groups: [],
        level: 0
    },
];
