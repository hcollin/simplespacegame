import { SystemKeyword } from "./models/Models";


// Possible colors for the faction
const FACTION_COLORS: string[] = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4'];

// Possible fonts for the faction
const FACTION_FONTS: string[] = [
    "Impact",
    "Averia Serif Libre",
    "Bebas Neue",
    "Carter One",
    "Coda",
    "Fugaz One",
    "Piedra",
    "Righteous",
    "Staatliches",
    "Trade Winds",
    "Candara",
]

const FACTION_NAMES: string[][] = [
    ["Federation of", "Kingdom of", "Empire of", "Republic of", "Commonwealth of", "Tribe of", "Hive of", "Imperium of", "Clan of", "Culture of", "Theocracy of", "Barony of", "Democracy of", "Army of", "Consortium of", "Cohorts of", "Remnants of", "Oligarchy of", "Aristocracy of", "Tyranny of", "United States of", "Church of", "League of", "Protectorate of", "Colony of", "Alliance of", "Hegemony of", "Confederation of", "Matriarchy of", "Cult of", "Dynasty of", "Barony of", "Corporation of", "Nation of", "Duchy of"],
    ["Space", "Pirate", "Warrior", "Engineer", "Merchant", "Priest", "Soldier", "Peace", "Holy", "Unholy", "Ancient", "Future", "Bio", "Cyber", "Renegade", "Telepathic", "Magical", "Robotic", "Artificial", "Psychic", "Fanatic", "Conservative", "Liberal", "Nihilistic", "Chaos", "Multi Dimensional", "Flux", "Power", "Giant", "Ravenous", "World Eating", "Cannibalistic", "Occultist", "Death", "Turbo", "Spotted", "Angry", "Cunning", "Lounge", "Parasitic", "Necro"],
    ["Cats", "Dogs", "Turtles", "Wolves", "Lions", "Elephants", "Wasps", "Spiders", "Scorpions", "Parrots", "Eagles", "Reptiles", "Worms", "Serpents", "Ants", "Whales", "Octopuses", "Rhinos", "Sharks", "Gorillas", "Tigers", "Jaguars", "Hyenas", "Hamsters", "Rodents", "Baboons", "Bears", "Moose", "Deer", "Flies", "Owls", "Vultures", "Rabbits", "Kangaroos", "Penguins", "Dragons", "Horses", "Cows", "Pigs", "Sheep", "Chickens", "Giraffes", "Otters", "Medusas", "Fish", "Roaches", "Bugs"]
];


const MAPSizes: number[] = [66, 99, 132];
const MAPDensities: number[] = [15, 25, 35];

const SYSTEMBONUS: SystemKeyword[] = [SystemKeyword.MINERALRICH, SystemKeyword.MINERALRICH, SystemKeyword.MINERALPOOR, SystemKeyword.MINERALRARE, SystemKeyword.GAIA, SystemKeyword.ARTIFACTS, SystemKeyword.HOSTILE, SystemKeyword.NATIVES, SystemKeyword.NATIVES];


const PLAYERCOUNTS: number[] = [2,3,4,5,6,7,8];


const COMMANDPAGINATIONLIMIT: number = 5;


export { MAPSizes, MAPDensities, FACTION_COLORS, FACTION_FONTS, FACTION_NAMES, PLAYERCOUNTS, COMMANDPAGINATIONLIMIT, SYSTEMBONUS };