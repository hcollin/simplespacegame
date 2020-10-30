import { Technology, TechnologyField } from "../models/Models";



export const DATATECHNOLOGY: Technology[] = [
    {
        id: "TECH-PROP-001",
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 3],
            [TechnologyField.PHYSICS, 2],
        ],
        techprereq: [],
        name: "Ion Engines",
        description: "Gain +1 speed to all units",
    },
    {
        id: "TECH-PROP-002",
        fieldreqs: [
            [TechnologyField.CHEMISTRY, 5],
            [TechnologyField.PHYSICS, 5],
            [TechnologyField.INFORMATION, 2],
        ],
        techprereq: ["TECH-PROP-001"],
        name: "Warp Engines",
        description: "Gain +2 speed to all units",
    },
    {
        id: "TECH-BUSI-001",
        fieldreqs: [
            [TechnologyField.BUSINESS, 4],
            [TechnologyField.SOCIOLOGY, 1],
        ],
        techprereq: [],
        name: "Marketing",
        description: "Gain 1 Money per 5 total economy",
    },
    {
        id: "TECH-WAR-001",
        fieldreqs: [
            [TechnologyField.PHYSICS, 7],
            
        ],
        techprereq: [],
        name: "Targeting computers I",
        description: "Gain +1 for each Weapons roll",
    },
    {
        id: "TECH-WAR-002",
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