import axios, { AxiosRequestConfig } from "axios";
import {
	buildingBunkers,
	buildingDysonSphere,
	buildingGateway,
	buildingOrbitalCannon,
	buildingRepairStation,
	buildingRobotWorkers,
} from "./buildings/fBuildingRules";
import { spaceCombatMain } from "./combatResolver";
import { BUILDINGTYPE } from "./data/fDataBuildings";
import DATASHIPS, { SHIPWEAPONSPECIAL } from "./data/fDataShips";
import { DATATECHNOLOGY } from "./data/fDataTechnology";
import { COMBAT_MAXROUNDS } from "./functionConfigs";
import {
	Command,
	CommandType,
	FleetCommand,
	ResearchCommand,
	SystemPlusCommand,
	BuildUnitCommand,
	BuildBuildingCommand,
	UnitScrapCommand,
	FleetBombardCommand,
} from "./models/fCommands";
import { Trade } from "./models/fCommunication";
import { GameModel, GameState, FactionModel, FactionState, FactionTechSetting, Technology, SpaceCombat, Coordinates, Report } from "./models/fModels";
import { CombatReport, CombatRoundStatus, DetailReport, DetailReportType, InvasionReport, SystemReport } from "./models/fReport";
import { SystemModel } from "./models/fStarSystem";
import { SHIPCLASS, ShipUnit, ShipWeapon, WEAPONTYPE } from "./models/fUnits";

import { techAutoRepairBots, techAutoRepairBots2 } from "./tech/fShipTech";
import { createBuildingFromDesign, getBuildingDesignByType, systemHasBuilding } from "./utils/fBuildingUtils";
import {
	researchPointGenerationCalculator,
	researchPointDistribution,
	factionValues,
	getFactionFromArrayById,
	calculateFactionDebt,
	getActionPointGeneration,
} from "./utils/fFactionUtils";
import { asyncArrayForeach, asyncArrayMap, asyncMapForeach, mapAdd } from "./utils/fGeneralUtils";
import { inSameLocation } from "./utils/fLocationUtils";
import { travelingBetweenCoordinates } from "./utils/fMathUtils";
import { rnd, roll, shuffle } from "./utils/fRandUtils";
import { getSystemByCoordinates, getSystemDefence, getSystemFromArrayById } from "./utils/fSystemUtils";
import { canAffordTech, factionPaysForTech } from "./utils/fTechUtils";
import {
	getShipSpeed,
	getFactionAdjustedUnit,
	getFactionAdjustedWeapon,
	getMaxDamageForWeapon,
	createShipFromDesign,
	getDesignByName,
	getRecycleProfit,
	fleetBombardmentCalculator,
} from "./utils/fUnitUtils";
import { specialAntiFighter } from "./utils/fWeaponUtils";

export async function processTurn(origGame: GameModel, commands: Command[], firestore: any): Promise<[GameModel, Command[]]> {
	// if (origGame.state !== GameState.PROCESSING) return origGame;

	let game = { ...origGame };

	game.systems = game.systems.map((sm: SystemModel) => {
		sm.reports = [];
		return sm;
	});

	console.log("START TURN PROCESSING!", game.name, game.turn);
	if (commands) {
		game = processScrapCommands(commands, game);
		game = await processSystemCommands(commands, game, firestore);
		game = processMovementCommands(commands, game);

		// Process trades
		game = processTrades(game);

		game = processResearchCommands(commands, game);
	}
	game = await processCombats(game, firestore);
	if (commands) {
		game = await processBombardmentCommands(game, commands);
	}
	game = await processInvasion(game, firestore);

	// Process economy
	game = processEconomy(game);

	// Process Repairs
	game = processRepairs(game);

	// Process Research
	game = processResearch(game);

	// Win Conditions
	game = processWinConditions(game);

	game = await processValidateRemainingCommands(game, commands);

	// Make sure building commands are still valid

	// Turn final processing
	game = processStartNewTurn(game);

	// Clear ready states

	// // Clear Commands
	// api.api.trigger({
	//     from: serviceId,
	//     action: "nextTurn",
	// });

	game.state = GameState.TURN;

	// Fire webhook to discord
	if (game.settings.discordWebHookUrl !== null) {
		try {
			const discordRequestConfig: AxiosRequestConfig = {
				url: game.settings.discordWebHookUrl,
				method: "post",
				headers: {
					"Content-type": "application/json",
				},
				data: {
					content: `Game ${game.name} turn ${game.turn}`,
				},
			};
			const axlog = await axios(discordRequestConfig);
		} catch (e) {
			console.error(`${game.name}:${game.id}:Error while sending notification to discord`, game.settings);
			console.log(e);
		}
	}

	// await saveGame();

	// sendUpdate();
	return [{ ...game }, [...(commands || [])]];
}

/**
 * Check if any player has won
 *
 * @param game
 */
function processWinConditions(game: GameModel): GameModel {
	const winners: string[] = [];

	// Score based winning to be done

	// If there is a winner(s) mark them down and end the game.
	if (winners.length > 0) {
		game.factions = game.factions.map((fm: FactionModel) => {
			if (winners.includes(fm.id)) {
				fm.state = FactionState.WON;
			} else {
				fm.state = FactionState.LOST;
			}
			return { ...fm };
		});
		game.state = GameState.ENDED;
	}

	return { ...game };
}

async function processValidateRemainingCommands(oldGame: GameModel, commands: Command[]): Promise<GameModel> {
	let game = { ...oldGame };

	commands.forEach((cmd: Command) => {
		if (cmd.type === CommandType.SystemBuildUnit) {
			const bcmd = cmd as BuildUnitCommand;

			const system = getSystemFromArrayById(game.systems, bcmd.targetSystem);

			if (system && system.ownerFactionId !== bcmd.factionId) {
				const faction = getFactionFromArrayById(game.factions, cmd.factionId);
				const shipDesign = getDesignByName(bcmd.shipName);
				faction.money += shipDesign.cost;
				game = updateFactionInGame(game, faction);
				cmd.delete = true;
				game = addReportToSystem(
					game,
					system,
					DetailReportType.Generic,
					[bcmd.factionId],
					"",
					`Building ${shipDesign.name} cancelled in ${system.name}`,
				);
			}
		}

		if (cmd.type === CommandType.SystemBuildingBuild) {
			const bcmd = cmd as BuildBuildingCommand;
			const system = getSystemFromArrayById(game.systems, bcmd.targetSystem);
			if (system.ownerFactionId !== bcmd.factionId) {
				const faction = getFactionFromArrayById(game.factions, cmd.factionId);
				const building = getBuildingDesignByType(bcmd.buildingType);
				faction.money += building.cost;
				game = updateFactionInGame(game, faction);
				cmd.delete = true;
				game = addReportToSystem(game, system, DetailReportType.Generic, [bcmd.factionId], "", `Building ${building.name} cancelled in ${system.name}`);
			}
		}
	});

	return game;
}

/**
 * Clean after processing and prepareing for the next turn
 *
 * @param game
 */
function processStartNewTurn(game: GameModel): GameModel {
	const nGame = { ...game };

	nGame.factions = nGame.factions.map((f: FactionModel) => {
		const newAps = getActionPointGeneration(nGame, f.id);
		f.aps += newAps;
		return f;
	});

	nGame.factionsReady = [];
	nGame.turn++;

	return nGame;
}

/**
 * Process Fleet movement commands
 *
 * @param commands
 * @param oldGame
 */
function processMovementCommands(commands: Command[], oldGame: GameModel): GameModel {
	let game = { ...oldGame };

	commands.forEach((cmd: Command) => {
		if (cmd.type === CommandType.FleetMove) {
			game = processFleetMoveCommand(cmd as FleetCommand, game);
		}
	});

	return game;
}

/**
 * Scrap units from the game either by disbanding or by recycling
 *
 * @param commands
 * @param oldGame
 */
function processScrapCommands(commands: Command[], oldGame: GameModel): GameModel {
	let game = { ...oldGame };

	commands.forEach((cmd: Command) => {
		if (cmd.type === CommandType.UnitScrap) {
			const scrapCmd = cmd as UnitScrapCommand;

			const moneyToFactions = new Map<string, number>();
			game.units = game.units.filter((unit: ShipUnit) => {
				if (unit.id === scrapCmd.unitId) {
					if (scrapCmd.recycle) {
						mapAdd(moneyToFactions, unit.factionId, getRecycleProfit(unit));
					}
					return false;
				}
				return true;
			});

			game.factions = game.factions.map((f: FactionModel) => {
				const mon = moneyToFactions.get(f.id);
				if (mon) {
					f.money += mon;
					return { ...f };
				}
				return f;
			});
		}
	});

	return game;
}

/**
 * Process Research Point generation for each faction
 *
 * @param oldGame
 */
function processResearch(oldGame: GameModel) {
	const game = { ...oldGame };

	game.factions = game.factions.map((fm: FactionModel) => {
		const pointsGenerated = researchPointGenerationCalculator(game, fm);
		const distribution = researchPointDistribution(pointsGenerated, fm);

		fm.technologyFields = fm.technologyFields.map((tech: FactionTechSetting, index: number) => {
			tech.points += distribution[index];
			return { ...tech };
		});

		return fm;
	});

	return game;
}

/**
 * Process active trades
 *
 * @param oldGame
 */
function processTrades(oldGame: GameModel): GameModel {
	let game = { ...oldGame };

	game.trades = game.trades.map((tr: Trade) => {
		let success = false;

		const fromFaction = getFactionFromArrayById(game.factions, tr.from);
		const toFaction = getFactionFromArrayById(game.factions, tr.to);

		if (fromFaction && toFaction) {
			if (fromFaction.money >= tr.money) {
				fromFaction.money -= tr.money;
				toFaction.money += tr.money;
				success = true;
			}
		}

		if (success && fromFaction && toFaction) {
			tr.length--;
			game = updateFactionInGame(game, fromFaction);
			game = updateFactionInGame(game, toFaction);
		}

		return { ...tr };
	});

	return game;
}

/**
 * Handle Research commands that actually gives new tech for factions
 *
 * @param commands
 * @param oldGame
 */
function processResearchCommands(commands: Command[], oldGame: GameModel): GameModel {
	let game = { ...oldGame };

	commands.forEach((cmd: Command) => {
		if (cmd.type === CommandType.TechnologyResearch) {
			const command = cmd as ResearchCommand;
			const faction = getFactionFromArrayById(game.factions, command.factionId);
			if (faction) {
				const tech = DATATECHNOLOGY.find((t: Technology) => t.id === command.techId);
				if (tech && faction && canAffordTech(tech, faction)) {
					faction.technologyFields = factionPaysForTech(faction.technologyFields, tech);
					faction.technology.push(tech.id);
					game = updateFactionInGame(payActionPointCost(game, command), faction);
					markCommandDone(cmd);
				}
			}
		}
	});

	return game;
}

/**
 * Process all command given for a system like improving infrastructure and building units and buildings
 *
 * @param commands
 * @param oldGame
 * @param firestore
 */
async function processSystemCommands(commands: Command[], oldGame: GameModel, firestore: any): Promise<GameModel> {
	let game = { ...oldGame };

	for (let i = 0; i < commands.length; i++) {
		const cmd = commands[i];
		if (cmd.type === CommandType.SystemEconomy) {
			game = processSystemEconomyCommand(cmd as SystemPlusCommand, game);
		}
		if (cmd.type === CommandType.SystemWelfare) {
			game = processSystemWelfareCommand(cmd as SystemPlusCommand, game);
		}
		if (cmd.type === CommandType.SystemDefense) {
			game = processSysteDefenseCommand(cmd as SystemPlusCommand, game);
		}
		if (cmd.type === CommandType.SystemIndustry) {
			game = processSystemIndustryCommand(cmd as SystemPlusCommand, game);
		}
		if (cmd.type === CommandType.SystemBuildUnit) {
			game = processSystemBuildUnitCommand(cmd as BuildUnitCommand, game);
		}
		if (cmd.type === CommandType.SystemBuildingBuild) {
			game = await processSystemBuildBuildingCommand(cmd as BuildBuildingCommand, game, firestore);
		}
	}

	return game;
}

async function processBombardmentCommands(oldGame: GameModel, commands: Command[]): Promise<GameModel> {
	let game = { ...oldGame };

	commands.forEach((cmd: Command) => {
		if (cmd.type === CommandType.FleetBombard) {
			const bcmd = cmd as FleetBombardCommand;

			const targetSystem = getSystemFromGame(game, bcmd.targetSystem);
			if (targetSystem.ownerFactionId !== cmd.factionId) {
				const fleet = game.units.filter((u: ShipUnit) => {
					return bcmd.unitIds.includes(u.id);
				});
				const bomb = fleetBombardmentCalculator(game, fleet, targetSystem);
				let successfulBombardments = 0;

				for (let b = 0; b < bomb[1]; b++) {
					if (roll(bomb[0])) {
						successfulBombardments++;
					}
				}
				console.log("BOMBARDMENT", bomb, successfulBombardments);
				targetSystem.defense -= successfulBombardments;
				if (targetSystem.defense < 0) targetSystem.defense = 0;
				game = updateSystemInGame(game, targetSystem);
				game = addReportToSystem(
					game,
					targetSystem,
					DetailReportType.Generic,
					[targetSystem.ownerFactionId, fleet[0].factionId],
					"",
					`${targetSystem.name} was bombarded resulting ${successfulBombardments} defence points of damage`,
				);
			}

			markCommandDone(cmd);
		}
	});

	return game;
}

/**
 * Process Ground combat
 *
 * @param oldGame
 * @param firestore
 */
async function processInvasion(oldGame: GameModel, firestore: any): Promise<GameModel> {
	let game = { ...oldGame };

	const invadedSystems: SystemModel[] = [];

	oldGame.systems = await asyncArrayMap<SystemModel>(oldGame.systems, async (sm: SystemModel) => {
		const factionTroopCount = new Map<string, number>();

		const invasionTexts: string[] = [];
		oldGame.units.forEach((um: ShipUnit) => {
			if (inSameLocation(sm.location, um.location) && sm.ownerFactionId !== um.factionId) {
				const attackingFaction = getFactionFromArrayById(game.factions, um.factionId);
				if (systemHasBuilding(sm, BUILDINGTYPE.ORBCANNONS)) {
					const afterOrbitalCannon = buildingOrbitalCannon(sm, um.troops);
					invasionTexts.push(`Orbital cannons shot down ${um.troops - afterOrbitalCannon} ${attackingFaction.name} troops while they were landing.`);
					invasionTexts.push(`${afterOrbitalCannon} ${attackingFaction.name}  troops started the invasion`);
					if (afterOrbitalCannon <= 0) {
						invasionTexts.push(`Orbital cannon shot down all ${attackingFaction.name} troops`);
					}
					mapAdd(factionTroopCount, um.factionId, afterOrbitalCannon);
				} else {
					invasionTexts.push(`${um.troops} ${attackingFaction.name}  troops started the invasion`);
					mapAdd(factionTroopCount, um.factionId, um.troops);
				}
			}
		});

		if (factionTroopCount.size > 0) {
			await asyncMapForeach(factionTroopCount, async (troops: number, factionId: string) => {
				const defenses = getSystemDefence(game, sm);
				const attackingFaction = getFactionFromArrayById(game.factions, factionId);
				const ownerFaction = getFactionFromArrayById(game.factions, sm.ownerFactionId);
				const ownerName = ownerFaction ? ownerFaction.name : "Neutral faction";

				invasionTexts.push(`${ownerName} is defending with ${defenses} defense value.`);

				if (troops > defenses) {
					sm.ownerFactionId = factionId;
					invadedSystems.push(sm);
					invasionTexts.push(`${attackingFaction.name} succesfully invades ${sm.name} from ${ownerName}`);
				} else {
					invasionTexts.push(`Invasion of ${sm.name} by ${attackingFaction.name} from ${ownerName} has failed!`);
				}
				const report = await createNewReport(
					{
						id: "",
						factionIds: [sm.ownerFactionId, factionId],
						gameId: game.id,
						systemId: sm.id,
						invaders: troops,
						defenders: defenses,
						texts: invasionTexts,
						title: `Invasion of ${sm.name}`,
						turn: game.turn,
						type: DetailReportType.Invasion,
					} as InvasionReport,
					firestore,
				);

				game = addReportToSystem(
					game,
					sm,
					DetailReportType.System,
					[sm.ownerFactionId],
					report.id,
					`Invasion in ${sm.name} by ${attackingFaction.name}`,
				);
			});
		}
		return sm;
	});

	return game;
}

function processEconomy(game: GameModel): GameModel {
	game.factions = game.factions.map((fm: FactionModel) => {
		const values = factionValues(game, fm.id);

		fm.money += values.income;

		const [debt, payback] = calculateFactionDebt(game, fm);

		fm.debt = debt;
		fm.money -= payback;

		return { ...fm };
	});

	return { ...game };
}

function processRepairs(oldGame: GameModel): GameModel {
	const game = { ...oldGame };

	// Repairing units and fighters
	game.units = game.units.map((unit: ShipUnit) => {
		const star = getSystemByCoordinates(game, unit.location);
		if (star) {
			if (star.ownerFactionId === unit.factionId) {
				if (unit.damage > 0) {
					let repairValue = star.industry * unit.sizeIndicator * buildingRepairStation(star);
					unit.damage = repairValue > unit.damage ? 0 : unit.damage - repairValue;
				}
				if (unit.fighters < unit.fightersMax) {
					unit.fighters = unit.fighters + 1 * buildingRepairStation(star);
				}
			}
		}
		const unitOwnerFaction = getFactionFromArrayById(game.factions, unit.factionId);
		unit.damage -= techAutoRepairBots(unitOwnerFaction, unit);
		if (unit.damage < 0) {
			unit.damage = 0;
		}

		return { ...unit };
	});

	return game;
}

async function processCombats(game: GameModel, firestore: any): Promise<GameModel> {
	const combats: SpaceCombat[] = [];

	game.systems.forEach((star: SystemModel) => {
		const unitsInSystem = game.units.filter((unit: ShipUnit) => inSameLocation(star.location, unit.location));

		if (unitsInSystem.length > 0) {
			const factions = unitsInSystem.reduce((factions: Set<string>, unit: ShipUnit) => {
				factions.add(unit.factionId);
				return factions;
			}, new Set<string>());

			if (factions.size > 1) {
				combats.push({
					units: unitsInSystem,
					origUnits: [],
					system: star,
					round: 0,
					done: false,
					roundLog: [],
					currentRoundLog: {
						attacks: [],
						messages: [],
						round: 0,
						status: [],
					},
				});
			}
		}
	});

	for (let i = 0; i < combats.length; i++) {
		const combat = combats[i];
		if (combat) {
			game = await resolveCombat(game, combat, firestore);
		}
	}
	combats.forEach((combat: SpaceCombat) => {});

	return { ...game };
}

function processSystemEconomyCommand(command: SystemPlusCommand, game: GameModel): GameModel {
	const system = getSystemFromGame(game, command.targetSystem);
	system.economy++;
	markCommandDone(command);
	return updateSystemInGame(payActionPointCost(game, command), system);
}

function processSystemWelfareCommand(command: SystemPlusCommand, game: GameModel): GameModel {
	const system = getSystemFromGame(game, command.targetSystem);
	system.welfare++;
	markCommandDone(command);
	return updateSystemInGame(payActionPointCost(game, command), system);
}

function processSystemIndustryCommand(command: SystemPlusCommand, game: GameModel): GameModel {
	const system = getSystemFromGame(game, command.targetSystem);
	system.industry++;
	markCommandDone(command);
	return updateSystemInGame(payActionPointCost(game, command), system);
}

function processSystemBuildUnitCommand(command: BuildUnitCommand, oldGame: GameModel): GameModel {
	let game = { ...oldGame };
	const faction = getFactionFromArrayById(game.factions, command.factionId);

	if (faction) {
		const shipDesign = getDesignByName(command.shipName);
		const system = getSystemFromGame(game, command.targetSystem);

		if (command.turn === game.turn) {
			const cost = shipDesign.cost * buildingRobotWorkers(system);
			if (faction.money >= cost) {
				faction.money = faction.money - cost;
				game = payActionPointCost(game, command);
				command.turnsLeft--;
				if (buildingDysonSphere(system)) {
					command.turnsLeft = 0;
				}
				if (command.turnsLeft === 0) {
					markCommandDone(command);
					const unit = createShipFromDesign(shipDesign, command.factionId, system.location);
					game.units.push(unit);
					return updateFactionInGame(game, faction);
				}
				command.save = true;
				return updateFactionInGame(game, faction);
			}
		} else {
			command.turnsLeft--;
			if (buildingDysonSphere(system)) {
				command.turnsLeft = 0;
			}
			if (command.turnsLeft === 0) {
				markCommandDone(command);
				const unit = createShipFromDesign(shipDesign, command.factionId, system.location);
				game.units.push(unit);
				return updateFactionInGame(game, faction);
			} else {
				command.save = true;
			}
		}
	}

	return { ...game };
}

async function processSystemBuildBuildingCommand(command: BuildBuildingCommand, oldGame: GameModel, firestore: any): Promise<GameModel> {
	let game = { ...oldGame };
	const faction = getFactionFromArrayById(game.factions, command.factionId);
	if (faction) {
		const bdesign = getBuildingDesignByType(command.buildingType);
		const system = getSystemFromGame(game, command.targetSystem);
		if (command.turn === game.turn) {
			// If faction can afford the building pay the cost and start building;
			const cost = bdesign.cost * buildingRobotWorkers(system);
			if (faction.money >= cost) {
				faction.money = faction.money - cost;
				game = payActionPointCost(game, command);
				command.turnsLeft--;
				if (buildingDysonSphere(system)) {
					command.turnsLeft = 0;
				}
				if (command.turnsLeft === 0) {
					markCommandDone(command);
					const system = getSystemFromGame(game, command.targetSystem);
					system.buildings.push(createBuildingFromDesign(bdesign));

					const report = await createNewReport(
						{
							id: "",
							factionIds: [system.ownerFactionId],
							gameId: game.id,
							systemId: system.id,
							text: `${bdesign.name} built in ${system.name}`,
							title: `${bdesign.name} built in ${system.name}`,
							turn: game.turn,
							type: DetailReportType.System,
						},
						firestore,
					);

					addReportToSystem(game, system, DetailReportType.System, [system.ownerFactionId], report.id, `${bdesign.name} built in ${system.name}`);

					return updateFactionInGame(updateSystemInGame(game, system), faction);
				}
				command.save = true;
				return updateFactionInGame(game, faction);
			}
			// If the cannot build the building just do not execute this command
			//TODO: Add info to turn report about this. When turn reports exist...
		} else {
			command.turnsLeft--;
			if (buildingDysonSphere(system)) {
				command.turnsLeft = 0;
			}
			// Finish building
			if (command.turnsLeft === 0) {
				const system = getSystemFromGame(game, command.targetSystem);
				system.buildings.push(createBuildingFromDesign(bdesign));
				markCommandDone(command);
				return updateSystemInGame(game, system);
			} else {
				command.save = true;
			}
		}
	}

	return { ...game };
}

function processSysteDefenseCommand(command: SystemPlusCommand, game: GameModel): GameModel {
	const system = getSystemFromGame(game, command.targetSystem);
	system.defense++;
	markCommandDone(command);
	return updateSystemInGame(payActionPointCost(game, command), system);
}

function processFleetMoveCommand(command: FleetCommand, game: GameModel): GameModel {
	let newPoint: Coordinates | null = null;

	let nGame = { ...game };

	// Warpgate building!
	if (command.turn === game.turn) {
		const unit = getUnitFromGame(game, command.unitIds[0]);
		const startStar = getSystemByCoordinates(game, unit.location);
		const endStar = getSystemByCoordinates(game, command.target);
		if (buildingGateway(startStar, endStar, unit.factionId)) {
			newPoint = endStar.location;
		}
	}

	if (command.turn === nGame.turn) {
		nGame = payActionPointCost(nGame, command);
	}

	command.unitIds.forEach((uid: string) => {
		const unit = getUnitFromGame(game, uid);
		const faction = getFactionFromArrayById(game.factions, unit.factionId);

		if (newPoint === null) {
			newPoint = travelingBetweenCoordinates(unit.location, command.target, getShipSpeed(unit, faction));
		}

		const nUnit = { ...unit };
		nUnit.location = newPoint;
		if (inSameLocation(newPoint, command.target)) {
			markCommandDone(command);
		}
		nGame = updateUnitInGame(nGame, nUnit);
	});

	return { ...nGame };
}

function getSystemFromGame(game: GameModel, systemId: string): SystemModel {
	const system = game.systems.find((sm: SystemModel) => sm.id === systemId);
	if (!system) {
		throw new Error(`Invalid system id ${systemId}`);
	}
	return system;
}

function getUnitFromGame(game: GameModel, unitId: string): ShipUnit {
	const unit = game.units.find((u: ShipUnit) => u.id === unitId);
	if (!unit) {
		throw new Error(`Invalid unit id ${unitId}`);
	}
	return unit;
}

async function createNewReport<T extends DetailReport>(report: T, firestore: any): Promise<T> {
	const docRef = await firestore.collection("Reports").add(report);
	report.id = docRef.id;
	await firestore
		.collection("Reports")
		.doc(report.id)
		.set({ ...report });
	return report;
}

async function resolveCombat(game: GameModel, origCombat: SpaceCombat, firestore: any): Promise<GameModel> {
	if (origCombat.system === null) {
		throw new Error(`Combat cannot happen outside of a system, the null is only used in testing needs to be removed`);
	}

	const factionIds = origCombat.units.reduce((fids: Set<string>, u: ShipUnit) => {
		if (!fids.has(u.factionId)) {
			fids.add(u.factionId);
		}
		return fids;
	}, new Set<string>());

	const combat = spaceCombatMain(game, origCombat.units, origCombat.system);
	console.log("COMBAT UNITS AFTER CONFLICT:", combat.units.length, combat.origUnits.length);
	const destroyedUnits = origCombat.units
		.filter((ou: ShipUnit) => {
			const isAlive = combat.units.find((au: ShipUnit) => au.id === ou.id);
			if (!isAlive) {
				return true;
			}
			return false;
		})
		.map((u: ShipUnit) => u.id);

	game.units = game.units.reduce((units: ShipUnit[], unit: ShipUnit) => {
		if (destroyedUnits.includes(unit.id)) return units;
		const cunit = combat.units.find((au: ShipUnit) => au.id === unit.id);
		if (cunit) {
			units.push(cunit);
		} else {
			units.push(unit);
		}

		return units;
	}, []);

	const report = convertSpaceCombatToCombatReport(game, origCombat, combat);
	const docRef = await firestore.collection("Reports").add(report);
	report.id = docRef.id;
	await firestore
		.collection("Reports")
		.doc(report.id)
		.set({ ...report });

	return addReportToSystem(game, origCombat.system, DetailReportType.Combat, Array.from(factionIds), report.id, `Space Combat in ${origCombat.system.name}`);

	// return updateSystemInGame(game, system);
}

function convertSpaceCombatToCombatReport(game: GameModel, origCombat: SpaceCombat, combat: SpaceCombat): CombatReport {
	const report: CombatReport = {
		id: "",
		gameId: game.id,
		systemId: origCombat.system.id,
		title: "Combat Report!",
		turn: game.turn,
		type: DetailReportType.Combat,
		factionIds: game.factions.map((fm: FactionModel) => fm.id),
		rounds: combat.roundLog,
		units: combat.units,
		origUnits: [...origCombat.units, ...combat.origUnits.filter((s: ShipUnit) => s.type === SHIPCLASS.FIGHTER)],
	};

	return report;
}

function updateSystemInGame(game: GameModel, updatedSystem: SystemModel): GameModel {
	game.systems = game.systems.reduce((systems: SystemModel[], sys: SystemModel) => {
		if (sys.id === updatedSystem.id) {
			systems.push(updatedSystem);
		} else {
			systems.push(sys);
		}
		return systems;
	}, []);

	return { ...game };
}

function updateUnitInGame(game: GameModel, updatedUnit: ShipUnit): GameModel {
	game.units = game.units.map((um: ShipUnit) => {
		if (um.id === updatedUnit.id) {
			return updatedUnit;
		}
		return um;
	});

	return { ...game };
}

function updateFactionInGame(game: GameModel, faction: FactionModel): GameModel {
	game.factions = game.factions.map((fm: FactionModel) => {
		if (fm.id === faction.id) {
			return faction;
		}
		return fm;
	});
	return { ...game };
}

function addReportToSystem(game: GameModel, system: SystemModel, type: DetailReportType, factionIds: string[], reportId: string, title: string): GameModel {
	system.reports.push({
		factions: factionIds,
		turn: game.turn,
		type: type,
		title: title,
		reportId: reportId,
	});

	return updateSystemInGame(game, system);
}

function markCommandDone(command: Command) {
	command.completed = true;
}

function payActionPointCost(oldGame: GameModel, command: Command): GameModel {
	const game = { ...oldGame };

	game.factions = game.factions.map((f: FactionModel) => {
		if (f.id === command.factionId) {
			f.aps -= command.actionPoints;
			return { ...f };
		}
		return f;
	});

	return game;
}
