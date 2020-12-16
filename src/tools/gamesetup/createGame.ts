import { MAPDensities, MAPSizes } from "../../configs";
import { GameModel, GameState, PreGameSetup } from "../../models/Models";
import { createFactionFromSetup } from "../factionsetup/createFaction";
import { createRandomMap, getDistanceMultiplier, getStarCount } from "../mapgenerator/mapGenerator";


export function createGameFromSetup(setup: PreGameSetup): GameModel {
	// const densityMultiplier = getDensityMultiplier(setup.density);
	const sizeCounter = getDistanceMultiplier(setup.distances);
	const starCount = getStarCount(setup.density, setup.distances, setup.playerCount);

	const stars = createRandomMap(starCount, sizeCounter, setup.specials, setup.playerCount);

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
			specials: setup.specials,
			length: setup.length,
		},
		settings: {
			turnTimer: 0,
			discordWebHookUrl: setup.discordWebHook === "" ? null : setup.discordWebHook,
		},
		systems: stars,
		trades: [],
		turn: 0,
		units: [],
	};

	if (setup.autoJoin && setup.faction && setup.faction.playerId) {
		game.playerIds.push(setup.faction.playerId);

		const fm = createFactionFromSetup(setup.faction);
		game.factions.push(fm);
	}

	// Hard Coded url for #peliprokkis channel on our discard. This needs to be configurable in the future (and very near future)
	// game.settings.discordWebHookUrl = "https://discordapp.com/api/webhooks/784122350777925642/UjbjOnDI02hnEB1qG8RJt-9Zc6zIE3X7ZLTdGz93a3-80sxg4uK00jhw3t-SceH9n8Ce";

	return game;
}



