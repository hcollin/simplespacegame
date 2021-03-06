import {
	buildingSpacePort,
	buildingGalacticExchange,
	buildingCoreMine,
	buildingBioDome,
	buildingArcology,
	buildingIndustrySector,
	buildingFactoryAutomation,
	buildingRingWorld,
	buildingBunkers,
	buildingBank,
} from "../buildings/fBuildingRules";
import { Building } from "../models/fBuildings";
import { Coordinates, GameModel } from "../models/fModels";
import { SystemKeyword, SystemModel } from "../models/fStarSystem";

import {
	techEfficientBureaucracy,
	techUndergroundConstruction,
	techLevitationBuildings,
	techSpaceDock,
	techMineralPros,
	techAlternativePros,
	techAdaptability,
	techGalacticSenate,
	techInitEcoBoost,
} from "../tech/fBusinessTech";
import { techDroidDefences, techAutoDefenses } from "../tech/fInvasionTech";
import { getFactionFromArrayById, getSystemResearchPointGeneration } from "./fFactionUtils";
import { inSameLocation } from "./fLocationUtils";

export function getSystemFromArrayById(stars: SystemModel[], systemId: string): SystemModel {
	const sm = stars.find((s: SystemModel) => s.id === systemId);
	if (!sm) {
		throw new Error(`System id ${systemId} was not found!`);
	}
	return sm;
}

export interface SystemEconomy extends SystemModel {
	income: number;
	expenses: number;
	industryExpenses: number;
	welfareExpenses: number;
	defenseExpenses: number;
	profit: number;
	research: number;
	industryMax: number;
	economyMax: number;
	defenseMax: number;
	welfareMax: number;
	buildingSlots: number;
	buildingExpenses: number;
	shipyards: number;
}

export function getSystemEconomy(star: SystemModel, game: GameModel): SystemEconomy {
	const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);

	const eco: SystemEconomy = {
		...star,
		income: star.economy * buildingSpacePort(star) + buildingGalacticExchange(star, game.systems) + buildingCoreMine(star) + buildingBank(star),
		profit: 0,
		expenses: 0,
		industryExpenses: star.industry < 3 ? 0 : Math.floor(star.industry / 2),
		welfareExpenses: star.welfare < 3 ? 0 : Math.floor(star.welfare / 2),
		defenseExpenses: star.defense,
		research: faction ? getSystemResearchPointGeneration(star, faction) : 0,
		industryMax: getStarIndustryMax(star, game),
		economyMax: getStarEconomyMax(star, game),
		defenseMax: getStarDefenceMax(star, game),
		welfareMax: getStarWelfareMax(star, game),
		buildingSlots: getSystemMaxBuildingSlots(star, game),
		buildingExpenses: star.buildings.reduce((tot: number, b: Building) => tot + b.maintenanceCost, 0),
		shipyards: 1,
	};

	eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses + eco.buildingExpenses + 1;

	if (faction) {
		eco.welfareExpenses = techEfficientBureaucracy(faction, eco.welfareExpenses);
		eco.buildingSlots += techUndergroundConstruction(faction) + techLevitationBuildings(faction);
		eco.shipyards = techSpaceDock(faction, eco);
		eco.expenses -= techInitEcoBoost(faction);
	}

	eco.profit = eco.income - eco.expenses;
	return buildingBioDome(buildingArcology(buildingIndustrySector(buildingFactoryAutomation(buildingRingWorld(eco)))));
}

export function getStarIndustryMax(star: SystemModel, game: GameModel): number {
	const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
	let def = 5;
	if (star.keywords.includes(SystemKeyword.HOSTILE)) def = 7;
	if (star.keywords.includes(SystemKeyword.MINERALRICH)) def = 6;
	if (star.keywords.includes(SystemKeyword.MINERALRARE)) def = 6;
	if (star.keywords.includes(SystemKeyword.GAIA)) def = 4;
	if (star.keywords.includes(SystemKeyword.MINERALPOOR)) def = 3;
	if (faction) {
		def += techMineralPros(faction, star);
		def += techAlternativePros(faction, star);
	}
	return def;
}

export function getStarEconomyMax(star: SystemModel, game: GameModel): number {
	// const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
	let def = 5;
	if (star.keywords.includes(SystemKeyword.ARTIFACTS)) def = 7;
	if (star.keywords.includes(SystemKeyword.MINERALRARE)) def = 6;
	if (star.keywords.includes(SystemKeyword.GAIA)) def = 6;

	return def;
}

export function getStarDefenceMax(star: SystemModel, game: GameModel): number {
	// const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
	let def = 5;
	if (star.keywords.includes(SystemKeyword.HOSTILE)) def = 7;
	return def;
}

export function getStarWelfareMax(star: SystemModel, game: GameModel): number {
	const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
	let def = 5;
	if (star.keywords.includes(SystemKeyword.NATIVES)) def = 6;
	if (star.keywords.includes(SystemKeyword.GAIA)) def = 7;
	if (star.keywords.includes(SystemKeyword.HOSTILE)) def = 1;
	if (faction) {
		def = techAdaptability(faction, star, def);
		def += techAlternativePros(faction, star);
		def += techGalacticSenate(faction);
	}
	return def;
}

export function getSystemMaxBuildingSlots(star: SystemModel, game: GameModel): number {
	let val = 3;
	if (star.industry < 2) val = 1;
	if (star.industry < 4) val = 2;
	if (star.industry > 5) val = 4;

	return val;
}

export function getSystemDefence(game: GameModel, sm: SystemModel): number {
	if (sm.ownerFactionId !== "") {
		const faction = getFactionFromArrayById(game.factions, sm.ownerFactionId);
		if (faction) {
			return sm.defense * techDroidDefences(faction) + buildingBunkers(sm) + techAutoDefenses(faction);
		}
	}
	return sm.defense + buildingBunkers(sm);
}

export function getSystemByCoordinates(game: GameModel, coords: Coordinates): SystemModel | undefined {
	// const game = joki.service.getState("GameService") as GameModel;
	return game.systems.find((sm: SystemModel) => inSameLocation(sm.location, coords));
}
