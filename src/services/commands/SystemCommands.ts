import { joki } from "jokits-react";
import { Command, CommandType, SystemPlusCommand } from "../../models/Commands";
import { GameModel } from "../../models/Models";
import { User } from "../../models/User";
import { factionCanDoMoreCommands, getFactionByUsedId } from "../helpers/FactionHelpers";

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

export function removeCommand(commandId: string) {
    joki.trigger({
        to: "CommandService",
        action: "removeCommand",
        data: commandId,
    });
}

export function createEmptyCommandForCurrentFactionAndGame(type: CommandType): Command | undefined {
    const user = joki.service.getState("UserService") as User | null;
    const game = joki.service.getState("GameService") as GameModel;

    if (!user || !game) return;

    const faction = getFactionByUsedId(game.factions, user.id);

    if (!faction) return;

    if(!factionCanDoMoreCommands(faction)) {
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
