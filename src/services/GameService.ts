import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { joki } from "jokits-react";

import { BuildUnitCommand, Command, CommandType, FleetCommand, SystemPlusCommand } from "../models/Commands";
import { GameModel, SystemModel, UnitModel, Coordinates, FactionModel, CombatEvent } from "../models/Models";
import { expensesCalculator, factionValues } from "../utils/factionUtils";
import { inSameLocation } from "../utils/locationUtils";
import { travelingBetweenCoordinates } from "../utils/MathUtils";
import { rnd } from "../utils/randUtils";
import { getFactionById } from "./helpers/FactionHelpers";
import { createNewGame } from "./helpers/GameHelpers";
import { createUnitFromShip } from "./helpers/UnitHelpers";

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

            game = processCombats(game);
            game = processInvasion(game);
        }

        // Process economy
        game = processEconomy(game);


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
        if(cmd.type === CommandType.SystemBuild) {
            game = processSystemBuildUnitCommand(cmd as BuildUnitCommand, game);
        }
    });

    return game;
}

function processInvasion(oldGame: GameModel): GameModel {

    let game = { ...oldGame };

    const invadedSystems: SystemModel[] = [];

    oldGame.units.forEach((um: UnitModel) => {

        const star = game.systems.find((s: SystemModel) => inSameLocation(s.location, um.location));
        if (star && star.ownerFactionId !== um.factionId) {
            star.ownerFactionId = um.factionId;
            invadedSystems.push(star);
        }
    });

    invadedSystems.forEach((sm: SystemModel) => {
        game = updateSystemInGame(game, sm);
    })

    return game;

}

function processEconomy(game: GameModel): GameModel {

    

    // const incr = game.systems.reduce((money: Map<string, number>, star: SystemModel) => {

    //     if (star.ownerFactionId) {


    //         if (!money.has(star.ownerFactionId)) {
    //             money.set(star.ownerFactionId, 0);
    //         }

    //         const cur = money.get(star.ownerFactionId);
    //         if (cur !== undefined) {
    //             money.set(star.ownerFactionId, cur + star.economy);
    //         }
    //     }

    //     return money;
    // }, new Map<string, number>())

    game.factions = game.factions.map((fm: FactionModel) => {

        const values = factionValues(game, fm.id);

        fm.money += values.income;
        return {...fm};

    });

    return { ...game };
}



function processCombats(game: GameModel): GameModel {


    const combats: CombatEvent[] = [];

    game.systems.forEach((star: SystemModel) => {
        const unitsInSystem = game.units.filter((unit: UnitModel) => inSameLocation(star.location, unit.location));

        if (unitsInSystem.length > 0) {

            const factions = unitsInSystem.reduce((factions: Set<string>, unit: UnitModel) => {
                factions.add(unit.factionId);
                return factions;
            }, new Set<string>());

            if (factions.size > 1) {
                combats.push({
                    units: unitsInSystem,
                    system: star,
                    round: 0,
                    log: [],
                    resolved: false,
                });
            }
        }
    });

    combats.length > 0 && console.log("COMBATS", combats);
    combats.forEach((combat: CombatEvent) => {
        game = resolveCombat(game, combat);
    })

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

    if(faction) {
        const unit = createUnitFromShip(command.shipName, command.factionId, command.target);        
        if(faction.money >= unit.cost) {
            game.units.push(unit);
            faction.money = faction.money - unit.cost;
            markCommandDone(command.id);
            return updateFactionInGame(game, faction);
        }
    }

    markCommandDone(command.id);
    return {...game};

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


function resolveCombat(game: GameModel, origCombat: CombatEvent): GameModel {

    function countFactionsInUnits(units: UnitModel[]): number {
        const factions = units.reduce((factions: Set<string>, unit: UnitModel) => {
            factions.add(unit.factionId);
            return factions;
        }, new Set<string>());
        return factions.size;
    }

    function processCombatRound(combat: CombatEvent): CombatEvent {

        combat.round++;
        combat.log.push(`Combat Round ${combat.round} starts`);

        // Create dice pool for all factions
        const dicePools = combat.units.reduce((dicePool: Map<string, number>, unit: UnitModel) => {

            if (!dicePool.has(unit.factionId)) {
                dicePool.set(unit.factionId, 0);
            }

            const currentPool = dicePool.get(unit.factionId);
            if (currentPool !== undefined) {
                dicePool.set(unit.factionId, currentPool + unit.weapons);
            }


            return dicePool;
        }, new Map<string, number>());

        if (combat.system.ownerFactionId !== "") {
            const pool = dicePools.get(combat.system.ownerFactionId);
            if (pool) {
                dicePools.set(combat.system.ownerFactionId, pool + combat.system.defense);
            }
        }



        // Roll dice

        const hits: Map<string, number> = new Map<string, number>();

        dicePools.forEach((pool: number, factionId: string) => {
            combat.log.push(`${factionId} rolls ${pool} dice!`);

            const rolls: number[] = []
            for (let i = 0; i < pool; i++) {
                rolls.push(rnd(1, 10));
            }

            const fHits = rolls.filter((res: number) => res >= 6).length;

            combat.log.push(`${factionId} rolls ${rolls.join(", ")} producing ${fHits} hits`);

            hits.set(factionId, fHits);
        });



        // Assign hits
        hits.forEach((hits: number, factionId: string) => {

            let unassignedHits: number = hits;
            while (unassignedHits > 0) {

                const targetUnit = combat.units.find((um: UnitModel) => um.factionId !== factionId);
                if (targetUnit) {

                    targetUnit.damage++;
                    unassignedHits--;
                    combat.log.push(`${targetUnit.name} from ${targetUnit.factionId} takes one hit and now has ${targetUnit.damage} damage`);

                    if (targetUnit.damage >= targetUnit.hull) {
                        combat.log.push(`${targetUnit.name} from ${targetUnit.factionId} has been destroyed`);
                        combat.units = combat.units.filter((um: UnitModel) => um.id !== targetUnit.id);
                    } else {
                        combat.units = combat.units.map((um: UnitModel) => {
                            if (um.id === targetUnit.id) {
                                return targetUnit;
                            }
                            return um;
                        });
                    }
                } else {
                    unassignedHits = 0;
                }


            }
        });

        // Check if all dicepools are empty (then the combat ends)
        const dicePoolsOverZero = Array.from(dicePools.values()).filter((v: number) => v > 0).length;
        if (dicePoolsOverZero === 0) {
            combat.resolved = true;
        }

        // If only one faction remains, end combat
        const factionCount = countFactionsInUnits(combat.units);
        if(factionCount <= 1) {
            combat.resolved = true;
        }


        return { ...combat };
    }

    let combat = { ...origCombat };
    combat.log.push(`Combat in ${combat.system.name} begins!`);
    console.log(combat, countFactionsInUnits(combat.units));
    processCombatRound(combat);
    let looper = 0;
    while(combat.resolved === false) {
        combat = processCombatRound(combat);
        looper++;
        if(looper >=10) {
            combat.resolved = true;
        }
    }

    combat.log.push(`Combat in ${combat.system.name} has been resolved!`);

    console.log(combat.log, origCombat.units, combat.units);
    const remainingUnitIds = combat.units.map((um: UnitModel) => um.id);
    const originalCombatUnitIds = origCombat.units.map((um: UnitModel) => um.id);
    const destroyedUnitIds = originalCombatUnitIds.filter((umid: string) => {
            return !remainingUnitIds.includes(umid);
    });

    game.units = game.units.filter((um: UnitModel) => {
        return !destroyedUnitIds.includes(um.id);
    }).map((um: UnitModel) => {
        if(remainingUnitIds.includes(um.id)) {
            const unit = combat.units.find((umm: UnitModel) => umm.id = um.id);
            if(unit) {
                return unit;
            }
        }
        return um;
    });
    
    
    return { ...game };
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

function updateFactionInGame(game: GameModel, faction: FactionModel): GameModel {
    game.factions = game.factions.map((fm: FactionModel) => {
        if(fm.id === faction.id) {
            return faction;
        }
        return fm;
    });
    return {...game};

}

function markCommandDone(commandId: string) {
    joki.trigger({
        to: "CommandService",
        action: "commandDone",
        data: commandId,
    });
}
