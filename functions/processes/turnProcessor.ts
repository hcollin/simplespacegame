import { DATATECHNOLOGY } from "../../src/data/dataTechnology";
import { Command, CommandType, FleetCommand, ResearchCommand, SystemPlusCommand, BuildUnitCommand } from "../../src/models/Commands";
import { Trade } from "../../src/models/Communication";
import { GameModel, GameState, SystemModel, FactionModel, FactionState, FactionTechSetting, Technology, ReportType, SpaceCombat, Coordinates } from "../../src/models/Models";
import { ShipUnit, ShipWeapon } from "../../src/models/Units";
import { getFactionFromArrayById } from "../../src/services/helpers/FactionHelpers";
import { createShipFromDesign, getDesignByName } from "../../src/services/helpers/UnitHelpers";
import { researchPointGenerationCalculator, researchPointDistribution, factionValues } from "../../src/utils/factionUtils";
import { inSameLocation } from "../../src/utils/locationUtils";
import { travelingBetweenCoordinates } from "../../src/utils/MathUtils";
import { rnd } from "../../src/utils/randUtils";
import { canAffordTech, factionPaysForTech } from "../../src/utils/techUtils";
import { getShipSpeed, getFactionAdjustedUnit, getFactionAdjustedWeapon } from "../../src/utils/unitUtils";




export async function processTurn(origGame: GameModel, commands?: Command[]) {
    // if (origGame.state !== GameState.PROCESSING) return origGame;

    let game = { ...origGame };

    game.systems = game.systems.map((sm: SystemModel) => {
        sm.reports = [];
        return sm;
    });


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

    // // Clear Commands
    // api.api.trigger({
    //     from: serviceId,
    //     action: "nextTurn",
    // });

    game.state = GameState.TURN;

    // await saveGame();

    // sendUpdate();
    return { ...game };
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
        const pointsGenerated = researchPointGenerationCalculator(game, fm);
        const distribution = researchPointDistribution(pointsGenerated, fm);

        fm.technologyFields = fm.technologyFields.map((tech: FactionTechSetting, index: number) => {
            tech.points += distribution[index];
            return { ...tech };
        });

        return fm;
    });

    return game;
}


function processTrades(oldGame: GameModel): GameModel {
    let game = { ...oldGame };

    game.trades = game.trades.map((tr: Trade) => {

        let success = false;

        const fromFaction = getFactionFromArrayById(game.factions, tr.from);
        const toFaction = getFactionFromArrayById(game.factions, tr.to);

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
            const faction = getFactionFromArrayById(game.factions, command.factionId);
            if (faction) {
                const tech = DATATECHNOLOGY.find((t: Technology) => t.id === command.techId);
                if (tech && faction && canAffordTech(tech, faction)) {
                    faction.technologyFields = factionPaysForTech(faction.technologyFields, tech);
                    faction.technology.push(tech.id);
                    game = updateFactionInGame(game, faction);
                    markCommandDone(cmd);

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
    markCommandDone(command);
    return updateSystemInGame(game, system);
}

function processSystemWelfareCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.welfare++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}

function processSystemIndustryCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.industry++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}

function processSystemBuildUnitCommand(command: BuildUnitCommand, game: GameModel): GameModel {
    const faction = getFactionFromArrayById(game.factions, command.factionId);

    if (faction) {
        const unit = createShipFromDesign(getDesignByName(command.shipName), command.factionId, command.target);
        if (faction.money >= unit.cost) {
            game.units.push(unit);
            faction.money = faction.money - unit.cost;
            markCommandDone(command);
            return updateFactionInGame(game, faction);
        }
    }

    markCommandDone(command);
    return { ...game };
}

function processSysteDefenseCommand(command: SystemPlusCommand, game: GameModel): GameModel {
    const system = getSystemFromGame(game, command.targetSystem);
    system.defense++;
    markCommandDone(command);
    return updateSystemInGame(game, system);
}

function processFleetMoveCommand(command: FleetCommand, game: GameModel): GameModel {
    let newPoint: Coordinates | null = null;

    let nGame = { ...game };

    command.unitIds.forEach((uid: string) => {
        const unit = getUnitFromGame(game, uid);
        const faction = getFactionFromArrayById(game.factions, unit.factionId);

        if (newPoint === null) {
            newPoint = travelingBetweenCoordinates(unit.location, command.target, getShipSpeed(unit, faction));
        }

        const nUnit = { ...unit };
        nUnit.location = newPoint;
        if (inSameLocation(newPoint, command.target)) {
            markCommandDone(command);
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

    if (origCombat.system === null) {
        throw new Error(`Combat cannot happen outside of a system, the null is only used in testing needs to be removed`);
    }

    const factionIds = origCombat.units.reduce((fids: Set<string>, u: ShipUnit) => {
        if (!fids.has(u.factionId)) {
            fids.add(u.factionId)
        }
        return fids;
    }, new Set<string>());

    const combat = spaceCombatMain(game, origCombat.units, origCombat.system);


    return addReportToSystem(game, origCombat.system, ReportType.COMBAT, Array.from(factionIds), combat.log);

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

function markCommandDone(command: Command) {
    command.completed = true;
}



export function spaceCombatMain(game: GameModel, units: ShipUnit[], system: SystemModel | null): SpaceCombat {

    let combat: SpaceCombat = {
        units: [...units],
        system: system,
        round: 0,
        log: [],
        done: false,
    }

    combat.log.push(`Space combat starts`);
    // PRE COMBAT
    // TODO


    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;
        combat.log.push(`ROUND ${combat.round}`);

        combat = spaceCombatAttacks(game, combat);
        combat = spaceCombatDamageResolve(game, combat);
        combat = spaceCombatMorale(game, combat);


        combat = spaceCombatRoundCleanUp(game, combat);

        // if(combat.round >= 10) {
        //     combat.done = true;
        // }
    }


    // POST COMBAT

    combat.units = combat.units.map((su: ShipUnit) => {
        su.shields = su.shieldsMax;
        su.experience += combat.round;
        return su;
    })

    combat.log.push(`Space combat ends`);
    return combat;
}

export function spaceCombatAttacks(game: GameModel, origCombat: SpaceCombat): SpaceCombat {

    const attackers = [...origCombat.units];

    let combat = { ...origCombat };

    attackers.forEach((ship: ShipUnit) => {
        let hit = false;
        ship.weapons.forEach((weapon: ShipWeapon) => {
            if (weaponCanFire(weapon)) {
                const target = spaceCombatAttackChooseTarget(combat, ship, weapon);
                if (target) {
                    const oldDmg = target.damage + target.shields;
                    combat = spaceCombatAttackShoot(game, combat, ship, weapon, target);
                    const newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg) hit = true;
                }
            } else {
                combat.log.push(`RELOADING: ${ship.factionId} ${ship.name} is reloading ${weapon.name}, ${weapon.cooldown + 1} round until ready to fire`);
            }



        });
        if (hit) {
            ship.experience++;
        }
    });


    return combat;
}

export function spaceCombatAttackChooseTarget(combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon): ShipUnit | null {
    const target = combat.units.find((su: ShipUnit) => {
        return su.factionId !== attacker.factionId;
    });
    if (target) {

        // const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
        //     if(t.factionId !== attacker.factionId) {
        //         const oldHitChance = getHitChance(attacker.factionId, weapon, attacker, t);
        //         const newHitChance = getHitChance(attacker.factionId, weapon, attacker, pos);
        //         const oldDmgPot = damagePotential(weapon, t);
        //         const newDmgPot = damagePotential(weapon, pos);

        //         const valueO = oldHitChance + oldDmgPot;
        //         const valueN = newHitChance + newDmgPot;
        //         if(valueO > valueN) {
        //             return t;
        //         } else {
        //             return pos;
        //         }
        //     }
        //     return t;
        // }, target);

        return target;
    }
    combat.done = true;
    return null;
}

export function spaceCombatAttackShoot(game: GameModel, combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon, target: ShipUnit): SpaceCombat {

    const attackFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    const targetFaction = getFactionFromArrayById(game.factions, target.factionId);

    const hitChance = getHitChance(attackFaction, weapon, attacker, target); //50 + weapon.accuracy - target.agility;
    const hitRoll = rnd(1, 100);

    if (hitRoll <= hitChance) {
        const targetFactionUnit = getFactionAdjustedUnit(targetFaction, target);
        const factionWeapon = getFactionAdjustedWeapon(weapon, attackFaction);
        const dmg = (Array.isArray(factionWeapon.damage) ? rnd(factionWeapon.damage[0], factionWeapon.damage[1]) : factionWeapon.damage) - targetFactionUnit.armor;

        if (target.shields > 0) {

            if (target.shields >= dmg) {
                target.shields -= dmg;
            } else {
                target.damage += dmg - target.shields;
                target.shields = 0;
            }
        } else {
            target.damage += dmg;
        }


        combat.log.push(`HIT (${hitRoll} <= ${hitChance}): ${attacker.factionId} ${attacker.name} shoots ${target.name} of ${target.factionId} with ${weapon.name} causing ${dmg} points of hull damage.`);
        combat.units = combat.units.map((su: ShipUnit) => {
            if (su.id === target.id) {
                return target;
            }
            return su;
        })
    } else {
        combat.log.push(`MISS (${hitRoll} > ${hitChance}): ${attacker.factionId} ${attacker.name} misses ${target.name} of ${target.factionId} with ${weapon.name}.`);
    }


    return { ...combat };
}

export function spaceCombatDamageResolve(game: GameModel, combat: SpaceCombat): SpaceCombat {

    combat.units = combat.units.filter((unit: ShipUnit) => {
        const faction = getFactionFromArrayById(game.factions, unit.factionId);
        if (!faction) throw new Error(`Invalid facion on unit ${unit.id} ${unit.factionId}`);
        const factionUnit = getFactionAdjustedUnit(faction, unit);

        const destroyed = unit.damage >= factionUnit.hull;
        if (destroyed) {
            combat.log.push(`${unit.factionId} ${unit.name} is destroyed with ${unit.damage} / ${factionUnit.hull}!`);
            return false;
        } else {
            combat.log.push(`${unit.factionId} ${unit.name} HULL DAMAGE: ${unit.damage} / ${factionUnit.hull} SHIELDS: ${unit.shields} / ${factionUnit.shieldsMax}`);

        }
        return true;
    });


    return combat;
}

export function spaceCombatMorale(game: GameModel, combat: SpaceCombat): SpaceCombat {
    return combat;
}


export function spaceCombatRoundCleanUp(game: GameModel, combat: SpaceCombat): SpaceCombat {

    combat.units = combat.units.map((su: ShipUnit) => {
        const faction = getFactionFromArrayById(game.factions, su.factionId);
        if (!faction) throw new Error(`Invalid facion on unit ${su.id} ${su.factionId}`);
        const factionUnit = getFactionAdjustedUnit(faction, su);
        // Shield Regeneration
        if (factionUnit.shieldsMax > 0) {
            if (su.shields < factionUnit.shieldsMax) {
                su.shields += factionUnit.shieldRegeneration;
                if (su.shields > factionUnit.shieldsMax) {
                    su.shields = factionUnit.shieldsMax;
                }
            }
        }

        return su;
    })

    if (combat.units.length === 0) combat.done = true;
    if (combat.round >= 20) {
        combat.done = true;
    }
    return { ...combat };
}



export function weaponCanFire(weapon: ShipWeapon): boolean {
    // No cool down
    if (weapon.cooldownTime === 0) {
        return true;
    }

    // Weapon is reloading
    if (weapon.cooldown > 0) {
        weapon.cooldown--;
        return false;
    }

    // Fire!
    weapon.cooldown = weapon.cooldownTime;
    return true;
}

export function getHitChance(faction: FactionModel, weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit): number {
    const targetUnit = getFactionAdjustedUnit(faction, target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, faction);
    let chance = 50 + factionWeapon.accuracy - targetUnit.agility;
    return chance;
}

export function damagePotential(weapon: ShipWeapon, target: ShipUnit, faction: FactionModel): number {
    const targetUnit = getFactionAdjustedUnit(faction, target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, faction);
    const maxDamage = Array.isArray(factionWeapon.damage) ? factionWeapon.damage[1] : factionWeapon.damage;
    const hpleft = targetUnit.hull - target.damage + target.shields;
    return Math.round((maxDamage / hpleft) * 100);
}