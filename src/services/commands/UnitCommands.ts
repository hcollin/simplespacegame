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
