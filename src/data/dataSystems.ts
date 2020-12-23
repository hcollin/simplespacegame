import { PlanetKeyword, PlanetType } from "../models/StarSystem";

export interface PlanetTypeInfo {
	type: PlanetType;
	possibleKeywords: (PlanetKeyword | PlanetKeyword[])[];
	maxPop: number;
	sizeRange: [number, number];
	frequency: number;
	distanceRange: [number, number];
}

const PlanetTypeData: PlanetTypeInfo[] = [
	{
		type: PlanetType.Terrestrial,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			[PlanetKeyword.LOWNATIVES, PlanetKeyword.HIGHNATIVES, PlanetKeyword.REMNANTS],
			PlanetKeyword.HOSTILEFAUNA,
			PlanetKeyword.PREDATORS,
			PlanetKeyword.EDIBLEFAUNA,
			[PlanetKeyword.POORMINERALS, PlanetKeyword.RICHMINERALS],
		],
		sizeRange: [2, 5],
		distanceRange: [3, 7],
		maxPop: 500,
		frequency: 20,
	},
	{
		type: PlanetType.Gaia,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			[PlanetKeyword.LOWNATIVES, PlanetKeyword.HIGHNATIVES, PlanetKeyword.REMNANTS],
			PlanetKeyword.HOSTILEFAUNA,
			PlanetKeyword.PREDATORS,
			PlanetKeyword.EDIBLEFAUNA,
			PlanetKeyword.POORMINERALS,
		],
		sizeRange: [3, 4],
		distanceRange: [4, 6],
		maxPop: 750,
		frequency: 10,
	},
	{
		type: PlanetType.Desert,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			PlanetKeyword.LOWNATIVES,
			PlanetKeyword.PREDATORS,
			PlanetKeyword.VULCANIC,
			PlanetKeyword.SEISMIC,
			[PlanetKeyword.RICHMINERALS, PlanetKeyword.RAREMINERALS],
		],
		sizeRange: [1, 6],
		distanceRange: [1, 8],
		maxPop: 200,
		frequency: 10,
	},
	{
		type: PlanetType.Ocean,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			PlanetKeyword.LOWNATIVES,
			PlanetKeyword.PREDATORS,
			[PlanetKeyword.RICHMINERALS, PlanetKeyword.RAREMINERALS],
			PlanetKeyword.CRYSTALS,
			PlanetKeyword.HOSTILEFAUNA,
			PlanetKeyword.EDIBLEFAUNA,
		],
		sizeRange: [2, 4],
		distanceRange: [3, 6],
		maxPop: 300,
		frequency: 15,
	},
	{
		type: PlanetType.IcePlanet,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			PlanetKeyword.REMNANTS,
			PlanetKeyword.SEISMIC,
			[PlanetKeyword.RICHMINERALS, PlanetKeyword.RAREMINERALS],
			PlanetKeyword.CRYSTALS,
		],
		sizeRange: [1, 4],
		distanceRange: [7, 15],
		maxPop: 200,
		frequency: 10,
	},
	{
		type: PlanetType.Barren,
		possibleKeywords: [
			PlanetKeyword.ARTIFACTS,
			PlanetKeyword.REMNANTS,
			PlanetKeyword.SEISMIC,
			PlanetKeyword.VULCANIC,
			[PlanetKeyword.RICHMINERALS, PlanetKeyword.RAREMINERALS],
			PlanetKeyword.CRYSTALS,
			PlanetKeyword.TIDALLOCK,
		],
		sizeRange: [1, 7],
		distanceRange: [1, 15],
		maxPop: 100,
		frequency: 10,
	},
	{
		type: PlanetType.Lava,
		possibleKeywords: [
			PlanetKeyword.SEISMIC,
			PlanetKeyword.VULCANIC,
			[PlanetKeyword.RICHMINERALS, PlanetKeyword.RAREMINERALS],
			PlanetKeyword.CRYSTALS,
			PlanetKeyword.TIDALLOCK,
		],
		sizeRange: [1, 4],
		distanceRange: [1, 3],
		maxPop: 100,
		frequency: 10,
	},
	{
		type: PlanetType.GasGiant,
		possibleKeywords: [],
		sizeRange: [6, 8],
		distanceRange: [7, 15],
		maxPop: 0,
		frequency: 10,
	},
];

export { PlanetTypeData };
