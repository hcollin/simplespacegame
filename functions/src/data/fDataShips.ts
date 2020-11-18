
import { SHIPCLASS, ShipDesign, ShipWeapon, WEAPONTYPE } from "../models/fUnits";
import { arnd, rnd, roll } from "../utils/fRandUtils";


export enum SHIPWEAPONSPECIAL {
    RAPIDFIRE = "Rapid Fire",
    HAILOFFIRE = "Hail of Fire",
    DOUBLESHOT = "Double Shot",
    ARMOURPIERCE = "Armour piercing"
}

const DATASHIPWEAPONS: ShipWeapon[] = [
    {
        id: "",
        name: "Rapid Laser",
        type: WEAPONTYPE.ENERGY,
        accuracy: 80,
        cooldown: 0,
        cooldownTime: 0,
        damage: [4, 10],
        special: [SHIPWEAPONSPECIAL.RAPIDFIRE],
    },
    {
        id: "",
        name: "Laser Turret",
        type: WEAPONTYPE.ENERGY,
        accuracy: 70,
        cooldown: 0,
        cooldownTime: 0,
        damage: [15, 20],
        special: [],
    },
    {
        id: "",
        name: "Small Railgun",
        type: WEAPONTYPE.KINETIC,
        accuracy: 50,
        cooldown: 0,
        cooldownTime: 0,
        damage: [20, 30],
        special: [],
    },
    {
        id: "",
        name: "Mass Cannon",
        type: WEAPONTYPE.KINETIC,
        accuracy: 60,
        cooldown: 0,
        cooldownTime: 1,
        damage: [40, 50],
        special: [],
    },
    {
        id: "",
        name: "Homing Missile",
        type: WEAPONTYPE.MISSILE,
        accuracy: 90,
        cooldown: 0,
        cooldownTime: 3,
        damage: [60, 70],
        special: [],
    },
];

function getWeaponByName(name: string): ShipWeapon {
    const w = DATASHIPWEAPONS.find((w: ShipWeapon) => w.name === name);
    if (!w) throw new Error(`Unknown weapon ${name}`);

    return { ...w, id: `W-${rnd(100000, 999999)}-${Date.now()}` };
}

const DATANEWSHIPS: ShipDesign[] = [
    {
        id: "",
        typeClassName: "Corvette",
        sizeIndicator: 3,
        type: SHIPCLASS.CORVETTE,
        name: "Corvette",
        cost: 3,
        buildTime: 2,
        minIndustry: 1,
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
            // getWeaponByName("Homing Missile")
        ],
        description:
            "Small, cheap and cheerful ship. Mainly used to bulk up the numbers in fleets and for reconnaissance in lesser empires.",
    },
    {
        id: "",
        typeClassName: "Frigate",
        sizeIndicator: 4,
        type: SHIPCLASS.FRIGATE,
        name: "Frigate",
        cost: 6,
        buildTime: 4,
        minIndustry: 2,
        techReq: [],
        troops: 3,
        speed: 5,
        agility: 40,
        armor: 3,
        hull: 90,
        shieldRegeneration: 3,
        shieldsMax: 10,
        keywords: [],
        weapons: [getWeaponByName("Rapid Laser"), getWeaponByName("Rapid Laser"), getWeaponByName("Small Railgun")],
        description: "",
    },
    {
        id: "",
        typeClassName: "Destroyer",
        sizeIndicator: 4,
        type: SHIPCLASS.DESTROYER,
        name: "Destroyer",
        cost: 12,
        buildTime: 4,
        minIndustry: 3,
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
        description: "",
    },
    {
        id: "",
        typeClassName: "Light Cruiser",
        sizeIndicator: 5,
        type: SHIPCLASS.CRUISER,
        name: "Light Cruiser",
        cost: 20,
        buildTime: 5,
        minIndustry: 3,
        techReq: [],
        troops: 4,
        speed: 5,
        agility: 40,
        armor: 3,
        hull: 180,
        shieldRegeneration: 8,
        shieldsMax: 40,
        keywords: [],
        weapons: [
            getWeaponByName("Rapid Laser"),
            getWeaponByName("Rapid Laser"),
            getWeaponByName("Small Railgun"),
            getWeaponByName("Homing Missile"),
            getWeaponByName("Homing Missile"),
        ],
        description: "",
    },
    {
        id: "",
        typeClassName: "Heavy Cruiser",
        sizeIndicator: 5,
        type: SHIPCLASS.CRUISER,
        name: "Heavy Cruiser",
        cost: 28,
        buildTime: 5,
        minIndustry: 3,
        techReq: [],
        troops: 4,
        speed: 5,
        agility: 40,
        armor: 5,
        hull: 220,
        shieldRegeneration: 8,
        shieldsMax: 45,
        keywords: [],
        weapons: [
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Rapid Laser"),
            getWeaponByName("Small Railgun"),
            getWeaponByName("Small Railgun"),
            getWeaponByName("Homing Missile"),
            getWeaponByName("Homing Missile"),
        ],
        description: "",
    },
];

const DATASHIPS = DATANEWSHIPS;

export default DATASHIPS;

export function shipNameGenerator(): string {
    const wordAdjective: string[] = [
        "Angry",
        "Altered",
        "Argent",
        "Annoited",
        "Ancient",
        "Bitter",
        "Blind",
        "Bright",
        "Cold",
        "Dark",
        "Divine",
        "Eternal",
        "Enraged",
        "Elegant",
        "Fourth",
        "Faithful",
        "Fallen",
        "First",
        "Fierce",
        "Futile",
        "Final",
        "Grand",
        "Glorius",
        "Holy",
        "Light",
        "Last",
        "Mute",
        "New",
        "Old",
        "Risen",
        "Righteous",
        "Reliable",
        "Second",
        "Supreme",
        "Shadow",
        "Triumphant",
        "True",
        "Third",
        "Unholy",
        "Ultimate",
        "Valiant",
    ];

    const wordDoer: string[] = [
        "Avenger",
        "Annihilator",
        "Aviator",
        "Bomber",
        "Crusader",
        "Corroder",
        "Champion",
        "Dreamer",
        "Defender",
        "Destroyer",
        "Darkness",
        "Explorer",
        "Engineer",
        "Ender",
        "Finder",
        "Fighter",
        "Finalizer",
        "Finisher",
        "Follower",
        "Hellbringer",
        "Harbringer",
        "Hussar",
        "Inventor",
        "Invader",
        "Justicar",
        "Messeger",
        "Master",
        "Merchant",
        "Oppressor",
        "Orator",
        "Punisher",
        "Player",
        "Redeemer",
        "Reclaimer",
        "Ravager",
        "Speaker",
        "Silencer",
        "Skipper",
        "Seeker",
        "Templar",
        "Tormentor",
        "Terminator",
        "Unbeliever",
        "Vindicator",
        "Visitor",
    ];

    const wordColor: string[] = ["Black", "White", "Gray", "Red", "Blue", "Green", "Yellow", "Purple", "Brown"];

    const wordTimeAdjective: string[] = ["Ancient", "First", "Last", "New", "Old", "Young"];

    const wordDescriptive: string[] = [
        "Ancient",
        "Death",
        "Dread",
        "Dark",
        "Fury",
        "Ghost",
        "Life",
        "Necro",
        "Phantom",
        "Spectre",
        "Umbra",
        "True",
    ];

    const wordThing: string[] = [
        "Antihero",
        "Armor",
        "Beast",
        "Bard",
        "Caesar",
        "Cadaver",
        "Clockwork",
        "Dragon",
        "Dagger",
        "Excalibur",
        "Edict",
        "Falcon",
        "Force",
        "Flag",
        "Goliath",
        "God",
        "General",
        "Goddess",
        "Ghost",
        "Hammer",
        "Hero",
        "Hades",
        "Hydra",
        "Idol",
        "Knight",
        "Lightbringer",
        "Machine",
        "Mage",
        "Monster",
        "Mace",
        "Ninja",
        "Nexus",
        "Nosferatu",
        "Odin",
        "Pharaoh",
        "Patriot",
        "Pegasus",
        "Ring",
        "Reign",
        "Queen",
        "Quasar",
        "Quarc",
        "Ruby",
        "Ronan",
        "Stiletto",
        "Spear",
        "Scimitar",
        "Samurai",
        "Sword",
        "Shield",
        "Song",
        "Unicorn",
        "Warmachine",
        "Wizard",
        "Valkyrie",
    ];

    const wordObject: string[] = [
        "Argument",
        "Ashes",
        "Bones",
        "Cataclysm",
        "Conquest",
        "Code",
        "Commandment",
        "Conflict",
        "Destiny",
        "Doom",
        "Dream",
        "Dreams",
        "Downfall",
        "Delusion",
        "Desolation",
        "Death",
        "Empire",
        "Entropy",
        "End",
        "Extinction",
        "Expansion",
        "Empyrean",
        "Faith",
        "Fury",
        "Forms",
        "Gaia",
        "Hell",
        "Heaven",
        "Hymn",
        "Infinity",
        "Imperium",
        "Illuminati",
        "Illusion",
        "Justice",
        "Judgement",
        "Liturgy",
        "Law",
        "Menace",
        "Memory",
        "Nature",
        "Nightmares",
        "Order",
        "Paradise",
        "Progress",
        "Procedures",
        "Redemption",
        "Resurrection",
        "Reality",
        "Revenge",
        "Rebirth",
        "Ritual",
        "Rites",
        "Ruin",
        "Sacrament",
        "Stars",
        "State",
        "Songs",
        "Space",
        "Sorrow",
        "Symmetry",
        "Sky",
        "Tragedy",
        "Terror",
        "Trance",
        "Truth",
        "Universe",
        "Unification",
        "Victory",
        "Valhalla",
        "Whisper",
        "War",
    ];

    const concepts: string[] = [
        "Death",

        "Fury",
        "Force",

        "Fantasy",
        "Hymn",
        "History",
        "Liturgy",
        "Life",
        "Myth",

        "Memorial",
        "Paradise",

        "Pride",
        "Reign",
        "Supernova",
        "Song",
    ];

    const partB = [...wordThing, ...wordDoer, ...wordObject];

    if (roll(33)) {
        return `${arnd(wordDoer)} of ${arnd(wordObject)}`;
    }

    if (roll(25)) {
        return `${arnd(wordThing)} of ${arnd(wordObject)}`;
    }

    if (roll(15)) {
        return `${arnd(wordObject)} in ${arnd(wordAdjective)} ${arnd(wordObject)}`;
    }

    return `${arnd(wordAdjective)} ${arnd(partB)}`;
}

export { DATANEWSHIPS };

/*
Name types

{adj} {doer}

{doer} of {event}

{adj} {concept} {doer}

{concept} {event}



Dark Justicar
Last Victory

Doomed

Redeemer of Victory
Speaker of Dream

{adj} {doer}
{doer} of {event}

{adj} {concept}
{adj} {concept}




*/
