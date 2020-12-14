import {
	buildingArcology,
	buildingBank,
	buildingBioDome,
	buildingBunkers,
	buildingCoreMine,
	buildingFactoryAutomation,
	buildingGalacticExchange,
	buildingIndustrySector,
	buildingRingWorld,
	buildingSpacePort,
} from "../buildings/buildingRules";
import { Building } from "../models/Buildings";
import { BuildBuildingCommand, Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { Coordinates, GameModel } from "../models/Models";
import { SystemModel, SystemKeyword } from "../models/StarSystem";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import {
	techAdaptability,
	techAlternativePros,
	techEfficientBureaucracy,
	techGalacticSenate,
	techInitEcoBoost,
	techLevitationBuildings,
	techMineralPros,
	techSpaceDock,
	techUndergroundConstruction,
} from "../tech/businessTech";
import { techAutoDefenses, techDroidDefences } from "../tech/invasionTech";
import { createBuildingFromDesign, getBuildingDesignByType } from "./buildingUtils";
import { getSystemResearchPointGeneration } from "./factionUtils";
import { inSameLocation } from "./locationUtils";

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
	vps: number;
	totalDefense: number;
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
		vps: 0,
		totalDefense: 0,
	};

	eco.expenses = eco.industryExpenses + eco.defenseExpenses + eco.welfareExpenses + eco.buildingExpenses + 1;
	

	if (faction) {
		eco.welfareExpenses = techEfficientBureaucracy(faction, eco.welfareExpenses);
		eco.buildingSlots += techUndergroundConstruction(faction) + techLevitationBuildings(faction);
		eco.shipyards = techSpaceDock(faction, eco);
		eco.expenses -= techInitEcoBoost(faction);
	}
	eco.profit = eco.income - eco.expenses;
	eco.vps = getSystemVps(game, eco);
	eco.totalDefense = getSystemDefence(game, star);

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

export function getSystemVps(game: GameModel, star: SystemEconomy): number {
	let score = 0;
	score += 3;
	score += Math.round((star.industry + star.economy + star.defense + star.welfare) / 4);
	const bScore = star.buildings.reduce((tot: number, b: Building) => {
		return tot + b.score;
	}, 0);

	score += bScore;
	return score;
}

export function simulateCommandsEffectsForSystem(game: GameModel, factionId: string, star: SystemModel, commands: Command[]): SystemEconomy {
	const faction = getFactionFromArrayById(game.factions, factionId);

	const tempStar = {...star, buildings: [...star.buildings]};
	const nStar = commands.reduce(
		(s: SystemModel, cmd: Command) => {
			if (commandIsTargetsSystem(cmd, star.id)) {
				switch (cmd.type) {
					case CommandType.SystemEconomy:
						s.economy++;
						break;
					case CommandType.SystemWelfare:
						s.welfare++;
						break;
					case CommandType.SystemIndustry:
						s.industry++;
						break;
					case CommandType.SystemDefense:
						s.defense++;
						break;
					case CommandType.SystemBuildingBuild:
						const bcmd = {...cmd} as BuildBuildingCommand;
						const b: Building = {...getBuildingDesignByType(bcmd.buildingType), id: "TEMP"};
						s.buildings.push(b);
						break;
				}
				return {...s};
			}

			return s;
		},
		{ ...tempStar },
	);

	return getSystemEconomy(nStar, game);
}

function commandIsTargetsSystem(cmd: Command, systemId: string): boolean {
	if ([CommandType.SystemDefense, CommandType.SystemEconomy, CommandType.SystemIndustry, CommandType.SystemWelfare].includes(cmd.type)) {
		const sysCmd = { ...cmd } as SystemPlusCommand;
		return sysCmd.targetSystem === systemId;
	}
	if (cmd.type === CommandType.SystemBuildingBuild) {
		const sysCmd = { ...cmd } as BuildBuildingCommand;
		return sysCmd.targetSystem === systemId;
	}
	return false;
}
