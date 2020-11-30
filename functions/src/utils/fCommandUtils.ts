import { Command, FleetCommand, CommandType } from "../models/fCommands";
import { GameModel, FactionModel } from "../models/fModels";
import { ShipUnit } from "../models/fUnits";
import { commandCountCalculator } from "./fFactionUtils";

export function unitIsInFleet(commands: Command[], unit: ShipUnit): FleetCommand | null {
    // const commands = joki.service.getState("CommandService") as Command[];

    const com = commands.find((cmd: Command) => {
        if (cmd.type === CommandType.FleetMove) {
            const fcmd = cmd as FleetCommand;
            const u = fcmd.unitIds.includes(unit.id);
            if (u) {
                return true;
            }
        }
        return false;
    });

    if (com) {
        return com as FleetCommand;
    }
    return null;
}

export function getActionPointCostOfCommands(commands: Command[]): number {
    return commands.reduce((tot: number, cmd: Command) => {
        return tot + cmd.actionPoints;
    }, 0);
}

export function getFactionActionPointPool(game: GameModel, faction: FactionModel): number {
    const maxCommands = commandCountCalculator(game, faction.id);

    return maxCommands + faction.aps;
}
