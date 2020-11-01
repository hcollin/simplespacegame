import { FactionModel, GameModel, GameState, SystemModel } from "../../models/Models";
import { SHIPCLASS, ShipUnit } from "../../models/Units";
import { inSameLocation } from "../../utils/locationUtils";
import { findClosestCoordinate } from "../../utils/MathUtils";
import { rnd } from "../../utils/randUtils";
import { createNewFaction } from "./FactionHelpers";
import { createRandomMap } from "./SystemHelpers";
import { createShipFromDesign, getDesignByName } from "./UnitHelpers";

export function createNewGame(playerCount = 4): GameModel {

    const stars = createRandomMap(playerCount * 18);

    const factions: FactionModel[] = [];
    while (factions.length < playerCount) {
        factions.push(createNewFaction());
    }

    const units: ShipUnit[] = [];

    // 8 players
    const searchPoints = playerCount > 4 ? [[12.5, 12.5], [50, 12.5], [87.5, 12.5], [12.5, 50], [87.5, 50], [12.5, 87.5], [50, 87.5], [87.5, 87.5]] : [[12.5, 12.5], [87.5, 12.5], [12.5, 87.5], [87.5, 87.5]];

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
        factions: factions,
        systems: stars,
        turn: 0,
        units: units,
        factionsReady: [],
        state: GameState.TURN,
        trades: [],
    };


    return game;
}


