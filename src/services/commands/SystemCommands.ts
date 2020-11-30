import { joki } from "jokits-react";
import { BUILDINGTYPE } from "../../data/dataBuildings";

import { BuildBuildingCommand, BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../../models/Commands";
import { GameModel, SystemModel } from "../../models/Models";
import { ShipDesign } from "../../models/Units";
import { User } from "../../models/User";
import { getBuildingTime } from "../../utils/buildingUtils";
import { factionCanDoMoreCommands, factionHasEnoughActionPoints, getFactionByUserId } from "../helpers/FactionHelpers";
import { SERVICEID } from "../services";

export function plusEconomy(targetSystem: SystemModel, apCost=1) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemEconomy);

	if (!rootCommand) {
		console.log("Cannot do plus Economy command for ", targetSystem);
		return;
	}

	const command = { ...rootCommand, targetSystem: targetSystem.id, actionPoints: apCost } as SystemPlusCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function plusIndustry(targetSystem: SystemModel, apCost=1) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemIndustry);

	if (!rootCommand) {
		console.log("Cannot do plus Industry command for ", targetSystem);
		return;
	}

	const command = { ...rootCommand, targetSystem: targetSystem.id, actionPoints: apCost } as SystemPlusCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function plusWelfare(targetSystem: SystemModel, apCost=1) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemWelfare);

	if (!rootCommand) {
		console.log("Cannot do plus Welfare command for ", targetSystem);
		return;
	}

	const command = { ...rootCommand, targetSystem: targetSystem.id, actionPoints: apCost } as SystemPlusCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function plusDefense(targetSystem: SystemModel, apCost=1) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemDefense);

	if (!rootCommand) {
		console.log("Cannot do plus Defense command for ", targetSystem);
		return;
	}

	const command = { ...rootCommand, targetSystem: targetSystem.id, actionPoints: apCost} as SystemPlusCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function doBuildBuilding(systemId: string, buildingType: BUILDINGTYPE) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemBuildingBuild);

	if (!rootCommand) {
		console.log("Cannot do build a building ", buildingType, systemId);
		return;
	}

	const command = { ...rootCommand, targetSystem: systemId, buildingType: buildingType, turnsLeft: getBuildingTime(buildingType) } as BuildBuildingCommand;

	console.log("Build building", command);
	joki.trigger({
		to: SERVICEID.CommandService,
		action: "addCommand",
		data: command,
	});
}

export function doRemoveBuilding(systemId: string, buildingId: BUILDINGTYPE) {
	if (factionIsReady()) return;
	console.log("Remove building", systemId, buildingId);
}

export function doRemoveCommand(commandId: string) {
	if (factionIsReady()) return;
	joki.trigger({
		to: "CommandService",
		action: "removeCommand",
		data: commandId,
	});
}

export function doBuildUnit(ship: ShipDesign, systemId: string) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemBuildUnit);

	if (!rootCommand) {
		console.log("Cannot do build unit for ", ship, systemId);
		return;
	}

	const command = {
		...rootCommand,
		shipName: ship.name,
		targetSystem: systemId,
		turnsLeft: ship.buildTime || 1,
	} as BuildUnitCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function createEmptyCommandForCurrentFactionAndGame(type: CommandType, actionPointCost=1): Command | undefined {
	const user = joki.service.getState(SERVICEID.UserService) as User | null;
	const game = joki.service.getState(SERVICEID.GameService) as GameModel;
	const commands = joki.service.getState(SERVICEID.CommandService) as Command[];

	if (!user || !game || !commands) return;

	const faction = getFactionByUserId(game.factions, user.id);

	if (!faction) return;

	// if (!factionCanDoMoreCommands(game, commands, faction)) {
	// 	return;
	// }

	const command: Command = {
		id: "",
		gameId: game.id,
		factionId: faction.id,
		type: type,
		completed: false,
		actionPoints: actionPointCost,
		turn: game.turn,
	};

	if(!factionHasEnoughActionPoints(game, faction, commands, command)) {
		return;
	}

	return command;
}

export function factionIsReady() {
	const user = joki.service.getState(SERVICEID.UserService) as User | null;
	const game = joki.service.getState(SERVICEID.GameService) as GameModel;

	if (!user || !game) return true;

	const faction = getFactionByUserId(game.factions, user.id);

	if (!faction) return true;

	return game.factionsReady.includes(faction.id);
}

