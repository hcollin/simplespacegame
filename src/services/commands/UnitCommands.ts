import { joki } from "jokits-react";
import { CommandType, FleetCommand } from "../../models/Commands";
import { Coordinates, UnitModel } from "../../models/Models";

import { createEmptyCommandForCurrentFactionAndGame } from "./SystemCommands";

export function moveUnits(units: UnitModel[], targetCoords: Coordinates) {
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.FleetMove);

    if (!rootCommand) {
        console.log("Cannot do fleet movement command for ", units, targetCoords);
        return;
    }

    const command = {
        ...rootCommand,
        unitIds: units.map((um: UnitModel) => um.id),
        target: targetCoords,
    } as FleetCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}


export function doAddUnitToFleet(unit: UnitModel) {
    joki.trigger({
        to: "FleetService",
        action: "addUnit",
        data: unit,
    });
}

export function doRemoveUnitFromFleet(unit: UnitModel) {
    joki.trigger({
        to: "FleetService",
        action: "addUnit",
        data: unit.id,
    });
}

export function doSetFleetTarget(coordinates: Coordinates|null) {
    joki.trigger({
        to: "FleetService",
        action: "setTarget",
        data: coordinates,
    });
}


export function doConfirmFleet(coordinates: Coordinates|null) {
    joki.trigger({
        to: "FleetService",
        action: "confirm",
    });
}

export function doCancelFleet(coordinates: Coordinates|null) {
    joki.trigger({
        to: "FleetService",
        action: "cancel",
    });
}
