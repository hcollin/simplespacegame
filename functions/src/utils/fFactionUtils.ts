import { buildingCGaiaProject, buildingCommandCenter, buildingUniversity, buildingGalacticSenate } from "../buildings/fBuildingRules";
import { BASEACTIONPOINTCOUNT } from "../configs";
import { Building } from "../models/fBuildings";
import { Trade } from "../models/fCommunication";
import { FactionModel, FactionTechSetting, GameModel } from "../models/fModels";
import { SystemModel } from "../models/fStarSystem";
import { ShipUnit } from "../models/fUnits";

import {
	techCapitalist,
	techDecisionEngine,
	techExpansionist,
	techHigherEducation,
	techInitEcoBoost,
	techMarketing,
	techMerchantGuild,
	techScientist,
} from "../tech/fBusinessTech";

export function getFactionFromArrayById(factions: FactionModel[], id: string): FactionModel | undefined {
	return factions.find((fm: FactionModel) => fm.id === id);
}

interface FactionValues {
	maxCommands: number;
	totalEconomy: number;
	totalWelfare: number;
	expenses: number;
	income: number;
	victoryPoints: number;
	unitExpenses: number;
	unitCount: number;
	systemExpenses: number;
	systemCount: number;
	systemIncome: number;
	trade: number;
	debt: number;
	debtRepayment: number;
}

export function factionValues(game: GameModel, factionId: string): FactionValues {
	const values: FactionValues = {
		maxCommands: 0,
		totalEconomy: 0,
		totalWelfare: 0,
		expenses: 0,
		income: 0,
		victoryPoints: 0,
		unitExpenses: 0,
		unitCount: 0,
		systemExpenses: 0,
		systemCount: 0,
		systemIncome: 0,
		trade: 0,
		debt: 0,
		debtRepayment: 0,
	};
	const faction = getFactionFromArrayById(game.factions, factionId);
	if (!faction) {
		throw new Error("Invalid Faction");
	}

	game.systems.forEach((star: SystemModel) => {
		if (star.ownerFactionId === factionId) {
			values.totalEconomy += star.economy;
			values.totalWelfare += star.welfare;
			values.systemIncome += star.economy;
			values.systemCount++;
		}
	});

	values.unitExpenses = game.units.reduce((sum: number, um: ShipUnit) => {
		if (um.factionId === factionId) {
			return sum + unitExpenses(um);
		}
		return sum;
	}, 0);
	values.unitCount = game.units.filter((um: ShipUnit) => um.factionId === factionId).length;

	values.expenses = expensesCalculator(game, factionId);

	values.systemExpenses = game.systems.reduce((sum: number, sm: SystemModel) => {
		if (sm.ownerFactionId === factionId) {
			sum += systemExpenses(sm, faction);
		}
		return sum;
	}, 0);

	values.trade = game.trades.reduce((sum: number, t: Trade) => {
		if (t.to === factionId) {
			return sum + t.money;
		}
		if (t.from === factionId) {
			return sum - t.money;
		}
		return sum + techMerchantGuild(faction);
	}, 0);

	values.income = values.totalEconomy + values.trade - values.expenses + techMarketing(faction, game) + techCapitalist(faction, game.systems);

	values.maxCommands = commandCountCalculator(game, factionId);

	values.debt = faction.debt;
	values.debtRepayment = faction.debt > 0 ? Math.floor(values.income / 3) : 0;

	return values;
}

/**
 * This function calculates the total expenses for the faction.
 *
 * Each unit costs 1 per turn. Welfare and Industry also increase expenses when they go over 4 on a planet.
 *
 * @param game
 * @param factionId
 */
export function expensesCalculator(game: GameModel, factionId: string): number {
	let expenses = 0;

	const faction = getFactionFromArrayById(game.factions, factionId);

	game.units.forEach((unit: ShipUnit) => {
		if (unit.factionId === factionId) {
			expenses += unitExpenses(unit);
		}
	});

	game.systems.forEach((star: SystemModel) => {
		if (star.ownerFactionId === factionId) {
			expenses += systemExpenses(star, faction);
		}
	});

	return expenses;
}

/**
 * The amount of commands the player can give each turn depends on the welfare of the planets.
 *
 * The minimum amount of commands is 3.
 *
 * @param game
 * @param factionId
 */
export function commandCountCalculator(game: GameModel, factionId: string): number {
	let totalWelfare = 0;
	let bonusCommands = 0;

	game.systems.forEach((star: SystemModel) => {
		if (star.ownerFactionId === factionId) {
			totalWelfare += star.welfare;

			// 1 bonus command per 5 welfare in this system
			bonusCommands += Math.floor(star.welfare / 5);
			bonusCommands += buildingCGaiaProject(star, "COMMAND");
			bonusCommands += buildingCommandCenter(star);
		}
	});
	const f = getFactionFromArrayById(game.factions, factionId);
	
	if (!f) throw new Error(`Invalid factionId${factionId}`);

	bonusCommands += techExpansionist(f, game.systems);
	// console.log(`APs: ${f.name}: now : ${f.aps} Total Welfare: ${totalWelfare} bonusCmds: ${bonusCommands} WelfareCommands: ${getWelfareCommands(f, totalWelfare)}`)
	return getWelfareCommands(f, totalWelfare) + bonusCommands;
}

export function getWelfareCommands(faction: FactionModel, welfarePointTotal: number): number {
	return Math.floor(welfarePointTotal / techDecisionEngine(faction));
}

export function getActionPointGeneration(game: GameModel, factionId: string): number {
	return BASEACTIONPOINTCOUNT + commandCountCalculator(game, factionId);
}

export function unitExpenses(um: ShipUnit): number {
	return um.cost >= 3 ? Math.floor(um.cost / 3) : 1;
}

export function systemExpenses(sm: SystemModel, faction?: FactionModel): number {
	const indExp = sm.industry < 3 ? 0 : Math.floor(sm.industry / 2);
	const welExp = sm.welfare < 3 ? 0 : Math.floor(sm.welfare / 2);
	const defExp = sm.defense;
	const buildingExpenses = sm.buildings.reduce((tot: number, b: Building) => tot + b.maintenanceCost, 0);
	const initBoost = faction ? techInitEcoBoost(faction) : 0;
	return indExp + welExp + defExp + buildingExpenses + 1 - initBoost;
}

export function researchPointGenerationCalculator(game: GameModel, faction: FactionModel): number {
	// const game = joki.service.getState("GameService") as GameModel;

	const points = game.systems.reduce((sum: number, sm: SystemModel) => {
		if (sm.ownerFactionId === faction.id) {
			sum += getSystemResearchPointGeneration(sm, faction);
		}
		return sum;
	}, 0);
	return points + techScientist(faction, game.systems);
}

export function getSystemResearchPointGeneration(sm: SystemModel, faction: FactionModel): number {
	const welfareCurve = techHigherEducation(faction);
	let sum = 0;
	sum += Math.floor((sm.industry + sm.defense) / 3);
	sum += Math.floor(sm.economy / 4);
	sum += sm.welfare < welfareCurve.length ? welfareCurve[sm.welfare] : -5;
	sum += buildingCGaiaProject(sm, "RESEARCH") + buildingUniversity(sm);

	return sum;
}

export function researchPointDistribution(totalPoints: number, faction: FactionModel): number[] {
	let points: number[] = [];
	const totalFocusPoints = faction.technologyFields.reduce((tot: number, tech: FactionTechSetting) => tot + tech.priority, 0);

	const partPoint = totalFocusPoints > 0 ? totalPoints / totalFocusPoints : 0;
	// const techDistribution = [0.50, 0.50, 0., 0.10, 0];
	let highestFieldIndex = -1;
	let highestFieldValue = -1;
	faction.technologyFields.forEach((tech: FactionTechSetting, index: number) => {
		const curSum = points.reduce((tot: number, cur: number) => tot + cur, 0);
		const remaining = totalPoints - curSum;
		let newVal = Math.round(partPoint * tech.priority);
		if (newVal > remaining) {
			newVal = remaining;
		}
		if (tech.priority > highestFieldValue) {
			highestFieldValue = tech.priority;
			highestFieldIndex = index;
		}
		points.push(Math.round(newVal));
	});

	const curSum = points.reduce((tot: number, cur: number) => tot + cur, 0);
	if (curSum < totalPoints) {
		points[highestFieldIndex] += totalPoints - curSum;
	}

	return points;
}

/**
 * Calculate the score for faction
 *
 * @param factionId
 */
export function getFactionScore(game: GameModel, factionId: string): number {
	let score = 0;

	game.systems.forEach((sm: SystemModel) => {
		if (sm.ownerFactionId === factionId) {
			score += 3;
			score += Math.round((sm.industry + sm.economy + sm.defense + sm.welfare) / 4);
			const bScore = sm.buildings.reduce((tot: number, b: Building) => {
				return tot + b.score;
			}, 0);

			score += bScore;
		}
	});

	game.units.forEach((u: ShipUnit) => {
		if (u.factionId === factionId) {
			score += Math.round(u.cost / 3);
		}
	});

	const faction = getFactionFromArrayById(game.factions, factionId);
	if (!faction) throw new Error(`Invalid faction id ${factionId}`);
	score += faction.technology.length * 2;

	score += buildingGalacticSenate(game, faction);

	// score -= faction.debt * Math.ceil(faction.debt/20);

	// Add technology scores from base research techs

	return score;
}

export function calculateTargetScore(game: GameModel) {
	return Math.round(game.systems.length * 1.5 + (80 - game.setup.playerCount * 10));
}

/**
 * Calculate new debt amount and possible adjusted to money after debt
 *
 * @param game
 * @param faction
 */
export function calculateFactionDebt(game: GameModel, faction: FactionModel): [number, number] {
	const values = factionValues(game, faction.id);

	let newDebt = faction.debt;
	
	// Debt increase while money is less than 0.
	if (faction.money < 0) {
		if (values.income < 0) {
			newDebt += (values.income * -1);
		}
	}
	
	const payback = calcalateNextDebtPayback(game, faction);
	
	newDebt -= payback;
	if (newDebt < 0) {
		newDebt = 0;
	}
	if (newDebt > 0) {
		newDebt++;
	}
	

	return [newDebt, payback];
}

/**
 * Debt is paid back slowly after money and income both are positive
 * 33% (rounded) of income is used to payback the debt until it has been completely repaid
 * Debt gains interest of 1 credit per turn
 *
 * @param game
 * @param faction
 */
export function calcalateNextDebtPayback(game: GameModel, faction: FactionModel): number {
	const values = factionValues(game, faction.id);
	let payback = 0;

	if (faction.money > 0 && values.income > 0 && faction.debt > 0) {
		payback = Math.floor(values.income / 3);

		if (payback > faction.money) {
			payback = faction.money;
		}

		if (payback > faction.debt) {
			payback = faction.debt;
		}
	}

	return payback;
}


