import { joki } from "jokits-react";
import { CommandType, FleetCommand, UnitScrapCommand } from "../../models/Commands";
import { Coordinates } from "../../models/Models";
import { ShipUnit } from "../../models/Units";

import { createEmptyCommandForCurrentFactionAndGame, factionIsReady } from "./SystemCommands";

export function moveUnits(units: ShipUnit[], targetCoords: Coordinates) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.FleetMove);

	if (!rootCommand) {
		console.log("Cannot do fleet movement command for ", units, targetCoords);
		return;
	}

	const command = {
		...rootCommand,
		unitIds: units.map((um: ShipUnit) => um.id),
		target: targetCoords,
		from: {...units[0].location},
	} as FleetCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}

export function doAddUnitToFleet(unit: ShipUnit) {
	joki.trigger({
		to: "FleetService",
		action: "addUnit",
		data: unit,
	});
}

export function doRemoveUnitFromFleet(unit: ShipUnit) {
	joki.trigger({
		to: "FleetService",
		action: "addUnit",
		data: unit.id,
	});
}

export function doSetFleetTarget(coordinates: Coordinates | null) {
	joki.trigger({
		to: "FleetService",
		action: "setTarget",
		data: coordinates,
	});
}

export function doConfirmFleet(coordinates: Coordinates | null) {
	joki.trigger({
		to: "FleetService",
		action: "confirm",
	});
}

export function doCancelFleet(coordinates: Coordinates | null) {
	joki.trigger({
		to: "FleetService",
		action: "cancel",
	});
}

export function doDisbandUnit(unitId: string) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.UnitScrap);


	//TODO CONTINUE WITH ACTION POINT SYSTEM

	if (!rootCommand) {
		console.log("Cannot do scrap Unit command for ", unitId);
		return;
	}

	const command = {
		...rootCommand,
		actionPoints: 0,
		unitId: unitId,
		recycle: false,
	} as UnitScrapCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}


export function doRecycleUnit(unitId: string) {
	if (factionIsReady()) return;
	const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.UnitScrap);

	if (!rootCommand) {
		console.log("Cannot do scrap Unit command for ", unitId);
		return;
	}

	const command = {
		...rootCommand,
		unitId: unitId,
		recycle: true,
	} as UnitScrapCommand;

	joki.trigger({
		to: "CommandService",
		action: "addCommand",
		data: command,
	});
}