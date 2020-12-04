"use strict";
exports.__esModule = true;
var SystemModel_1 = require("./models/SystemModel");
// Possible colors for the faction
var FACTION_COLORS = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4'];
exports.FACTION_COLORS = FACTION_COLORS;
// Possible fonts for the faction
var FACTION_FONTS = [
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
];
exports.FACTION_FONTS = FACTION_FONTS;
var FACTION_NAMES = [
    ["Federation of", "Kingdom of", "Empire of", "Republic of", "Commonwealth of", "Tribe of", "Hive of", "Imperium of", "Clan of", "Culture of", "Theocracy of", "Barony of", "Democracy of", "Army of", "Consortium of", "Cohorts of", "Remnants of", "Oligarchy of", "Aristocracy of", "Tyranny of", "United States of", "Church of", "League of", "Protectorate of", "Colony of", "Alliance of", "Hegemony of", "Confederation of", "Matriarchy of", "Cult of", "Dynasty of", "Barony of", "Corporation of", "Nation of", "Duchy of"],
    ["Space", "Pirate", "Warrior", "Engineer", "Merchant", "Priest", "Soldier", "Peace", "Holy", "Unholy", "Ancient", "Future", "Bio", "Cyber", "Renegade", "Telepathic", "Magical", "Robotic", "Artificial", "Psychic", "Fanatic", "Conservative", "Liberal", "Nihilistic", "Chaos", "Multi Dimensional", "Flux", "Power", "Giant", "Ravenous", "World Eating", "Cannibalistic", "Occultist", "Death", "Turbo", "Spotted", "Angry", "Cunning", "Lounge", "Parasitic", "Necro"],
    ["Cats", "Dogs", "Turtles", "Wolves", "Lions", "Elephants", "Wasps", "Spiders", "Scorpions", "Parrots", "Eagles", "Reptiles", "Worms", "Serpents", "Ants", "Whales", "Octopuses", "Rhinos", "Sharks", "Gorillas", "Tigers", "Jaguars", "Hyenas", "Hamsters", "Rodents", "Baboons", "Bears", "Moose", "Deer", "Flies", "Owls", "Vultures", "Rabbits", "Kangaroos", "Penguins", "Dragons", "Horses", "Cows", "Pigs", "Sheep", "Chickens", "Giraffes", "Otters", "Medusas", "Fish", "Roaches", "Bugs"]
];
exports.FACTION_NAMES = FACTION_NAMES;
var MAPSizes = [66, 99, 132];
exports.MAPSizes = MAPSizes;
var MAPDensities = [15, 25, 35];
exports.MAPDensities = MAPDensities;
var SYSTEMBONUS = [SystemModel_1.SystemKeyword.MINERALRICH, SystemModel_1.SystemKeyword.MINERALRICH, SystemModel_1.SystemKeyword.MINERALPOOR, SystemModel_1.SystemKeyword.MINERALRARE, SystemModel_1.SystemKeyword.GAIA, SystemModel_1.SystemKeyword.ARTIFACTS, SystemModel_1.SystemKeyword.HOSTILE, SystemModel_1.SystemKeyword.NATIVES, SystemModel_1.SystemKeyword.NATIVES];
exports.SYSTEMBONUS = SYSTEMBONUS;
var PLAYERCOUNTS = [2, 3, 4, 5, 6, 7, 8];
exports.PLAYERCOUNTS = PLAYERCOUNTS;
var COMMANDPAGINATIONLIMIT = 5;
exports.COMMANDPAGINATIONLIMIT = COMMANDPAGINATIONLIMIT;
var BASEACTIONPOINTCOUNT = 3;
exports.BASEACTIONPOINTCOUNT = BASEACTIONPOINTCOUNT;
