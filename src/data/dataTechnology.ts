import { Technology, TechnologyField } from "../models/Models";


export enum TECHIDS {
    IonEngines      = "T-0001",
    WarpEngines     = "T-0002",
    Marketing       = "T-003",

    TargetingComp1  = "T-0004",
    TargetingComp2  = "T-0005",
    TargetingComp3  = "T-0006",

    HeavyRounds     = "T-0007",

    EvasionEngine   = "T-0008",
    PredEvasion     = "T-0009",
    
    DeciAppr        = "T-0010",
    HigherEdu       = "T-0011",

    Arcology        = "T-0012",
};


export const DATATECHNOLOGY: Technology[] = [
    {
        id: TECHIDS.IonEngines,
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 3],
            [TechnologyField.PHYSICS, 2],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units",
    },
    {
        id: TECHIDS.WarpEngines,
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 5],
            [TechnologyField.PHYSICS, 5],
            [TechnologyField.INFORMATION, 2],
        ],
        techprereq: [TECHIDS.IonEngines],
        name: "Warp Engines",
        description: "Gain +3 speed to all units",
    },
    {
        id: TECHIDS.Marketing,
        fieldreqs: [
            [TechnologyField.BUSINESS, 4],
            [TechnologyField.SOCIOLOGY, 1],
        ],
        techprereq: [],
        name: "Marketing",
        description: "Gain 1 Money per 5 total economy",
    },
    {
        id: TECHIDS.EvasionEngine,
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 6],
            [TechnologyField.INFORMATION, 2]
        ],
        techprereq: [],
        name: "Evasion Engine",
        description: "Agility each ship is 10% higher than normal",
    },
    {
        id: TECHIDS.PredEvasion,
        fieldreqs: [
            [TechnologyField.PHYSICS, 6],
            [TechnologyField.INFORMATION, 9]
        ],
        techprereq: [TECHIDS.EvasionEngine],
        name: "TimeSlip Prediction",
        description: "Gain +10 for each ships Agility",
    },
    {
        id: TECHIDS.TargetingComp1,
        fieldreqs: [
            [TechnologyField.INFORMATION, 5],
            
        ],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +5% for base attack accuracy",
    },
    {
        id: TECHIDS.TargetingComp2,
        fieldreqs: [
            [TechnologyField.PHYSICS, 5],
            [TechnologyField.INFORMATION, 5],
            
        ],
        techprereq: [TECHIDS.TargetingComp1],
        name: "Targeting computers II",
        description: "Gain additional +5% for base attack accuracy",
    },
    {
        id: TECHIDS.TargetingComp3,
        fieldreqs: [
            [TechnologyField.PHYSICS, 10],
            [TechnologyField.INFORMATION, 10],
            [TechnologyField.SOCIOLOGY, 5],
            
        ],
        techprereq: [TECHIDS.TargetingComp3],
        name: "Targeting computers III",
        description: "Gain additional +10% for base attack accuracy",
    },
    {
        id: TECHIDS.HeavyRounds,
        fieldreqs: [
            [TechnologyField.PHYSICS, 10],
        ],
        techprereq: [],
        name: "Heavy Rounds",
        description: "The damage output of all Kinetic Weapons is increased by +10%",
    },
    {
        id: TECHIDS.DeciAppr,
        fieldreqs: [
            [TechnologyField.SOCIOLOGY, 7],
            [TechnologyField.INFORMATION, 5],
            
        ],
        techprereq: [],
        name: "Decision Apparatus",
        description: "Every 7th total welfare point will produce 1 command instead of every 10th.",
    },

    {
        id: TECHIDS.HigherEdu,
        fieldreqs: [
            [TechnologyField.SOCIOLOGY, 8],
            [TechnologyField.BIOLOGY, 4],
            
        ],
        techprereq: [],
        name: "Higher Education",
        description: "High Welfare affects research points less.",
    },
    {
        id: TECHIDS.Arcology,
        fieldreqs: [
            [TechnologyField.SOCIOLOGY, 20],
            [TechnologyField.BUSINESS, 20],
            [TechnologyField.INFORMATION, 20],
            
        ],
        techprereq: [],
        name: "Arcology Construction",
        description: "Allows you to build Arcologies.",
    },
    

    // {
    //     id: "TECH-PROP-001",
    //     name: "Ion Engines",
    //     description: "Gain +1 speed to all units",
    // },
]