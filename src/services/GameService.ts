import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { joki } from "jokits-react";
import { apiLoadGame, apiNewGame, apiSubscribeToGame, apiUpdateGame } from "../api/apiGame";
import { DATATECHNOLOGY } from "../data/dataTechnology";

import { BuildUnitCommand, Command, CommandType, FleetCommand, ResearchCommand, SystemPlusCommand } from "../models/Commands";
import { Trade } from "../models/Communication";
import {
    GameModel,
    SystemModel,
    Coordinates,
    FactionModel,
    ReportType,
    GameState,
    FactionState,
    FactionTechSetting,
    Technology,
    SpaceCombat,
} from "../models/Models";
import { ShipUnit } from "../models/Units";
import { User } from "../models/User";
// import { techMarketing } from "../tech/businessTech";
import { factionValues, researchPointDistribution, researchPointGenerationCalculator } from "../utils/factionUtils";
import { inSameLocation } from "../utils/locationUtils";
import { travelingBetweenCoordinates } from "../utils/MathUtils";
// import { rnd } from "../utils/randUtils";
import { canAffordTech, factionPaysForTech } from "../utils/techUtils";
import { getUnitSpeed } from "../utils/unitUtils";
import { getFactionById, getFactionByUserId } from "./helpers/FactionHelpers";
import { createNewGame } from "./helpers/GameHelpers";
import { createShipFromDesign, getDesignByName, spaceCombatMain } from "./helpers/UnitHelpers";


export interface NewGameOptions {
    playerCount: number;
}

export default function createGameService(serviceId: string, api: JokiServiceApi): JokiService<GameModel> {
    let game: GameModel = {
        id: "",
        state: GameState.INIT,
        turn: 0,
        systems: [],
        units: [],
        factions: [],
        factionsReady: [],
        trades: [],
    };

    let unsub: null| (() => void) = null;
    // let game: GameModel = createNewGame();

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "processTurn":
                    processTurn();
                    break;
                case "ready":
                    factionReady(event.data);
                    break;
                case "newGame":
                    newGame(event.data as NewGameOptions);
                    break;
                case "loadGame":
                    loadGame(event.data);
                    break;
                case "updateFaction":
                    updateFaction(event.data as FactionModel);
                    break;
                case "updateTrades":
                    game.trades = event.data;
                    sendUpdate();
                    break;
            }

        }
    }

    async function newGame(options: NewGameOptions) {
        console.log("NEW GAME", options);

        game = createNewGame(options.playerCount);
        game = await apiNewGame(game);

        sendUpdate();
        startListening();
    }

    async function loadGame(gameId: string) {
        console.log("LOAD GAME", gameId);

        const res = await apiLoadGame(gameId);
        if(res) {
            game = res;
            sendUpdate();
            startListening();
        }
    }

    function startListening() {
        if(unsub !== null) {
            unsub();
            api.api.trigger({
                from: serviceId,
                action: "unloaded",
                data: game.id
            });
        }

        if(game.id !== "") {
            unsub = apiSubscribeToGame(game.id,(gm) => {
                if(gm.id === game.id) {
                    game = gm;
                    sendUpdate();
                }
            });
            api.api.trigger({
                from: serviceId,
                action: "loaded",
                data: game.id
            });
        } 
    }

    function factionReady(factionId?: string) {
        if (factionId) {
            _setFactionDone(factionId);
            return;
        }
        const user = api.api.getServiceState<User>("UserService");
        if (user) {
            const faction = getFactionByUserId(game.factions, user.id);
            if (faction) {
                _setFactionDone(faction.id);
            }
        }
    }

    async function _setFactionDone(factionId: string) {
        if (!game.factionsReady.includes(factionId)) {
            game.factionsReady.push(factionId);
            
            
            
            let allReady = game.factionsReady.length === game.factions.length
            
            if(allReady) {
                game.state = GameState.PROCESSING;
            } else {
                game.state = GameState.TURN;
            }

            sendUpdate();

            await saveGame();

            if (allReady) {
                processTurn();
            }
        }
    }

    

    function updateFaction(fm: FactionModel) {
        game = updateFactionInGame(game, fm);
        sendUpdate();
    }

    function processTurn() {
        if (game.state !== GameState.TURN) return;

        game.systems = game.systems.map((sm: SystemModel) => {
            sm.reports = [];
            return sm;
        });

        const commands = api.api.getServiceState<Command[]>("CommandService");

        if (commands) {
            game = processSystemCommands(commands, game);
            game = processMovementCommands(commands, game);

            // Process trades
            game = processTrades(game);

            game = processResearchCommands(commands, game);

            game = processCombats(game);
            game = processInvasion(game);
        }

        // Process economy
        game = processEconomy(game);

        // Process Research
        game = processResearch(game);

        // Win Conditions
        game = processWinConditions(game);

        // Increase turn counter
        game.turn++;

        // Clear ready states
        game.factionsReady = [];

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

    async function saveGame() {
        await apiUpdateGame(game);
    }

    function sendUpdate() {
        api.updated({ ...game });
    }

    return {
        eventHandler,
        getState,
    };
}

function processWinConditions(game: GameModel): GameModel {
    const winners: string[] = [];

    // If any player controls half or more of the ringWorlds
    const factionControlsRingworlds: Map<string, number> = new Map<string, number>();
    let totalRingWorlds = 0;
    game.systems.forEach((sm: SystemModel) => {
        if (sm.ringWorld === true) {
            totalRingWorlds++;
            if (sm.ownerFactionId !== "") {
                if (!factionControlsRingworlds.has(sm.ownerFactionId)) {
                    factionControlsRingworlds.set(sm.ownerFactionId, 0);
                }
                const owns = factionControlsRingworlds.get(sm.ownerFactionId);
                if (owns) {
                    factionControlsRingworlds.set(sm.ownerFactionId, owns + 1);
                }
            }
        }
    });

    factionControlsRingworlds.forEach((owned: number, owner: string) => {
        if (owned / totalRingWorlds >= 0.5) {
            winners.push(owner);
        }
    });

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

function processMovementCommands(commands: Command[], oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    commands.forEach((cmd: Command) => {
        if (cmd.type === CommandType.FleetMove) {
            game = processFleetMoveCommand(cmd as FleetCommand, game);
        }
    });

    return game;
}

function processResearch(oldGame: GameModel) {
    const game = { ...oldGame };

    game.factions = game.factions.map((fm: FactionModel) => {
        const pointsGenerated = researchPointGenerationCalculator(fm);
        const distribution = researchPointDistribution(pointsGenerated, fm);

        fm.technologyFields = fm.technologyFields.map((tech: FactionTechSetting, index: number) => {
            tech.points += distribution[index];
            return {...tech};
        });

        return fm;
    });

    return game;
}


function processTrades(oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    game.trades = game.trades.map((tr: Trade) => {

        let success = false;

        const fromFaction = getFactionById(game.factions, tr.from);
        const toFaction = getFactionById(game.factions, tr.to);

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
    })

    return game;
}

function processResearchCommands(commands: Command[], oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    commands.forEach((cmd: Command) => {
        if (cmd.type === CommandType.TechnologyResearch) {
            const command = cmd as ResearchCommand;
            const faction = getFactionById(game.factions, command.factionId);
            if (faction) {
                const tech = DATATECHNOLOGY.find((t: Technology) => t.id === command.techId);
                if (tech && faction && canAffordTech(tech, faction)) {
                    faction.technologyFields = factionPaysForTech(faction.technologyFields, tech);
                    faction.technology.push(tech.id);
                    game = updateFactionInGame(game, faction);
                    markCommandDone(cmd.id);

                }
            }
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
        if (cmd.type === CommandType.SystemBuild) {
            game = processSystemBuildUnitCommand(cmd as BuildUnitCommand, game);
        }
    });

    return game;
}

function processInvasion(oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    const invadedSystems: SystemModel[] = [];

    oldGame.units.forEach((um: ShipUnit) => {
        const star = game.systems.find((s: SystemModel) => inSameLocation(s.location, um.location));
        if (star && star.ownerFactionId !== um.factionId) {
            star.ownerFactionId = um.factionId;
            invadedSystems.push(star);
        }
    });

    invadedSystems.forEach((sm: SystemModel) => {
        game = addReportToSystem(game, sm, ReportType.EVENT, [sm.ownerFactionId], [`System Conquered`]);
    });

    return game;
}

function processEconomy(game: GameModel): GameModel {

    game.factions = game.factions.map((fm: FactionModel) => {
        const values = factionValues(game, fm.id);

        fm.money += values.income;
        return { ...fm };
    });

    return { ...game };
}

function processCombats(game: GameModel): GameModel {
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
                    system: star,
                    round: 0,
                    log: [],
                    done: false,
                });
            }
        }
    });

    combats.length > 0 && console.log("COMBATS", combats);
    combats.forEach((combat: SpaceCombat) => {
        game = resolveCombat(game, combat);
    });

    return { ...game };
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

function processSystemBuildUnitCommand(command: BuildUnitCommand, game: GameModel): GameModel {
    const faction = getFactionById(game.factions, command.factionId);

    if (faction) {
        const unit = createShipFromDesign(getDesignByName(command.shipName), command.factionId, command.target);
        if (faction.money >= unit.cost) {
            game.units.push(unit);
            faction.money = faction.money - unit.cost;
            markCommandDone(command.id);
            return updateFactionInGame(game, faction);
        }
    }

    markCommandDone(command.id);
    return { ...game };
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
            newPoint = travelingBetweenCoordinates(unit.location, command.target, getUnitSpeed(unit));
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

function getUnitFromGame(game: GameModel, unitId: string): ShipUnit {
    const unit = game.units.find((u: ShipUnit) => u.id === unitId);
    if (!unit) {
        throw new Error(`Invalid unit id ${unitId}`);
    }
    return unit;
}

function resolveCombat(game: GameModel, origCombat: SpaceCombat): GameModel {

    if(origCombat.system === null) {
        throw new Error(`Combat cannot happen outside of a system, the null is only used in testing needs to be removed`);
    }

    const factionIds = origCombat.units.reduce((fids: Set<string>, u: ShipUnit) => {
        if(!fids.has(u.factionId)) {
            fids.add(u.factionId)
        }
        return fids;
    }, new Set<string>());

    const combat = spaceCombatMain(origCombat.units, origCombat.system);


    return addReportToSystem(game, origCombat.system, ReportType.COMBAT, Array.from(factionIds), combat.log);
    // system.reports.push({
    //     factions: factionIds,
    //     turn: game.turn,
    //     type: ReportType.COMBAT,
    //     text: combat.log,
    // });

    // return updateSystemInGame(game, system);
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

function markCommandDone(commandId: string) {
    joki.trigger({
        to: "CommandService",
        action: "commandDone",
        data: commandId,
    });
}

function addReportToSystem(
    game: GameModel,
    system: SystemModel,
    type: ReportType,
    factionIds: string[],
    texts: string[]
): GameModel {
    system.reports.push({
        factions: factionIds,
        turn: game.turn,
        type: type,
        text: texts,
    });

    return updateSystemInGame(game, system);
}
