import { joki } from "jokits-react";
import DATASHIPS from "../../data/dataShips";
import { TECHIDS } from "../../data/dataTechnology";
import DATAUSERS from "../../data/dataUser.";
import { Command } from "../../models/Commands";
import { FactionModel, FactionState, GameModel, TechnologyField } from "../../models/Models";
import { ShipDesign } from "../../models/Units";
import { factionValues } from "../../utils/factionUtils";
import { arnds, prnd, rnd, shuffle } from "../../utils/randUtils";


const factionColors = shuffle(['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4']);

const factNamePart1 = ["Federation of", "Kingdom of", "Empire of", "Republic of", "Commonwealth of", "Tribe of", "Hive of", "Imperium of", "Clan of", "Culture of", "Theocracy of", "Barony of", "Democracy of", "Army of", "Consortium of", "Cohorts of", "Remnants of", "Oligarchy of", "Aristocracy of", "Tyranny of", "United States of", "Church of", "League of", "Protectorate of", "Colony of", "Alliance of", "Hegemony of", "Confederation of", "Matriarchy of"];
const factNamePart2 = ["Space", "Pirate", "Warrior", "Engineer", "Merchant", "Priest", "Soldier", "Peace", "Holy", "Unholy", "Ancient", "Future", "Bio", "Cyber", "Renegade", "Telepathic", "Magical", "Robotic", "Artificial", "Psychic", "Fanatic", "Conservative", "Liberal", "Nihilistic", "Chaos", "Multi Dimensional", "Flux", "Power", "Giant", "Ravenous", "World Eating", "Cannibalistic", "Occultist", "Death", "Turbo", "Spotted", "Angry", "Cunning", "Lounge", "Parasitic", "Necro"];
const factNamePart3 = ["Cats", "Dogs", "Turtles", "Wolves", "Lions", "Elephants", "Wasps", "Spiders", "Scorpions", "Parrots", "Eagles", "Reptiles", "Worms", "Serpents", "Ants", "Whales", "Octopuses", "Rhinos", "Sharks", "Gorillas", "Tigers", "Jaguars", "Hyenas", "Hamsters", "Rodents", "Baboons", "Bears", "Moose", "Deer", "Flies", "Owls", "Vultures", "Rabbits", "Kangaroos", "Penguins", "Dragons", "Horses", "Cows", "Pigs", "Sheep", "Chickens", "Giraffes", "Otters", "Medusas", "Fish", "Roaches", "Bugs"];

const np1s = arnds(factNamePart1, 12, true);
const np2s = arnds(factNamePart2, 12, true);
const np3s = arnds(factNamePart3, 12, true);

let factionNoId = -1;

const players = [...DATAUSERS];

const fonts: string[] = shuffle([
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
]);

export function getFactionName() {
    factionNoId++;
    return `${np1s[factionNoId]} ${np2s[factionNoId]} ${np3s[factionNoId]}`;
}

export function createNewFaction(): FactionModel {
    const pl = players.shift();
    const ff = fonts.shift();
    
    const fm: FactionModel = {
        id: `faction-${rnd(1, 9999)}`,
        money: 3,
        technologyFields: [
            {field: TechnologyField.BIOLOGY, points: 0, priority: 0},
            {field: TechnologyField.SOCIOLOGY, points: 0, priority: 0},
            {field: TechnologyField.BUSINESS, points: 0, priority: 0},
            {field: TechnologyField.INFORMATION, points: 0, priority: 0},
            {field: TechnologyField.CHEMISTRY, points: 0, priority: 0},
            {field: TechnologyField.PHYSICS, points: 0, priority: 0},
        ],
        state: FactionState.PLAYING,
        name: getFactionName(),
        playerId: pl ? pl.id : "",
        color: factionColors.pop() || "#FFF",
        iconFileName: `abstract-${prnd(1,120)}.svg`,
        style: {
            fontFamily: ff || "Arial",
        },
        technology: [TECHIDS.EvasionEngine, TECHIDS.PredEvasion],

    }

    return fm;
}


export function getFactionById(factions: FactionModel[], id: string): FactionModel | undefined {
    return factions.find((fm: FactionModel) => fm.id === id);
}

export function getFactionByUserId(factions: FactionModel[], userId: string): FactionModel | undefined {
    return factions.find((fm: FactionModel) => fm.playerId === userId);
}


export function factionCanDoMoreCommands(faction: FactionModel): boolean {
    const game = joki.service.getState("GameService") as GameModel;
    const values = factionValues(game, faction.id);
    const commands = joki.service.getState("CommandService") as Command[];
    const myCommands = commands.filter((cm: Command) => cm.factionId === faction.id);
    return myCommands.length < values.maxCommands;
}


export function getFactionShips(factionId: string): ShipDesign[] {
    return DATASHIPS;
}

