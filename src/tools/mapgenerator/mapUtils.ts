import { PlanetTypeData, PlanetTypeInfo } from "../../data/dataSystems";
import { Planet, PlanetKeyword, PlanetType, SystemModel } from "../../models/StarSystem";
import { getRandomEnum } from "../../utils/generalUtils";
import { arnd } from "../../utils/randUtils";
import { SystemEconomy } from "../../utils/systemUtils";

export function getPlanetInfoByType(type: PlanetType): PlanetTypeInfo {
	const info = PlanetTypeData.find((pti: PlanetTypeInfo) => pti.type === type);
	if (!info) {
		throw new Error(`Invalid Planet type ${type}`);
	}
	return info;
}

export function getRandomPlanetType(distance: number): PlanetType {
	const types = PlanetTypeData.reduce((tot: PlanetType[], p: PlanetTypeInfo) => {
		if (distance >= p.distanceRange[0] && distance <= p.distanceRange[1]) {
			for (let i = 0; i < p.frequency; i++) {
				tot.push(p.type);
			}
		}

		return tot;
	}, []);

	const ptype = arnd(types);

	return ptype;
}

export interface PlanetValues {
	population: number;
	maxPopulation: number;
	foodSupply: number;
	foodProduction: number;
	industryAdjustment: number;
	economyAdjustment: number;
	defenceAdjustment: number;
	welfareAdjustment: number;
}

export function getPlanetValues(star: SystemModel): PlanetValues {
	return star.info.planets.reduce(
		(values: PlanetValues, p: Planet) => {
			values.population += p.population;
			values.maxPopulation += p.maxPopulation;
			values.foodSupply += p.foodSupply;
			values.foodProduction += p.foodProduction;

			if (p.keywords.includes(PlanetKeyword.EDIBLEFAUNA)) {
				values.welfareAdjustment++;
				values.economyAdjustment++;
			}
			if (p.keywords.includes(PlanetKeyword.PREDATORS)) {
				values.defenceAdjustment += 2;
				values.welfareAdjustment--;
			}
			if (p.keywords.includes(PlanetKeyword.HOSTILEFAUNA)) {
				values.defenceAdjustment++;
				values.welfareAdjustment--;
			}
			if (p.keywords.includes(PlanetKeyword.POORMINERALS)) {
				values.industryAdjustment--;
			}
			if (p.keywords.includes(PlanetKeyword.SEISMIC)) {
				values.welfareAdjustment--;
				values.economyAdjustment--;
				values.industryAdjustment--;
				values.defenceAdjustment++;
			}
			if (p.keywords.includes(PlanetKeyword.VULCANIC)) {
				values.welfareAdjustment--;
				values.economyAdjustment--;
				values.industryAdjustment--;
				values.defenceAdjustment++;
			}
			if (p.keywords.includes(PlanetKeyword.RICHMINERALS)) {
				values.industryAdjustment++;
			}
			if (p.keywords.includes(PlanetKeyword.RAREMINERALS)) {
				values.industryAdjustment++;
				values.economyAdjustment++;
			}
			if (p.keywords.includes(PlanetKeyword.ARTIFACTS)) {
				values.economyAdjustment++;
			}

			if (p.keywords.includes(PlanetKeyword.CRYSTALS)) {
				values.economyAdjustment += 3;
			}

			return values;
		},
		{
			population: 0,
			maxPopulation: 0,
			foodSupply: 0,
			foodProduction: 0,
			industryAdjustment: 0,
			economyAdjustment: 0,
			defenceAdjustment: 0,
			welfareAdjustment: 0,
		},
	);
}

export function getSystemDefaultEconomy(star: SystemModel): SystemEconomy {
	const eco: SystemEconomy = {
		...star,
		income: 0,
		profit: 0,
		expenses: 0,
		industryExpenses: 0,
		welfareExpenses: 0,
		defenseExpenses: 0,
		research: 0,
		industryMax: 0,
		economyMax: 0,
		defenseMax: 0,
		welfareMax: 0,
		buildingSlots: 0,
		buildingExpenses: 0,
		shipyards: 1,
		vps: 1,
		totalDefense: 0,
		population: 0,
		maxPopulation: 0,
		foodSupply: 0,
		foodProduction: 0,
	};

	const plVals = getPlanetValues(star);

	eco.population = plVals.population;
	eco.maxPopulation = plVals.maxPopulation;
	eco.foodSupply = plVals.foodSupply;
	eco.foodProduction = plVals.foodProduction;

	eco.industryMax = Math.max(Math.round(plVals.maxPopulation / 500), 1) + plVals.industryAdjustment;
	eco.economyMax = Math.max(Math.round(plVals.maxPopulation / 500), 1) + plVals.economyAdjustment;
	eco.defenseMax = Math.max(Math.round(plVals.maxPopulation / 500), 1) + plVals.defenceAdjustment;
	eco.welfareMax = Math.max(Math.round(plVals.maxPopulation / 500), 1) + plVals.welfareAdjustment;

	return eco;
}
