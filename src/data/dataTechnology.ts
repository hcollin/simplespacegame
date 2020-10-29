import { Technology, TechnologyField } from "../models/Models";



export const DATATECHNOLOGY: Technology[] = [
    {
        id: "TECH-PROP-001",
        requirements: [
            [TechnologyField.CHEMISTRY, 3],
            [TechnologyField.PHYSICS, 2],
        ],
        name: "Ion Engines",
        description: "Gain +1 speed to all units",
    },
    // {
    //     id: "TECH-PROP-001",
    //     name: "Ion Engines",
    //     description: "Gain +1 speed to all units",
    // },
]