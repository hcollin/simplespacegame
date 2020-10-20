import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { GameModel, SystemModel } from "../models/Models";
import { createNewGame } from "./helpers/GameHelpers";

export default function createGameService(serviceId: string, api: JokiServiceApi): JokiService<GameModel> {
    let game: GameModel = createNewGame();

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "processTurn":
                    processTurn();
                    break;
            }
        }
    }

    function processTurn() {
        const commands = api.api.getServiceState<Command[]>("CommandService");

        if (commands) {
            game = processSystemCommands(commands, game);
        }

        // Increase turn counter
        game.turn++;

        // Clear Commands
        api.api.trigger({
            from: serviceId,
            action: "nextTurn",
        });

        sendUpdate();
    }

    function getState(): GameModel {
        return { ...game };
    }

    function sendUpdate() {
        api.updated({ ...game });
    }

    return {
        eventHandler,
        getState,
    };
}

function processSystemCommands(commands: Command[], oldGame: GameModel): GameModel {
   
    let game = { ...oldGame };

    commands.forEach((cmd: Command) => {
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
    });

    return game;
}

function processSystemEconomyCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.economy++;
    return updateSystemInGame(game, system);
}

function processSystemWelfareCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.welfare++;
    return updateSystemInGame(game, system);
}

function processSystemIndustryCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.industry++;
    return updateSystemInGame(game, system);
}

function processSysteDefenseCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.defense++;
    return updateSystemInGame(game, system);
}

function getSystemFromGame(game: GameModel, systemId: string): SystemModel {
    const system = game.systems.find((sm: SystemModel) => sm.id === systemId);
    if (!system) {
        throw new Error(`Invalid system id ${systemId}`);
    }

    return system;
}

function updateSystemInGame(game: GameModel, updatedSystem: SystemModel): GameModel {

    game.systems = game.systems.reduce((systems: SystemModel[], sys: SystemModel) => {

        if(sys.id === updatedSystem.id) {
            systems.push(updatedSystem);
        } else {
            systems.push(sys)
        };
        return systems;

    }, []);

    return {...game};
}
