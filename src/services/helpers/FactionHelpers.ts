import { BASEACTIONPOINTCOUNT, FACTION_COLORS, FACTION_FONTS, FACTION_NAMES } from "../../configs";
import DATASHIPS from "../../data/dataShips";

import DATAUSERS from "../../data/dataUser.";
import { Command } from "../../models/Commands";
import { FactionModel, FactionState, GameModel, TechnologyField } from "../../models/Models";
import { ShipDesign } from "../../models/Units";
import { getActionPointCostOfCommands, getFactionActionPointPool } from "../../utils/commandUtils";
import { factionValues } from "../../utils/factionUtils";
import { arnd, arnds, prnd, rnd, shuffle } from "../../utils/randUtils";

const factionColors = shuffle(FACTION_COLORS);

const factNamePart1 = FACTION_NAMES[0];
const factNamePart2 = FACTION_NAMES[1];
const factNamePart3 = FACTION_NAMES[2];

const np1s = arnds(factNamePart1, 12, true);
const np2s = arnds(factNamePart2, 12, true);
const np3s = arnds(factNamePart3, 12, true);

let factionNoId = -1;

const players = [...DATAUSERS];

const factionFonts: string[] = shuffle(FACTION_FONTS);

export function getFactionFonts(): string[] {
    return factionFonts;
}


export function getColors(): string[] {
    return factionColors;
}

export function randomFactionName(): string {
    return `${arnd(factNamePart1)} ${arnd(factNamePart2)} ${arnd(factNamePart3)}`;
}

export function getFactionName() {
    factionNoId++;
    return `${np1s[factionNoId]} ${np2s[factionNoId]} ${np3s[factionNoId]}`;
}

export function createNewFaction(): FactionModel {
    const pl = players.shift();
    const ff = factionFonts.shift();
    
    const fm: FactionModel = {
        id: `faction-${rnd(1, 9999)}`,
        money: 3,
        technologyFields: [
            {field: TechnologyField.BIOLOGY, points: 0, priority: 0},
            {field: TechnologyField.MATERIAL, points: 0, priority: 0},
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
        technology: [],
        debt: 0,
        aps: BASEACTIONPOINTCOUNT,
    }



    return fm;
}


export function getFactionFromArrayById(factions: FactionModel[], id: string): FactionModel | undefined {
    return factions.find((fm: FactionModel) => fm.id === id);
}

export function getFactionByUserId(factions: FactionModel[], userId: string): FactionModel | undefined {
    return factions.find((fm: FactionModel) => fm.playerId === userId);
}

export function factionHasEnoughActionPoints(game: GameModel, faction: FactionModel, commands: Command[], command: Command) {
    
    const cmds = commands.filter((cmd: Command) => cmd.factionId === faction.id && cmd.turn === game.turn);
    const pool = getFactionActionPointPool(game, faction);
    const aps = getActionPointCostOfCommands(game, cmds);

    return (aps + command.actionPoints) <= pool;
}


export function factionCanDoMoreCommands(game: GameModel, commands: Command[], faction: FactionModel): boolean {
    // const game = joki.service.getState("GameService") as GameModel;
    const values = factionValues(game, faction.id);
    // const commands = joki.service.getState("CommandService") as Command[];
    const myCurrentCommands = commands.filter((cm: Command) => cm.factionId === faction.id && cm.completed === false);
    if(game.factionsReady.includes(faction.id)) return false;
    // const pool = getFactionActionPointPool(game, faction);
    // const aps = getActionPointCostOfCommands(myCurrentCommands);

    

    return myCurrentCommands.length < values.maxCommands;
}


export function getFactionShips(factionId: string): ShipDesign[] {
    return DATASHIPS;
}

