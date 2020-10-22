import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { joki } from "jokits-react";
import { Command, CommandType, FleetCommand, SystemPlusCommand } from "../models/Commands";
import { GameModel, SystemModel, UnitModel, Coordinates } from "../models/Models";
import { inSameLocation } from "../utils/locationUtils";
import { travelingBetweenCoordinates } from "../utils/MathUtils";
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
            game = processMovementCommands(commands, game);
            // Space combat here
            game = processInvasion(game);
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

function processMovementCommands(commands: Command[], oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    commands.forEach((cmd: Command) => {
        if (cmd.type === CommandType.FleetMove) {
            game = processFleetMoveCommand(cmd as FleetCommand, game);
        }
    });

    return game;
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

function processInvasion(oldGame: GameModel): GameModel {

    let game = {...oldGame};

    const invadedSystems: SystemModel[] = [];

    oldGame.units.forEach((um: UnitModel) => {

        const star = game.systems.find((s: SystemModel) => inSameLocation(s.location, um.location));
        if(star && star.ownerFactionId !== um.factionId) {
            star.ownerFactionId = um.factionId;
            invadedSystems.push(star);
        }
    });

    invadedSystems.forEach((sm: SystemModel) => {
        game = updateSystemInGame(game, sm);
    })

    return game;

}

function processSystemEconomyCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.economy++;
    markCommandDone(command.id);
    return updateSystemInGame(game, system);
}

function processSystemWelfareCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.welfare++;
    markCommandDone(command.id);
    return updateSystemInGame(game, system);
}

function processSystemIndustryCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.industry++;
    markCommandDone(command.id);
    return updateSystemInGame(game, system);
}

function processSysteDefenseCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.defense++;
    markCommandDone(command.id);
    return updateSystemInGame(game, system);
}

function processFleetMoveCommand(command: FleetCommand, game: GameModel): GameModel {
    let newPoint: Coordinates | null = null;

    let nGame = { ...game };

    command.unitIds.forEach((uid: string) => {
        const unit = getUnitFromGame(game, uid);

        if (newPoint === null) {
            newPoint = travelingBetweenCoordinates(unit.location, command.target, unit.speed);
        }

        const nUnit = { ...unit };
        nUnit.location = newPoint;
        if (inSameLocation(newPoint, command.target)) {
            markCommandDone(command.id);
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

function getUnitFromGame(game: GameModel, unitId: string): UnitModel {
    const unit = game.units.find((u: UnitModel) => u.id === unitId);
    if (!unit) {
        throw new Error(`Invalid unit id ${unitId}`);
    }
    return unit;
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

function updateUnitInGame(game: GameModel, updatedUnit: UnitModel): GameModel {
    game.units = game.units.map((um: UnitModel) => {
        if (um.id === updatedUnit.id) {
            return updatedUnit;
        }
        return um;
    });

    return { ...game };
}

function markCommandDone(commandId: string) {
    joki.trigger({
        to: "CommandService",
        action: "commandDone",
        data: commandId,
    });
}
