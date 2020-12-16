import { FactionModel, GameModel, Coordinates, GameState } from "../../models/Models";
import { SystemModel } from "../../models/StarSystem";
import { ShipUnit } from "../../models/Units";
import { inSameLocation } from "../../utils/locationUtils";
import { findClosestCoordinate } from "../../utils/MathUtils";
import { shuffle } from "../../utils/randUtils";
import { getDistanceMultiplier, homeSystemPositionsByPlayerCount } from "../mapgenerator/mapGenerator";

export function startGame(game: GameModel): GameModel {
	// Find and set homesystem for each faction
	const coords = shuffle(homeSystemPositionsByPlayerCount[game.setup.playerCount]);

	const homeSystems: SystemModel[] = [];
	const units: ShipUnit[] = [];
	// const densityMultiplier = getDensityMultiplier(game.setup.density);
	const sizeCounter = getDistanceMultiplier(game.setup.distances);
	const starLocs = game.systems.map((s: SystemModel) => s.location);

	game.factions.forEach((fm: FactionModel, index: number) => {
		const targetCoord: Coordinates = {
			x: coords[index][0] * sizeCounter,
			y: coords[index][1] * sizeCounter,
		};
		const closestCoord = findClosestCoordinate(starLocs, targetCoord);
		const star = game.systems.find((s: SystemModel) => inSameLocation(s.location, closestCoord));
		if (star) {
			star.ownerFactionId = fm.id;
			star.welfare = 2;
			star.industry = 2;
			star.economy = 2;
			star.defense = 0;
			star.keywords = ["HOMEWORLD"];
			// const unit = createShipFromDesign(getDesignByName("Corvette"), fm.id, star.location);
			// units.push(unit);
			homeSystems.push(star);
		}
	});
	game.systems = game.systems.map((sm: SystemModel) => {
		const hm = homeSystems.find((hm: SystemModel) => hm.id === sm.id);
		return hm ? hm : sm;
	});
	return { ...game, units: units, state: GameState.TURN, turn: 1 };
}
