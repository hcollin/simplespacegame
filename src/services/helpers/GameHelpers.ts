import { FactionModel, GameModel, UnitModel } from "../../models/Models";
import { rnd } from "../../utils/randUtils";
import { createNewFaction } from "./FactionHelpers";
import { createRandomMap } from "./SystemHelpers";
import { createUnitFromShip } from "./UnitHelpers";

export function createNewGame(playerCount = 6): GameModel {

    const stars = createRandomMap(playerCount*33);

    const factions: FactionModel[] = [];
    while(factions.length < playerCount) {
        factions.push(createNewFaction());
    }


    const units: UnitModel[] = [];

    factions.forEach((fm: FactionModel, index: number) => {
        stars[index].ownerFactionId = fm.id;
        stars[index].welfare = 2;
        stars[index].industry = 2;
        stars[index].economy = 2;
        stars[index].defense = 1;

        const unit = createUnitFromShip("Corvette", fm.id, stars[index].location);
        units.push(unit);

    });
    
    const game: GameModel = {
        id: `game-${rnd(1, 9999)}`,
        factions: factions,
        systems: stars,
        turn: 0,
        units: units,
    };


    return game;
}


