import { joki } from "jokits-react";
import { BUILDINGTYPE } from "../../data/dataBuildings";

import { BuildBuildingCommand, BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../../models/Commands";
import { GameModel, Coordinates } from "../../models/Models";
import { ShipDesign } from "../../models/Units";
import { User } from "../../models/User";
import { getBuildingTime } from "../../utils/buildingUtils";
import { factionCanDoMoreCommands, getFactionByUserId } from "../helpers/FactionHelpers";
import { SERVICEID } from "../services";

export function plusEconomy(targetSystem: string) {
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemEconomy);

    if (!rootCommand) {
        console.log("Cannot do plus Economy command for ", targetSystem);
        return;
    }

    const command = { ...rootCommand, targetSystem: targetSystem } as SystemPlusCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}


export function plusIndustry(targetSystem: string) {
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemIndustry);

    if (!rootCommand) {
        console.log("Cannot do plus Industry command for ", targetSystem);
        return;
    }

    const command = { ...rootCommand, targetSystem: targetSystem } as SystemPlusCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}


export function plusWelfare(targetSystem: string) {
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemWelfare);

    if (!rootCommand) {
        console.log("Cannot do plus Welfare command for ", targetSystem);
        return;
    }

    const command = { ...rootCommand, targetSystem: targetSystem } as SystemPlusCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}


export function plusDefense(targetSystem: string) {
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.SystemDefense);

    if (!rootCommand) {
        console.log("Cannot do plus Defense command for ", targetSystem);
        return;
    }

    const command = { ...rootCommand, targetSystem: targetSystem } as SystemPlusCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}


export function doBuildBuilding(systemId: string, buildingType: BUILDINGTYPE) {
    
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
        data: command
    });
}

export function doRemoveBuilding(systemId: string, buildingId: BUILDINGTYPE) {
    console.log("Remove building", systemId, buildingId);
}

export function doRemoveCommand(commandId: string) {
    joki.trigger({
        to: "CommandService",
        action: "removeCommand",
        data: commandId,
    });
}

export function doBuildUnit(ship: ShipDesign, systemId: string) {
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

export function createEmptyCommandForCurrentFactionAndGame(type: CommandType): Command | undefined {
    const user = joki.service.getState(SERVICEID.UserService) as User | null;
    const game = joki.service.getState(SERVICEID.GameService) as GameModel;
    const commands = joki.service.getState(SERVICEID.CommandService) as Command[];

    if (!user || !game || !commands) return;

    const faction = getFactionByUserId(game.factions, user.id);

    if (!faction) return;

    if (!factionCanDoMoreCommands(game, commands, faction)) {
        return;
    }

    const command: Command = {
        id: "",
        gameId: game.id,
        factionId: faction.id,
        type: type,
        completed: false,
        turn: game.turn,
    };

    return command;
}
