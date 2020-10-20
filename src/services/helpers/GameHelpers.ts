import { FactionModel, GameModel } from "../../models/Models";
import { rnd } from "../../utils/randUtils";
import { createNewFaction } from "./FactionHelpers";
import { createRandomMap } from "./SystemHelpers";

export function createNewGame(playerCount = 6): GameModel {

    const stars = createRandomMap(playerCount*33);

    const factions: FactionModel[] = [];
    while(factions.length < playerCount) {
        factions.push(createNewFaction());
    }

    factions.forEach((fm: FactionModel, index: number) => {
        stars[index].ownerFactionId = fm.id;
    });
    
    const game: GameModel = {
        id: `game-${rnd(1, 9999)}`,
        factions: factions,
        systems: stars,
        turn: 0,
        units: []
    };


    return game;
}


