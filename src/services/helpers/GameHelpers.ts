import { FactionModel, GameModel, GameSetup, GameState, PreGameSetup, SystemModel } from "../../models/Models";
import { ShipUnit } from "../../models/Units";
import { inSameLocation } from "../../utils/locationUtils";
import { findClosestCoordinate } from "../../utils/MathUtils";
import { arnd, rnd, shuffle } from "../../utils/randUtils";
import { createFactionFromSetup, createNewFaction } from "./FactionHelpers";
import { createRandomMap } from "./SystemHelpers";
import { createShipFromDesign, getDesignByName } from "./UnitHelpers";

const SIZES: number[] = [66, 99, 132];
const DENSITIES: number[] = [10, 18, 24];

export function createGameFromSetup(setup: PreGameSetup): GameModel {
    const densityMultiplier =
        setup.density === "LOW" ? DENSITIES[0] : setup.density === "DENSE" ? DENSITIES[2] : DENSITIES[1];
    const sizeCounter = setup.distances === "SHORT" ? SIZES[0] : setup.distances === "LONG" ? SIZES[2] : SIZES[1];
    const stars = createRandomMap(setup.playerCount * densityMultiplier, sizeCounter);

    const game: GameModel = {
        id: "",
        factions: [],
        factionsReady: [],
        name: setup.name,
        playerIds: [],
        state: GameState.OPEN,
        setup: {
            density: setup.density,
            distances: setup.distances,
            playerCount: setup.playerCount,
        },
        systems: stars,
        trades: [],
        turn: 0,
        units: [],
    };

    if (setup.autoJoin && setup.faction) {
        game.playerIds.push(setup.faction.playerId);
        game.factions.push(createFactionFromSetup(setup.faction));
    }

    return game;
}

// 0 1 2
// 3 4 5
// 6 7 8

export function setHomeSystems(game: GameModel): GameModel {
    const size = game.setup.distances === "SHORT" ? SIZES[0] : game.setup.distances === "LONG" ? SIZES[2] : SIZES[1];
    const slotSize = size / 3;

    const slots: [number, number][] = [];
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            const sx = x * slotSize + slotSize / 2;
            const sy = y * slotSize + slotSize / 2;
            slots.push([sx, sy]);
        }
    }

    let slotIndexes: number[] = [];
    switch (game.setup.playerCount) {
        case 4:
            slotIndexes = shuffle([1, 3, 5, 7]);
            break;
        case 6:
            slotIndexes = shuffle([0, 1, 2, 6, 7, 8]);
            break;
        case 8:
            slotIndexes = shuffle([0, 1, 2, 3, 4, 6, 7, 8]);
            break;
    }

    const starLocs = game.systems.filter((s: SystemModel) => s.ringWorld !== true).map((s: SystemModel) => s.location);

    const units: ShipUnit[] = [];
    const homeSystems: SystemModel[] = [];
    game.factions.forEach((fm: FactionModel, index: number) => {
        const slot = slots[slotIndexes[index]];
        const closestCoord = findClosestCoordinate(starLocs, { x: slot[0], y: slot[1] });
        const star = game.systems.find((s: SystemModel) => inSameLocation(s.location, closestCoord));
        if (star) {
            star.ownerFactionId = fm.id;
            star.welfare = 2;
            star.industry = 2;
            star.economy = 2;
            star.defense = 0;
            star.keywords.push("HOMEWORLD");
            const unit = createShipFromDesign(getDesignByName("Corvette"), fm.id, star.location);
            units.push(unit);
            homeSystems.push(star);
        }
    });


    game.systems = game.systems.map((sm: SystemModel) => {
        const homeSystem = homeSystems.find((hm: SystemModel) => hm.id === sm.id);
        return homeSystem ? homeSystem : sm;
    });
    game.units = units;

    return { ...game };
}

export function createNewGame(playerCount = 4): GameModel {
    const stars = createRandomMap(playerCount * 18);

    const factions: FactionModel[] = [];
    while (factions.length < playerCount) {
        factions.push(createNewFaction());
    }

    const units: ShipUnit[] = [];

    // 8 players
    const searchPoints =
        playerCount > 4
            ? [
                  [12.5, 12.5],
                  [50, 12.5],
                  [87.5, 12.5],
                  [12.5, 50],
                  [87.5, 50],
                  [12.5, 87.5],
                  [50, 87.5],
                  [87.5, 87.5],
              ]
            : [
                  [12.5, 12.5],
                  [87.5, 12.5],
                  [12.5, 87.5],
                  [87.5, 87.5],
              ];
    const starLocs = stars.filter((s: SystemModel) => s.ringWorld !== true).map((s: SystemModel) => s.location);
    factions.forEach((fm: FactionModel, index: number) => {
        const closestCoord = findClosestCoordinate(starLocs, { x: searchPoints[index][0], y: searchPoints[index][1] });

        const star = stars.find((s: SystemModel) => inSameLocation(s.location, closestCoord));

        if (star) {
            star.ownerFactionId = fm.id;
            star.welfare = 2;
            star.industry = 2;
            star.economy = 2;
            star.defense = 0;
            star.keywords.push("HOMEWORLD");
            const unit = createShipFromDesign(getDesignByName("Corvette"), fm.id, star.location);
            units.push(unit);
        }

        // stars[index].ownerFactionId = fm.id;
        // stars[index].welfare = 2;
        // stars[index].industry = 2;
        // stars[index].economy = 2;
        // stars[index].defense = 1;
    });

    const game: GameModel = {
        id: `game-${rnd(1, 9999)}`,
        setup: {
            playerCount: 4,
            density: "MEDIUM",
            distances: "MEDIUM",
        },
        name: randomGameName(),
        factions: factions,
        systems: stars,
        turn: 0,
        units: units,
        factionsReady: [],
        state: GameState.TURN,
        trades: [],
        playerIds: factions.map((f: FactionModel) => f.playerId),
    };

    return game;
}

const gn1 = ["War", "Conflict", "Chaos", "Dawn", "Dusk", "The End of", "Space"];
const gn2 = ["Stars", "Imperiums", "Empires", "Races", "Time", "Era"];

export function randomGameName(): string {
    return `${arnd(gn1)} ${arnd(gn2)}`;
}
