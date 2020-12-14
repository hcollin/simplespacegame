import { settings } from "cluster";
import { v4 } from "uuid";
import { BASEACTIONPOINTCOUNT, MAPDensities, MAPSizes } from "../../configs";

import { Coordinates, FactionModel, FactionSetup, FactionState, GameModel, GameState, PreGameSetup, TechnologyField } from "../../models/Models";
import { SystemModel } from "../../models/StarSystem";
import { ShipUnit } from "../../models/Units";
import { inSameLocation } from "../../utils/locationUtils";
import { findClosestCoordinate } from "../../utils/MathUtils";
import { arnd, rnd, shuffle } from "../../utils/randUtils";
import { createNewFaction } from "./FactionHelpers";

import { createRandomMap } from "./SystemHelpers";
import { createShipFromDesign, getDesignByName } from "./UnitHelpers";

export function getDensityMultiplier(density: string): number {
	return density === "LOW" ? MAPDensities[0] : density === "HIGH" ? MAPDensities[2] : MAPDensities[1];
}

export function getDistanceMultiplier(distance: string): number {
	return distance === "SHORT" ? MAPSizes[0] : distance === "LONG" ? MAPSizes[2] : MAPSizes[1];
}

export function getSpecialChances(special: string): number {
	switch (special) {
		case "NONE":
			return 0;
		case "RARE":
			return 15;
		case "AVERAGE":
			return 50;
		case "COMMON":
			return 75;
		case "ALL":
			return 100;
		default:
			return 40;
	}
}

/**
 * How many stars are in the map
 *
 * size  = how long is the side of the square
 * density = stars per 1000 slots which is (size/2)^2
 *
 *
 * @param density
 * @param distance
 * @param playerCount
 */
export function getStarCount(density: string, distance: string, playerCount: number) {
	const densityMultiplier = getDensityMultiplier(density);
	const sizeCounter = getDistanceMultiplier(distance);
	const dens = Math.pow(sizeCounter / 2, 2);
	const plPlus = (Math.round((playerCount * 2) / 5) + 1) * playerCount;
	console.log(densityMultiplier, sizeCounter, playerCount, dens);
	return Math.round((dens / 1000) * densityMultiplier + plPlus + 10);
	// return playerCount * densityMultiplier * (sizeCounter/MAPSizes[1]);
}

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

const gn1 = ["War", "Conflict", "Chaos", "Dawn", "Dusk", "The End of", "Space"];
const gn2 = ["Stars", "Imperiums", "Empires", "Races", "Time", "Era"];

export function randomGameName(): string {
	return `${arnd(gn1)} ${arnd(gn2)}`;
}

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
			const unit = createShipFromDesign(getDesignByName("Corvette"), fm.id, star.location);
			units.push(unit);
			homeSystems.push(star);
		}
	});
	game.systems = game.systems.map((sm: SystemModel) => {
		const hm = homeSystems.find((hm: SystemModel) => hm.id === sm.id);
		return hm ? hm : sm;
	});
	return { ...game, units: units, state: GameState.TURN, turn: 1 };
}

export function createFactionFromSetup(setup: FactionSetup): FactionModel {
	const fm: FactionModel = {
		id: v4(),
		money: 3,
		technologyFields: [
			{ field: TechnologyField.BIOLOGY, points: 0, priority: 0 },
			{ field: TechnologyField.MATERIAL, points: 0, priority: 0 },
			// { field: TechnologyField.BUSINESS, points: 0, priority: 0 },
			{ field: TechnologyField.INFORMATION, points: 0, priority: 0 },
			{ field: TechnologyField.CHEMISTRY, points: 0, priority: 0 },
			{ field: TechnologyField.PHYSICS, points: 0, priority: 0 },
		],
		state: FactionState.PLAYING,
		name: setup.name,
		playerId: setup.playerId,
		color: setup.color,
		iconFileName: setup.iconFileName,
		style: {
			fontFamily: setup.fontFamily,
		},
		technology: [],
		debt: 0,
		aps: BASEACTIONPOINTCOUNT,
		shipDesigns: [],
	};

	return fm;
}

const homeSystemPositionsByPlayerCount: [number, number][][] = [
	[],
	[[0.5, 0.5]],
	[
		[0.3, 0.3],
		[0.7, 0.7],
	],
	[
		[0.25, 0.3],
		[0.75, 0.3],
		[0.5, 0.733],
	],
	[
		[0.25, 0.25],
		[0.75, 0.25],
		[0.75, 0.75],
		[0.25, 0.75],
	],
	[
		[0.5, 0.2],
		[0.15, 0.4],
		[0.85, 0.4],
		[0.25, 0.8],
		[0.75, 0.8],
	],
	[
		[0.5, 0.15],
		[0.5, 0.85],
		[0.15, 0.25],
		[0.85, 0.25],
		[0.15, 0.75],
		[0.85, 0.75],
	],
	[
		[0.5, 0.15],
		[0.5, 0.85],
		[0.15, 0.25],
		[0.85, 0.25],
		[0.15, 0.75],
		[0.85, 0.75],
	],
	[
		[0.5, 0.075],
		[0.875, 0.225],
		[0.125, 0.225],
		[0.05, 0.625],
		[0.95, 0.625],
		[0.3, 0.925],
		[0.7, 0.925],
	],
	[
		[0.325, 0.05],
		[1 - 0.325, 0.05],
		[0.075, 0.325],
		[1 - 0.075, 0.325],
		[0.075, 0.675],
		[1 - 0.075, 0.675],
		[0.325, 0.95],
		[1 - 0.325, 0.95],
	],
];
