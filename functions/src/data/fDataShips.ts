import { OldShip } from "../models/fModels";
import { SHIPCLASS, ShipDesign, ShipWeapon, WEAPONTYPE } from "../models/fUnits";
import { arnd } from "../utils/fRandUtils";

const DATAOLDSHIPS: OldShip[] = [
    {
        id: "",
        cost: 3,
        minIndustry: 2,
        hull: 3,
        weapons: 1,
        name: "Corvette",
        speed: 5,
        description: "Small, cheap and cheerful ship. Mainly used to bulk up the numbers in fleets and for reconnaissance in lesser empires.",
    },
    {
        id: "",
        cost: 5,
        minIndustry: 4,
        hull: 5,
        weapons: 1,
        name: "Frigate",
        speed: 7,
    },
    {
        id: "",
        cost: 8,
        minIndustry: 7,
        hull: 10,
        weapons: 3,
        name: "Cruiser",
        speed: 5,
    },
    {
        id: "",
        cost: 12,
        minIndustry: 10,
        hull: 16,
        weapons: 6,
        name: "Battleship",
        speed: 4,
    },

];

const DATASHIPWEAPONS: ShipWeapon[] = [
    {
        name: "Rapid Laser",
        type: WEAPONTYPE.ENERGY,
        accuracy: 80,
        cooldown: 0,
        cooldownTime: 0,
        damage: [10, 15],
        special: []
    },
    {
        name: "Laser Turret",
        type: WEAPONTYPE.ENERGY,
        accuracy: 70,
        cooldown: 0,
        cooldownTime: 0,
        damage: [15, 20],
        special: []
    },
    {
        name: "Small Railgun",
        type: WEAPONTYPE.KINETIC,
        accuracy: 50,
        cooldown: 0,
        cooldownTime: 0,
        damage: [20, 30],
        special: []
    },
    {
        name: "Mass Cannon",
        type: WEAPONTYPE.KINETIC,
        accuracy: 60,
        cooldown: 0,
        cooldownTime: 1,
        damage: [40, 50],
        special: []
    },
    {
        name: "Homig Missile",
        type: WEAPONTYPE.MISSILE,
        accuracy: 50,
        cooldown: 0,
        cooldownTime: 0,
        damage: [15, 20],
        special: []
    },
];

function getWeaponByName(name: string): ShipWeapon {
    const w = DATASHIPWEAPONS.find((w: ShipWeapon) => w.name === name);
    if(!w) throw new Error(`Unknown weapon ${name}`);
    return w;
}

const DATANEWSHIPS: ShipDesign[] = [
    {
        id: "",
        type: SHIPCLASS.CORVETTE,
        name: "Corvette",
        cost: 3,
        minIndustry: 2,
        techReq: [],
        troops: 1,
        speed: 6,
        agility: 50,
        armor: 1,
        hull: 50,
        shieldRegeneration: 0,
        shieldsMax: 0,
        keywords: [],
        weapons: [
            getWeaponByName("Laser Turret"),
            // getWeaponByName("Rapid Laser")
        ],
        description: "Small, cheap and cheerful ship. Mainly used to bulk up the numbers in fleets and for reconnaissance in lesser empires.",
    },
    {
        id: "",
        type: SHIPCLASS.FRIGATE,
        name: "Frigate",
        cost: 6,
        minIndustry: 3,
        techReq: [],
        troops: 3,
        speed: 5,
        agility: 40,
        armor: 3,
        hull: 90,
        shieldRegeneration: 3,
        shieldsMax: 10,
        keywords: [],
        weapons: [
            getWeaponByName("Rapid Laser"),
            getWeaponByName("Rapid Laser"),
            getWeaponByName("Small Railgun"),
        ],
        description: ""
    },
    {
        id: "",
        type: SHIPCLASS.DESTROYER,
        name: "Destroyer",
        cost: 12,
        minIndustry: 5,
        techReq: [],
        troops: 5,
        speed: 5,
        agility: 35,
        armor: 4,
        hull: 140,
        shieldRegeneration: 5,
        shieldsMax: 20,
        keywords: [],
        weapons: [
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Mass Cannon"),
        ],
        description: ""
    },
];



const DATASHIPS = DATANEWSHIPS;

export default DATASHIPS;


export function shipNameGenerator(shipClass: SHIPCLASS): string {
    const partA = ["New", "Old", "Millenium", "Angry", "SS", "MS", "Phantom", "Ghost", "Dark", "Light"];
    const partB = ["Skipper", "Falcon", "Enterprise", "Terror", "Reign", "Memorial", "Ronan", "Samurai", "Ninja", "Knight", "Pride", "Spear", "Sword", "Hammer", "Shield"];
    return `${arnd(partA)} ${arnd(partB)}`;

}

export {DATANEWSHIPS, DATAOLDSHIPS};