import { MAPDensities, MAPSizes, SYSTEMBONUS } from "../../configs";
import { greekAlphabet, romanNumbers, starName } from "../../data/dataWords";
import { GameModel } from "../../models/Models";
import { SystemModel, SystemKeyword, SystemInfo, Planet, PlanetType, PlanetKeyword } from "../../models/StarSystem";

import { getRandomEnum } from "../../utils/generalUtils";
import { randomNameGenerator } from "../../utils/planetUtils";
import { rnd, arnd, roll, arnds } from "../../utils/randUtils";
import { getPlanetInfoByType, getRandomPlanetType } from "./mapUtils";

const starColors: string[] = ["#FFFD", "#FDAD", "#FF8D"];

let sysIds = 1000;

export function getDensityMultiplier(density: string): number {
	return density === "LOW" ? MAPDensities[0] : density === "HIGH" ? MAPDensities[2] : MAPDensities[1];
}

export function getDistanceMultiplier(distance: string): number {
	return distance === "SHORT" ? MAPSizes[0] : distance === "LONG" ? MAPSizes[2] : MAPSizes[1];
}

export function getSpecialChances(special: string): number {
	return 0;

	// Old Specials are disabled
	// switch (special) {
	//     case "NONE":
	//         return 0;
	//     case "RARE":
	//         return 15;
	//     case "AVERAGE":
	//         return 50;
	//     case "COMMON":
	//         return 75;
	//     case "ALL":
	//         return 100;
	//     default:
	//         return 40;
	// }
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
	return Math.round((dens / 1000) * densityMultiplier + plPlus + 10);
	// return playerCount * densityMultiplier * (sizeCounter/MAPSizes[1]);
}

export function createNewSystem(ax = 1, ay = 1, as = 99, special = "AVERAGE"): SystemModel {
	const id = sysIds++;

	const rx = rnd(0, as / 2) * 2;
	const ry = rnd(0, as / 2) * 2;

	const x = ax + rx;
	const y = ay + ry;

	const star: SystemModel = {
		id: `star-${id}`,
		color: arnd(starColors),
		defense: 0,
		economy: 0,
		welfare: 0,
		industry: 0,
		name: randomStarName(),
		location: {
			x,
			y,
		},
		ownerFactionId: "",
		keywords: [],
		reports: [],
		buildings: [],
		info: {
			planets: [],
			starClass: "",
		},
	};

	if (roll(getSpecialChances(special))) {
		const key = arnd(SYSTEMBONUS);
		star.keywords.push(key);
	}

	// star.info = systemInfoGenerator(star);
	star.info = systemInfoGenerator(star);

	let fillC = "#777";
	if (star.keywords.includes(SystemKeyword.HOSTILE)) {
		fillC = "#F00";
	}
	if (star.keywords.includes(SystemKeyword.MINERALRARE)) {
		fillC = "#FFD700";
	}
	if (star.keywords.includes(SystemKeyword.MINERALRICH)) {
		fillC = "#68C";
	}
	if (star.keywords.includes(SystemKeyword.NATIVES)) {
		fillC = "#88F";
	}
	if (star.keywords.includes(SystemKeyword.ARTIFACTS)) {
		fillC = "#F0F";
	}
	if (star.keywords.includes(SystemKeyword.GAIA)) {
		fillC = "#0F0";
	}
	if (star.keywords.includes(SystemKeyword.MINERALPOOR)) {
		fillC = "#A33";
	}

	star.color = fillC;

	star.description = systemDescriptionGenerator(star);
	// console.log("system info", star.info);
	return star;
}

export function createRandomMap(starCount: number, size = 99, special = "AVERAGE", playerCount: number): SystemModel[] {
	const stars: SystemModel[] = [];

	const c = Math.round(starCount / 10);
	const p = size / 3;

	// [x, y, size, star count]
	const ar: [number, number, number, number][] = [
		[1, 1, p - 1, c],
		[p, 1, p - 1, c * 2],
		[p * 2, 1, p - 1, c * 3],
		[1, p, p - 1, c * 4],
		[p, p, p - 1, c * 5],
		[p * 2, p, p - 1, c * 6],
		[1, p * 2, p - 1, c * 7],
		[p, p * 2, p - 1, c * 8],
		[p * 2, p * 2, p - 1, c * 9],
		[p, p, p - 1, starCount],
	];

	let confIndex = 0;
	let conf = ar[confIndex];

	while (stars.length < starCount) {
		if (stars.length > conf[3]) {
			confIndex++;
			conf = ar[confIndex];
		}

		const star = createNewSystem(conf[0], conf[1], conf[2], special);

		if (stars.findIndex((sm: SystemModel) => (sm.location.x === star.location.x && sm.location.y === star.location.y) || sm.name === star.name) === -1) {
			stars.push(star);
		}
	}

	return stars;
}

export function randomStarName() {
	const gr = roll(15) ? ` ${arnd(greekAlphabet)}` : "";
	const rm = roll(15) ? ` ${arnd(romanNumbers)}` : "";
	return `${arnd(starName)}${gr}${rm}`;
}

export function getSystemById(game: GameModel, systemId: string): SystemModel | undefined {
	// const game = joki.service.getState("GameService") as GameModel;
	return game.systems.find((sm: SystemModel) => sm.id === systemId);
}

export function systemDescriptionGenerator(star: SystemModel): string {
	const planetCount = rnd(1, 12);
	const starClass = arnd(["O", "B", "A", "F", "G", "K", "M"]);

	return `${star.name} is ${starClass} class star with  ${planetCount} planets circling it.`;
}

export function systemInfoGenerator(star: SystemModel): SystemInfo {
	const planets = arnds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rnd(1, 5), true).map((d: number) => {
		return planetGenerator(star, d);
	});

	return {
		planets: planets,
		starClass: arnd(["O", "B", "A", "F", "G", "K", "M"]),
	};
}

export function planetGenerator(star: SystemModel, distance: number): Planet {
	const ptype = getRandomPlanetType(distance);

	const ptypeinfo = getPlanetInfoByType(ptype);

	const size = rnd(ptypeinfo.sizeRange[0], ptypeinfo.sizeRange[1]);
    
    const planet: Planet = {
		population: 0,
		type: ptype,
		distanceFromStar: distance,
		name: `${star.name} ${distance}`,
		size: size,
		foodSupply: 0,
		foodProduction: 0,
		morale: 0,
		keywords: generatePlanetKeywords(ptype),
		maxPopulation: ptypeinfo.maxPop * size,
    };
    
    if(ptype === PlanetType.Terrestrial || ptype === PlanetType.Gaia || ptype === PlanetType.Ocean || ptype === PlanetType.Desert ) {
        planet.name = randomNameGenerator();
        
    }
    
	if (planet.keywords.includes(PlanetKeyword.EDIBLEFAUNA)) {
		planet.foodProduction += planet.size * 50;
	}
	if (planet.keywords.includes(PlanetKeyword.TIDALLOCK)) {
		planet.maxPopulation = Math.round(planet.maxPopulation * 0.75);
	}
	if (planet.keywords.includes(PlanetKeyword.PREDATORS)) {
		planet.maxPopulation = Math.round(planet.maxPopulation * 0.75);
	}
	return planet;
}

function generatePlanetKeywords(planetType: PlanetType): PlanetKeyword[] {
	let chance = 75;
	let amount = 0;
	while (roll(chance)) {
		amount++;
		chance -= 20;
	}

	const ptypeinfo = getPlanetInfoByType(planetType);
	const keys = arnds(ptypeinfo.possibleKeywords, amount, true);

	return keys.reduce((pks: PlanetKeyword[], p: PlanetKeyword | PlanetKeyword[]) => {
		if (Array.isArray(p)) {
			pks.push(arnd(p));
		} else {
			pks.push(p);
		}
		return pks;
	}, []);
}

export const homeSystemPositionsByPlayerCount: [number, number][][] = [
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
