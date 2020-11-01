import { Technology, TechnologyField } from "../models/Models";


export enum TECHIDS {
    IonEngines      = "T-P-001",
    WarpEngines     = "T-P-002",
    Marketing       = "T-B-001",
    TargetingComp1  = "T-W-001",
    TurboLasers     = "T-W-002",
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
        id: TECHIDS.TargetingComp1,
        fieldreqs: [
            [TechnologyField.PHYSICS, 7],
            
        ],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +1 for each Weapons roll",
    },
    {
        id: TECHIDS.TurboLasers,
        fieldreqs: [
            [TechnologyField.PHYSICS, 7],
            
        ],
        techprereq: [],
        name: "Turbo Lasers",
        description: "You may reroll each dice during combat round",
    },
    

    // {
    //     id: "TECH-PROP-001",
    //     name: "Ion Engines",
    //     description: "Gain +1 speed to all units",
    // },
]