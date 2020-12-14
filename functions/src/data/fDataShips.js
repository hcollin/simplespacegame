"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fUnits_1 = require("../models/fUnits");
var fRandUtils_1 = require("../utils/fRandUtils");
var SHIPENGINEIDS;
(function (SHIPENGINEIDS) {
    SHIPENGINEIDS["NoEngine"] = "No FTL Engine";
    SHIPENGINEIDS["EngineIon"] = "Ion Engine";
    SHIPENGINEIDS["EngineSail"] = "Solar Wind Sails";
    SHIPENGINEIDS["FusionDrive"] = "Fusion Drive";
    SHIPENGINEIDS["SubLightEngine"] = "SubLight Engine";
    SHIPENGINEIDS["WarpEngine"] = "Warp Drive";
})(SHIPENGINEIDS = exports.SHIPENGINEIDS || (exports.SHIPENGINEIDS = {}));
var DATASHIPENGINES = [
    {
        id: SHIPENGINEIDS.EngineIon,
        name: "Ion Engine",
        range: 10,
        speed: 5,
        agility: 0,
        part: {
            notAvailableInClasses: [],
            points: 1,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
    {
        id: SHIPENGINEIDS.FusionDrive,
        name: "Fusion Drive",
        range: 20,
        speed: 7,
        agility: 10,
        part: {
            notAvailableInClasses: [],
            points: 3,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
    {
        id: SHIPENGINEIDS.EngineSail,
        name: "Solar Wind Sails",
        range: 40,
        speed: 2,
        agility: -20,
        part: {
            notAvailableInClasses: [],
            points: 2,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
    {
        id: SHIPENGINEIDS.WarpEngine,
        name: "Warp Drive",
        range: 15,
        speed: 15,
        agility: 0,
        part: {
            notAvailableInClasses: [],
            points: 5,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
    {
        id: SHIPENGINEIDS.SubLightEngine,
        name: "System Engine",
        range: 0,
        speed: 0,
        agility: 30,
        part: {
            notAvailableInClasses: [],
            points: 1,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
    {
        id: SHIPENGINEIDS.NoEngine,
        name: "Stationary",
        range: 0,
        speed: 0,
        agility: -100,
        part: {
            notAvailableInClasses: [],
            points: 0,
            slot: fUnits_1.ShipPartSlot.ENGINE,
            techPreReq: null
        }
    },
];
exports.DATASHIPENGINES = DATASHIPENGINES;
var SHIPWEAPONSPECIAL;
(function (SHIPWEAPONSPECIAL) {
    SHIPWEAPONSPECIAL["DOUBLESHOT"] = "Double Shot (x2)";
    SHIPWEAPONSPECIAL["RAPIDFIRE"] = "Rapid Fire (x3)";
    SHIPWEAPONSPECIAL["HAILOFFIRE"] = "Hail of Fire (x4)";
    SHIPWEAPONSPECIAL["ARMOURPIERCE"] = "Armour piercing";
    SHIPWEAPONSPECIAL["BURN"] = "Burning";
    SHIPWEAPONSPECIAL["EMP"] = "EMP Strike";
    SHIPWEAPONSPECIAL["ANTIFIGHTER"] = "Antifighter weapon";
    SHIPWEAPONSPECIAL["AITARGETING"] = "AI Targeting";
})(SHIPWEAPONSPECIAL = exports.SHIPWEAPONSPECIAL || (exports.SHIPWEAPONSPECIAL = {}));
var DATASHIPWEAPONS = [
    {
        id: "",
        name: "Point Defense Gun",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 0,
        cooldown: 0,
        cooldownTime: 0,
        damage: [4, 6],
        special: [SHIPWEAPONSPECIAL.ANTIFIGHTER],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE, fUnits_1.SHIPCLASS.FRIGATE],
            points: 5,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Anti-Fighter Laser",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 10,
        cooldown: 0,
        cooldownTime: 0,
        damage: [2, 8],
        special: [SHIPWEAPONSPECIAL.ANTIFIGHTER],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE],
            points: 7,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Small Laser",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 90,
        cooldown: 0,
        cooldownTime: 0,
        damage: [2, 6],
        special: [SHIPWEAPONSPECIAL.DOUBLESHOT],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.CRUISER, fUnits_1.SHIPCLASS.BATTLESHIP],
            points: 3,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Rapid Laser",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 80,
        cooldown: 0,
        cooldownTime: 0,
        damage: [4, 10],
        special: [SHIPWEAPONSPECIAL.RAPIDFIRE],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.FIGHTER,
                fUnits_1.SHIPCLASS.PATROL,
                fUnits_1.SHIPCLASS.CORVETTE,
                fUnits_1.SHIPCLASS.FRIGATE,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.CRUISER,
                fUnits_1.SHIPCLASS.BATTLESHIP,
            ],
            points: 5,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Laser Turret",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 70,
        cooldown: 0,
        cooldownTime: 0,
        damage: [15, 20],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL],
            points: 4,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Large Laser",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 70,
        cooldown: 0,
        cooldownTime: 0,
        damage: [20, 30],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.FRIGATE,
                fUnits_1.SHIPCLASS.PATROL,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.CRUISER,
                fUnits_1.SHIPCLASS.BATTLESHIP,
            ],
            points: 7,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Turbo Laser",
        type: fUnits_1.WEAPONTYPE.ENERGY,
        accuracy: 70,
        cooldown: 0,
        cooldownTime: 0,
        damage: [7, 14],
        special: [SHIPWEAPONSPECIAL.HAILOFFIRE],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE, fUnits_1.SHIPCLASS.FRIGATE],
            points: 14,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Machinegun",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 50,
        cooldown: 0,
        cooldownTime: 1,
        damage: [2, 5],
        special: [SHIPWEAPONSPECIAL.HAILOFFIRE],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.FRIGATE,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.CRUISER,
                fUnits_1.SHIPCLASS.BATTLESHIP,
            ],
            points: 2,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Small Railgun",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 55,
        cooldown: 0,
        cooldownTime: 0,
        damage: [10, 15],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL],
            points: 7,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Large Railgun",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 45,
        cooldown: 0,
        cooldownTime: 0,
        damage: [20, 30],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE],
            points: 14,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Mass Cannon",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 60,
        cooldown: 0,
        cooldownTime: 1,
        damage: [40, 50],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE, fUnits_1.SHIPCLASS.FRIGATE],
            points: 20,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Mega Cannon",
        type: fUnits_1.WEAPONTYPE.KINETIC,
        accuracy: 50,
        cooldown: 0,
        cooldownTime: 2,
        damage: [70, 80],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.FIGHTER,
                fUnits_1.SHIPCLASS.PATROL,
                fUnits_1.SHIPCLASS.CORVETTE,
                fUnits_1.SHIPCLASS.FRIGATE,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.CARRIER,
            ],
            points: 30,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Homing Missile",
        type: fUnits_1.WEAPONTYPE.MISSILE,
        accuracy: 90,
        cooldown: 0,
        cooldownTime: 3,
        damage: [30, 40],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [fUnits_1.SHIPCLASS.FIGHTER, fUnits_1.SHIPCLASS.PATROL, fUnits_1.SHIPCLASS.CORVETTE],
            points: 10,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Rockets",
        type: fUnits_1.WEAPONTYPE.MISSILE,
        accuracy: 60,
        cooldown: 0,
        cooldownTime: 1,
        damage: [20, 25],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.FIGHTER,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.CARRIER,
                fUnits_1.SHIPCLASS.CRUISER,
                fUnits_1.SHIPCLASS.BATTLESHIP,
            ],
            points: 7,
            techPreReq: null
        }
    },
    {
        id: "",
        name: "Fighter Missile",
        type: fUnits_1.WEAPONTYPE.MISSILE,
        accuracy: 80,
        cooldown: 2,
        cooldownTime: 10,
        damage: [30, 40],
        special: [],
        part: {
            slot: fUnits_1.ShipPartSlot.WEAPON,
            notAvailableInClasses: [
                fUnits_1.SHIPCLASS.CORVETTE,
                fUnits_1.SHIPCLASS.FRIGATE,
                fUnits_1.SHIPCLASS.CRUISER,
                fUnits_1.SHIPCLASS.DESTROYER,
                fUnits_1.SHIPCLASS.BATTLESHIP,
                fUnits_1.SHIPCLASS.CARRIER,
                fUnits_1.SHIPCLASS.PATROL,
            ],
            points: 1,
            techPreReq: null
        }
    },
];
exports.DATASHIPWEAPONS = DATASHIPWEAPONS;
// [SHIPCLASS.FIGHTER, SHIPCLASS.PATROL, SHIPCLASS.CORVETTE, SHIPCLASS.FRIGATE, SHIPCLASS.CARRIER, SHIPCLASS.DESTROYER, SHIPCLASS.CRUISER, SHIPCLASS.BATTLESHIP]
function getWeaponByName(name) {
    var w = DATASHIPWEAPONS.find(function (w) { return w.name === name; });
    if (!w)
        throw new Error("Unknown weapon " + name);
    return __assign(__assign({}, w), { id: "W-" + fRandUtils_1.rnd(100000, 999999) + "-" + Date.now() });
}
var DATANEWSHIPS = [
    {
        id: "",
        typeClassName: "Fighter",
        sizeIndicator: 1,
        type: fUnits_1.SHIPCLASS.FIGHTER,
        name: "Fighter",
        cost: 0,
        buildTime: 0,
        minIndustry: 0,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 0,
        speed: 0,
        agility: 80,
        armor: 0,
        hull: 15,
        shieldRegeneration: 0,
        shieldsMax: 0,
        keywords: [],
        weapons: [getWeaponByName("Small Laser"), getWeaponByName("Fighter Missile")],
        description: "One man fighter craft that does not have warp capability in itself. Fighters cannot be built on systems they are automatically deployed during combet and new fighters are built on friendly systems autamatically during repairs."
    },
    {
        id: "",
        typeClassName: "Patrol Boat",
        sizeIndicator: 1,
        type: fUnits_1.SHIPCLASS.PATROL,
        name: "Patrol Boat",
        cost: 2,
        buildTime: 1,
        minIndustry: 1,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 0,
        speed: 5,
        agility: 70,
        armor: 0,
        hull: 40,
        shieldRegeneration: 0,
        shieldsMax: 0,
        keywords: [],
        weapons: [getWeaponByName("Small Laser"), getWeaponByName("Machinegun")],
        description: "Small patrol boat used mainly used for bulking up the defenses against fighters or for really cash stripped empires."
    },
    {
        id: "",
        typeClassName: "Corvette",
        sizeIndicator: 3,
        type: fUnits_1.SHIPCLASS.CORVETTE,
        name: "Corvette",
        cost: 3,
        buildTime: 2,
        minIndustry: 1,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 1,
        speed: 6,
        agility: 50,
        armor: 1,
        hull: 75,
        shieldRegeneration: 0,
        shieldsMax: 0,
        keywords: [],
        weapons: [
            getWeaponByName("Laser Turret"),
        ],
        description: "Small, cheap and cheerful ship. Mainly used to bulk up the numbers in fleets and for reconnaissance in lesser empires."
    },
    {
        id: "",
        typeClassName: "Frigate",
        sizeIndicator: 4,
        type: fUnits_1.SHIPCLASS.FRIGATE,
        name: "Frigate",
        cost: 6,
        buildTime: 4,
        minIndustry: 2,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 1,
        speed: 5,
        agility: 40,
        armor: 3,
        hull: 110,
        shieldRegeneration: 3,
        shieldsMax: 10,
        keywords: [],
        weapons: [getWeaponByName("Rapid Laser"), getWeaponByName("Rapid Laser"), getWeaponByName("Small Railgun")],
        description: ""
    },
    {
        id: "",
        typeClassName: "Destroyer",
        sizeIndicator: 4,
        type: fUnits_1.SHIPCLASS.DESTROYER,
        name: "Destroyer",
        cost: 12,
        buildTime: 4,
        minIndustry: 3,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 1,
        speed: 5,
        agility: 35,
        armor: 4,
        hull: 130,
        shieldRegeneration: 5,
        shieldsMax: 20,
        keywords: [],
        weapons: [
            getWeaponByName("Anti-Fighter Laser"),
            getWeaponByName("Anti-Fighter Laser"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Large Railgun"),
        ],
        description: ""
    },
    {
        id: "",
        typeClassName: "Invasion Destroyer",
        sizeIndicator: 4,
        type: fUnits_1.SHIPCLASS.DESTROYER,
        name: "Invader",
        cost: 16,
        buildTime: 3,
        minIndustry: 3,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 3,
        speed: 5,
        agility: 30,
        armor: 3,
        hull: 140,
        shieldRegeneration: 5,
        shieldsMax: 25,
        keywords: ["BOMBARDMENT"],
        weapons: [getWeaponByName("Laser Turret")],
        description: "Destroyer sized unit specialized in invasion with ability to bombard the planet and large troop carrying capacity"
    },
    {
        id: "",
        typeClassName: "Light Cruiser",
        sizeIndicator: 5,
        type: fUnits_1.SHIPCLASS.CRUISER,
        name: "Light Cruiser",
        cost: 20,
        buildTime: 5,
        minIndustry: 3,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 2,
        speed: 5,
        agility: 40,
        armor: 3,
        hull: 160,
        shieldRegeneration: 8,
        shieldsMax: 40,
        keywords: [],
        weapons: [
            getWeaponByName("Point Defense Gun"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Mass Cannon"),
            getWeaponByName("Homing Missile"),
        ],
        description: ""
    },
    {
        id: "",
        typeClassName: "Small Carrier",
        sizeIndicator: 5,
        type: fUnits_1.SHIPCLASS.CARRIER,
        name: "Small Carrier",
        cost: 24,
        buildTime: 5,
        minIndustry: 2,
        techReq: [],
        fighters: 4,
        fightersMax: 4,
        troops: 0,
        speed: 5,
        agility: 30,
        armor: 2,
        hull: 180,
        shieldRegeneration: 8,
        shieldsMax: 40,
        keywords: [],
        weapons: [getWeaponByName("Laser Turret"), getWeaponByName("Laser Turret")],
        description: ""
    },
    {
        id: "",
        typeClassName: "Heavy Cruiser",
        sizeIndicator: 5,
        type: fUnits_1.SHIPCLASS.CRUISER,
        name: "Heavy Cruiser",
        cost: 28,
        buildTime: 5,
        minIndustry: 3,
        techReq: [],
        fighters: 0,
        fightersMax: 0,
        troops: 3,
        speed: 5,
        agility: 40,
        armor: 5,
        hull: 190,
        shieldRegeneration: 8,
        shieldsMax: 45,
        keywords: [],
        weapons: [
            getWeaponByName("Point Defense Gun"),
            getWeaponByName("Large Laser"),
            getWeaponByName("Large Laser"),
            getWeaponByName("Small Railgun"),
            getWeaponByName("Homing Missile"),
            getWeaponByName("Homing Missile"),
        ],
        description: ""
    },
    {
        id: "",
        typeClassName: "Battle Cruiser",
        sizeIndicator: 6,
        type: fUnits_1.SHIPCLASS.CRUISER,
        name: "Battle Cruiser",
        cost: 35,
        buildTime: 6,
        minIndustry: 5,
        techReq: [],
        fighters: 2,
        fightersMax: 2,
        troops: 3,
        speed: 5,
        agility: 35,
        armor: 8,
        hull: 230,
        shieldRegeneration: 10,
        shieldsMax: 60,
        keywords: [],
        weapons: [
            getWeaponByName("Point Defense Gun"),
            getWeaponByName("Point Defense Gun"),
            getWeaponByName("Point Defense Gun"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Laser Turret"),
            getWeaponByName("Homing Missile"),
            getWeaponByName("Mega Cannon"),
        ],
        description: ""
    },
];
exports.DATANEWSHIPS = DATANEWSHIPS;
var DATASHIPS = DATANEWSHIPS;
exports["default"] = DATASHIPS;
function shipNameGenerator() {
    var wordAdjective = [
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
    var wordDoer = [
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
    // const wordColor: string[] = ["Black", "White", "Gray", "Red", "Blue", "Green", "Yellow", "Purple", "Brown"];
    // const wordTimeAdjective: string[] = ["Ancient", "First", "Last", "New", "Old", "Young"];
    // const wordDescriptive: string[] = [
    //     "Ancient",
    //     "Death",
    //     "Dread",
    //     "Dark",
    //     "Fury",
    //     "Ghost",
    //     "Life",
    //     "Necro",
    //     "Phantom",
    //     "Spectre",
    //     "Umbra",
    //     "True",
    // ];
    var wordThing = [
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
    var wordObject = [
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
    // const concepts: string[] = [
    //     "Death",
    //     "Fury",
    //     "Force",
    //     "Fantasy",
    //     "Hymn",
    //     "History",
    //     "Liturgy",
    //     "Life",
    //     "Myth",
    //     "Memorial",
    //     "Paradise",
    //     "Pride",
    //     "Reign",
    //     "Supernova",
    //     "Song",
    // ];
    var partB = __spreadArrays(wordThing, wordDoer, wordObject);
    if (fRandUtils_1.roll(33)) {
        return fRandUtils_1.arnd(wordDoer) + " of " + fRandUtils_1.arnd(wordObject);
    }
    if (fRandUtils_1.roll(25)) {
        return fRandUtils_1.arnd(wordThing) + " of " + fRandUtils_1.arnd(wordObject);
    }
    if (fRandUtils_1.roll(15)) {
        return fRandUtils_1.arnd(wordObject) + " in " + fRandUtils_1.arnd(wordAdjective) + " " + fRandUtils_1.arnd(wordObject);
    }
    return fRandUtils_1.arnd(wordAdjective) + " " + fRandUtils_1.arnd(partB);
}
exports.shipNameGenerator = shipNameGenerator;
function shipClassNameGenerator(cls) {
    var classNames = [
        "Argument",
        "Annihilator",
        "Bolero",
        "Brigadier",
        "Cosmos",
        "Commander",
        "Constitution",
        "Elegant",
        "Elegy",
        "Fortress",
        "Fantasy",
        "Gracious",
        "General",
        "Hero",
        "Humility",
        "Invader",
        "Intrigue",
        "Innuendo",
        "Imperial",
        "Javelin",
        "Jester",
        "Killer",
        "Kolibri",
        "Lawbraker",
        "Lenient",
        "Lightbringer",
        "Master",
        "Miracle",
        "Nova",
        "Nebula",
        "Orion",
        "Oliargh",
        "Odin",
        "Pestilence",
        "Pillar",
        "Quantum",
        "Quest",
        "Quasar",
        "Radiant",
        "Ripper",
        "Relinquish",
        "Starship",
        "Silhuette",
        "Silver",
        "Tormentor",
        "Terminator",
        "Tiamat",
        "Universe",
        "Ulysses",
        "Victory",
        "Vindicator",
        "Warhammer",
        "Wisdom",
        "Xenophobe",
        "Yggdrasil",
        "Zodiac",
    ];
    return fRandUtils_1.arnd(classNames);
}
exports.shipClassNameGenerator = shipClassNameGenerator;
