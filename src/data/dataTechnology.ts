import { Technology, TechnologyField } from "../models/Models";

export enum TECHIDS {
    IonEngines = "T-0001",
    WarpEngines = "T-0002",
    ManouveringJets1 = "T-0003",
    ManouveringJets2 = "T-0004",
    ManouveringJets3 = "T-0005",
    TargetingComp1 = "T-0006",
    TargetingComp2 = "T-0007",
    TargetingComp3 = "T-0008",
    HeavyRounds1 = "T-0009",
    HeavyRounds2 = "T-0010",
    HeavyRounds3 = "T-0011",
    FocusBeam1 = "T-0012",
    FocusBeam2 = "T-0013",
    FocusBeam3 = "T-0014",

    PowerShields = "T-0015",
    AutoRepBots1 = "T-0016",
    AutoRepBots2 = "T-0017",

    Marketing = "T-0018",

    InitEcoBoost = "T-0019",
    MerchGuilds = "T-0020",
    MineralPros = "T-0021",
    AlterPros = "T-0022",
    AutoDef1 = "T-0023",
    AutoDef2 = "T-0024",
    AutoDef3 = "T-0025",
    DriodDef = "T-0026",
    SpaceMarine1 = "T-0027",
    SpaceMarine2 = "T-0028",

    TermiTroops = "T-0029",

    HigherEdu = "T-0030",
    DeciAppr = "T-0031",

    GalacticSen = "T-0032",
    Adaptability = "T-0033",
    EfficientBur = "T-0034",

    SpaceDock = "T-0035",

    Ugconstruc = "T-0036",
    LevitatBuild = "T-0037",
    Expansionist = "T-0038",
    Capitalist = "T-0039",
    Scientist = "T-0040",

    Arcology = "T-0041",
    DysonShpe = "T-0042",

    AdvRobotics = "T-B01",
    HypTheory = "T-B02",
    GeneEngine = "T-B03",
    AntimatterCon = "T-B04",

    // New tech

    SuperConductor = "Superconductor",

    LimitedAI = "Limited Ai",
    AGI = "Artificial General Intelligence",
    AutomatedExploration = "Automated Exploration",

    Cybernetics = "Cybernetics",
    Androids = "Androids",
    CyberImmor = "Cyber immortality",

    DimensionalTheo = "Dimensional Theory",
    WarpGates = "Warp Gates",
    Teleportation = "Teleportation",

    AdvancedMat = "Advanced Materials",

    NanoMachines = "Nano Machines",
    SelfReplication = "Self Replication",
    BioNanoMach = "Biological Nano Machines",

    EcoPurification = "Eco purification",
    Terraforming = "Terraforming",
    GaiaInit = "Gaia Initiative",

    DeepSpaceMing = "Deep Space Mining",
    MacroConstruction = "Macro construction",
    ArtifialPlanet = "Artificial Planetoids",

    FusionPower = "Fusion Power",

    Shields = "Shields",
    PersonalShields = "Personal Shields",
    DysonSphere = "Dyson Sphere",

    AntiMatter = "Antimatter",
    AntimatterDrives = "Antimatter Drives",
    DarkMatterTheo = "Dark matter theory",

    FusionCell = "Fusion Cell",
    Antigravity = "Antigravity",
    HyperDimComm = "Hyperdimensional communications",

    Xenobiology = "Xenobiology",

    GeneManipulation = "Gene Manipulation",
    Uplifting = "Upligting",
    RapidEvolution = "Rapid Evolution",

    PsychicManif = "Psychic Manifestation",
    HiveMind = "Hive Mind",
    Enlightenment = "Englightenment",

    BioConstruction = "Bio Construction",
    LivingMetal = "Living Metal",
    Biocomputer = "Biocomputer",
}

const baseCost = 5;
const costLevels: number[] = [1, 3, 6];

export const DATATECHNOLOGY: Technology[] = [
    {
        id: TECHIDS.SuperConductor,
        name: "Superconductors",
        level: 0,
        groups: [],
        techprereq: [],
        fieldreqs: [
            [TechnologyField.PHYSICS, baseCost * costLevels[0]],
            [TechnologyField.INFORMATION, baseCost * costLevels[0]],
        ],
        description: "",
        flavour:
            "Superconduction in room temperatures moves the barriers of information and physics to the realm of science fiction.",
	},

	{
        id: TECHIDS.LimitedAI,
        name: "Limited AI",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.SuperConductor],
        fieldreqs: [
            [TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.INFORMATION, baseCost * costLevels[1]],
			[TechnologyField.BIOLOGY, baseCost * costLevels[1]],
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
            [TechnologyField.BIOLOGY, baseCost * costLevels[1]],
			[TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
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
            [TechnologyField.MATERIAL, baseCost * costLevels[1]],
			[TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.INFORMATION, baseCost * costLevels[1]],
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
            [TechnologyField.MATERIAL, baseCost * costLevels[0]],
            [TechnologyField.BIOLOGY, baseCost * costLevels[0]],
        ],
        description: "",
        flavour:
            "Advancements in both traditional materials and biological materials allow us to alter our environment beyond recognition",
	},

	{
        id: TECHIDS.NanoMachines,
        name: "Nano Machines",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.AdvancedMat],
        fieldreqs: [
            [TechnologyField.MATERIAL, baseCost * costLevels[1]],
			[TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.INFORMATION, baseCost * costLevels[1]],
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
            [TechnologyField.BIOLOGY, baseCost * costLevels[1]],
			[TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
			[TechnologyField.MATERIAL, baseCost * costLevels[1]],
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
            [TechnologyField.MATERIAL, baseCost * costLevels[1]],
			[TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
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
            [TechnologyField.PHYSICS, baseCost * costLevels[0]],
            [TechnologyField.CHEMISTRY, baseCost * costLevels[0]],
        ],
        description: "",
        flavour:
            "The holy grail of energy efficiency is replicating the process of stars.",
	},

	{
        id: TECHIDS.Shields,
        name: "Energy Shields",
        level: 1,
        groups: [],
        techprereq: [TECHIDS.FusionPower],
        fieldreqs: [
            [TechnologyField.MATERIAL, baseCost * costLevels[1]],
			[TechnologyField.PHYSICS, baseCost * costLevels[1]],
			[TechnologyField.CHEMISTRY, baseCost * costLevels[1]],
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
            [TechnologyField.BIOLOGY, baseCost * costLevels[0]],
            [TechnologyField.INFORMATION, baseCost * costLevels[0]],
        ],
        description: "",
        flavour:
            "We are not alone that much is certain, but it is absolutely paramount to understand our cosmic neighbours better.",
    },
];

export const DATATECHNOLOGYOLD: Technology[] = [
    {
        id: TECHIDS.AdvRobotics,
        fieldreqs: [
            [TechnologyField.BUSINESS, 80],
            [TechnologyField.INFORMATION, 80],
        ],
        techprereq: [],
        name: "Advanced Robotics",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.HypTheory,
        fieldreqs: [[TechnologyField.PHYSICS, 160]],
        techprereq: [],
        name: "Hyper Space Theory",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.GeneEngine,
        fieldreqs: [[TechnologyField.BIOLOGY, 160]],
        techprereq: [],
        name: "Genetic Engineering",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.AntimatterCon,
        fieldreqs: [
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.CHEMISTRY, 80],
        ],
        techprereq: [],
        name: "Antimatter Construction",
        description: "Worth 5 Victory points",
        groups: [],
        level: 0,
    },

    {
        id: TECHIDS.IonEngines,
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 5],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.WarpEngines,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.MATERIAL, 40],
            [TechnologyField.INFORMATION, 40],
            [TechnologyField.CHEMISTRY, 10],
            [TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.IonEngines, TECHIDS.HypTheory],
        name: "Warp Engines",
        description: "Gain +3 speed to all units",
        groups: [],
        level: 0,
    },

    {
        id: TECHIDS.ManouveringJets1,
        fieldreqs: [
            [TechnologyField.INFORMATION, 10],
            [TechnologyField.PHYSICS, 5],
        ],
        techprereq: [],
        name: "Manouvering Jets 1",
        description: "The agility of each ship is increased by 5%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.ManouveringJets2,
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 40],
            [TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.ManouveringJets1],
        name: "Manouvering Jets 2",
        description: "The agility of each ship is increased by 15%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.ManouveringJets3,
        fieldreqs: [
            [TechnologyField.MATERIAL, 40],
            [TechnologyField.CHEMISTRY, 80],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.ManouveringJets2, TECHIDS.HypTheory],
        name: "Manouvering Jets 3",
        description: "The agility of each ship is increased by 25%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.TargetingComp1,
        fieldreqs: [[TechnologyField.INFORMATION, 20]],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +5 for base attack accuracy",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.TargetingComp2,
        fieldreqs: [
            [TechnologyField.INFORMATION, 80],
            [TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.TargetingComp1],
        name: "Targeting computers II",
        description: "Gain additional 5 for base attack accuracy",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.TargetingComp3,
        fieldreqs: [
            [TechnologyField.INFORMATION, 160],
            [TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.TargetingComp2, TECHIDS.AdvRobotics],
        name: "Targeting computers III",
        description: "Gain additional +10 for base attack accuracy",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.HeavyRounds1,
        fieldreqs: [
            [TechnologyField.MATERIAL, 10],
            [TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Heavy Rounds",
        description: "The damage output of all Kinetic Weapons is increased by 5%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.HeavyRounds2,
        fieldreqs: [
            [TechnologyField.MATERIAL, 40],
            [TechnologyField.CHEMISTRY, 40],
            [TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.HeavyRounds1],
        name: "Heavy Rounds II",
        description: "The damage output of all Kinetic Weapons is increased by 10% more",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.HeavyRounds3,
        fieldreqs: [
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.CHEMISTRY, 80],
            [TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.HeavyRounds2, TECHIDS.AntimatterCon],
        name: "Heavy Rounds III",
        description: "The damage output of all Kinetic Weapons is increased by 10% more",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.FocusBeam1,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 5],
            [TechnologyField.CHEMISTRY, 10],
            [TechnologyField.PHYSICS, 20],
        ],
        techprereq: [],
        name: "Focus Beam",
        description: "The damage output of Energy weapons is increased by 5%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.FocusBeam2,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 5],
            [TechnologyField.INFORMATION, 10],
            [TechnologyField.CHEMISTRY, 20],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.FocusBeam1],
        name: "Focus Beam II",
        description: "The damage output of Energy weapons is increased by 10% more",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.FocusBeam3,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 5],
            [TechnologyField.INFORMATION, 20],
            [TechnologyField.CHEMISTRY, 20],
            [TechnologyField.PHYSICS, 160],
        ],
        techprereq: [TECHIDS.FocusBeam2, TECHIDS.HypTheory],
        name: "Focus Beam III",
        description: "The damage output of Energy weapons is increased by 10% more",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.PowerShields,
        fieldreqs: [
            [TechnologyField.INFORMATION, 40],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory],
        name: "Power Shields",
        description: "Shield regeneration increased by 25%",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.AutoRepBots1,
        fieldreqs: [
            [TechnologyField.MATERIAL, 20],
            [TechnologyField.INFORMATION, 40],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Auto Repair Bots",
        description: "Ship will automatically repair their damage by 10% of their hull value each turn.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.AutoRepBots2,
        fieldreqs: [
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.INFORMATION, 40],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.AutoRepBots1, TECHIDS.AdvRobotics],
        name: "Auto Repair Bots II",
        description: "Ships repairs damage between combat rounds. The amount depends on the ship size.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Marketing,
        fieldreqs: [
            [TechnologyField.BUSINESS, 160],
            [TechnologyField.INFORMATION, 20],
        ],
        techprereq: [],
        name: "Hyper Space Marketing",
        description: "Gain 1 Money per 5 total economy",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.InitEcoBoost,
        fieldreqs: [
            [TechnologyField.MATERIAL, 10],
            [TechnologyField.BUSINESS, 40],
            [TechnologyField.INFORMATION, 20],
        ],
        techprereq: [],
        name: "Initial Economy Boost",
        description: "Each planet will automatically generate +1 money each turn",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.MerchGuilds,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.BUSINESS, 20],
            [TechnologyField.INFORMATION, 10],
        ],
        techprereq: [],
        name: "Merchant Guilds",
        description: "Each trade agreement will gain you +2 money per turn, even if you are the one paying.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.MineralPros,
        fieldreqs: [
            [TechnologyField.MATERIAL, 10],
            [TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Mineral Processing",
        description: "Maximum industry in Mineral Rich and Rare mineral planets is increased by 1",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.AlterPros,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Alternative Processing",
        description: "Minerally poor planets gain +1 industry maximum and +1 welfare maximum",
        groups: [],
        level: 0,
    },
    {
        //FN DONE
        id: TECHIDS.AutoDef1,
        fieldreqs: [
            [TechnologyField.MATERIAL, 10],
            [TechnologyField.INFORMATION, 20],
            [TechnologyField.CHEMISTRY, 10],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Automated Defences",
        description: "Each system gains +1 defense during invasion",
        groups: [],
        level: 0,
    },
    {
        //FN DONE
        id: TECHIDS.AutoDef2,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 10],
            [TechnologyField.MATERIAL, 20],
            [TechnologyField.INFORMATION, 40],
            [TechnologyField.CHEMISTRY, 20],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [TECHIDS.AutoDef1],
        name: "Automated Defences II",
        description: "Each system gains +3 defense during invasion",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.AutoDef3,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.MATERIAL, 20],
            [TechnologyField.INFORMATION, 80],
            [TechnologyField.CHEMISTRY, 20],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [TECHIDS.AutoDef2, TECHIDS.AdvRobotics],
        name: "Automated Defences III",
        description: "Each system gains +5 defense during invasion",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.DriodDef,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 40],
            [TechnologyField.INFORMATION, 80],
            [TechnologyField.CHEMISTRY, 40],
            [TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.AutoRepBots1, TECHIDS.AutoDef1],
        name: "Driod Defences",
        description: "Each defence point is worth 2 points when defending against invasions.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.SpaceMarine1,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 40],
            [TechnologyField.CHEMISTRY, 10],
        ],
        techprereq: [],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 1 per ship.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.SpaceMarine2,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 80],
            [TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [TECHIDS.SpaceMarine1, TECHIDS.GeneEngine],
        name: "Space Marine",
        description: "Total troop value of invading forces is incresed by 3 per ship.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.TermiTroops,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 160],
            [TechnologyField.MATERIAL, 10],
            [TechnologyField.INFORMATION, 20],
            [TechnologyField.PHYSICS, 5],
        ],
        techprereq: [TECHIDS.GeneEngine, TECHIDS.AdvRobotics],
        name: "Terminator Troops",
        description: "The strength value of invading troops is multiplied by 1.5",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.HigherEdu,
        fieldreqs: [
            [TechnologyField.BUSINESS, 20],
            [TechnologyField.BIOLOGY, 20],
        ],
        techprereq: [],
        name: "Higher Education",
        description: "High Welfare affects research points less.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.DeciAppr,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 40],
            [TechnologyField.BUSINESS, 80],
            [TechnologyField.INFORMATION, 80],
        ],
        techprereq: [],
        name: "Decision Apparatus",
        description: "Every 7th total welfare point will produce 1 command instead of every 10th.",
        groups: [],
        level: 0,
    },

    {
        id: TECHIDS.GalacticSen,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.BUSINESS, 40],
            [TechnologyField.INFORMATION, 40],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AntimatterCon],
        name: "Galactic Senate",
        description: "Welfare maximum is increased on each system by 1.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Adaptability,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 40],
            [TechnologyField.MATERIAL, 10],
        ],
        techprereq: [TECHIDS.GeneEngine],
        name: "Adaptability",
        description: "Maximum welfare of hostile systems is increased to 3.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.EfficientBur,
        fieldreqs: [
            [TechnologyField.BUSINESS, 40],
            [TechnologyField.INFORMATION, 40],
        ],
        techprereq: [TECHIDS.AdvRobotics],
        name: "Efficient Bureaucracy",
        description: "Cost of walfare on each system is decreased by 1 to a minimum of 1.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.SpaceDock,
        fieldreqs: [
            [TechnologyField.MATERIAL, 40],
            [TechnologyField.BUSINESS, 40],
            [TechnologyField.INFORMATION, 20],
            [TechnologyField.CHEMISTRY, 10],
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Space Dock",
        description: "Systems with industry level 5 or higher can build two ships at the same time",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Ugconstruc,
        fieldreqs: [
            [TechnologyField.MATERIAL, 40],
            [TechnologyField.CHEMISTRY, 20],
        ],
        techprereq: [],
        name: "Underground Construction",
        description: "Each system gains +1 building slot",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.LevitatBuild,
        fieldreqs: [
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.CHEMISTRY, 10],
            [TechnologyField.PHYSICS, 40],
        ],
        techprereq: [TECHIDS.Ugconstruc, TECHIDS.HypTheory],
        name: "Levitation Buildings",
        description: "Each system gains +1 building slot",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Expansionist,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 160],
            [TechnologyField.BUSINESS, 160],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.GeneEngine],
        name: "Agenda: Expansionism",
        description: "Gain 1 command per 7 systems you control per turn.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Capitalist,
        fieldreqs: [[TechnologyField.BUSINESS, 320]],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.HypTheory],
        name: "Agenda: Capitalism",
        description: "Gain 5 money per turn per 7 systems you control per turn.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Scientist,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 80],
            [TechnologyField.BUSINESS, 80],
            [TechnologyField.CHEMISTRY, 80],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AntimatterCon],
        name: "Agenda: Science",
        description: "Gain 3 research points per 7 systems you control per turn.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.Arcology,
        fieldreqs: [
            [TechnologyField.BIOLOGY, 20],
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.BUSINESS, 40],
            [TechnologyField.INFORMATION, 20],
            [TechnologyField.CHEMISTRY, 40],
            [TechnologyField.PHYSICS, 20],
        ],
        techprereq: [TECHIDS.AdvRobotics, TECHIDS.AntimatterCon],
        name: "Arcologies",
        description: "Allows you to build Arcologies.",
        groups: [],
        level: 0,
    },
    {
        id: TECHIDS.DysonShpe,
        fieldreqs: [
            [TechnologyField.MATERIAL, 80],
            [TechnologyField.CHEMISTRY, 80],
            [TechnologyField.PHYSICS, 80],
        ],
        techprereq: [TECHIDS.HypTheory, TECHIDS.AdvRobotics],
        name: "Dyson Spheres",
        description: "Allows you to build Dyson Sphere.",
        groups: [],
        level: 0,
    },
];
