import DATASHIPS, { SHIPWEAPONSPECIAL } from "./data/fDataShips";
import { DATATECHNOLOGY } from "./data/fDataTechnology";
import { COMBAT_MAXROUNDS } from "./functionConfigs";
import {
    Command,
    CommandType,
    FleetCommand,
    ResearchCommand,
    SystemPlusCommand,
    BuildUnitCommand,
    BuildBuildingCommand,
} from "./models/fCommands";
import { Trade } from "./models/fCommunication";
import {
    GameModel,
    GameState,
    SystemModel,
    FactionModel,
    FactionState,
    FactionTechSetting,
    Technology,
    ReportType,
    SpaceCombat,
    Coordinates,
} from "./models/fModels";
import { CombatRoundStatus } from "./models/fReport";
import { SHIPCLASS, ShipUnit, ShipWeapon, WEAPONTYPE } from "./models/fUnits";
import { createBuildingFromDesign, getBuildingDesignByType } from "./utils/fBuildingUtils";
import {
    researchPointGenerationCalculator,
    researchPointDistribution,
    factionValues,
    getFactionFromArrayById,
} from "./utils/fFactionUtils";
import { mapAdd } from "./utils/fGeneralUtils";
import { inSameLocation } from "./utils/fLocationUtils";
import { travelingBetweenCoordinates } from "./utils/fMathUtils";
import { rnd, shuffle } from "./utils/fRandUtils";
import { canAffordTech, factionPaysForTech } from "./utils/fTechUtils";
import {
    getShipSpeed,
    getFactionAdjustedUnit,
    getFactionAdjustedWeapon,
    getMaxDamageForWeapon,
    createShipFromDesign,
    getDesignByName,
} from "./utils/fUnitUtils";
import { specialAntiFighter } from "./utils/fWeaponUtils";

export async function processTurn(origGame: GameModel, commands?: Command[]): Promise<[GameModel, Command[]]> {
    // if (origGame.state !== GameState.PROCESSING) return origGame;

    let game = { ...origGame };

    game.systems = game.systems.map((sm: SystemModel) => {
        sm.reports = [];
        return sm;
    });

    console.log("START TURN PROCESSING!", game.name, game.turn);
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
    return [{ ...game }, [...(commands || [])]];
}

function processWinConditions(game: GameModel): GameModel {
    const winners: string[] = [];

    // Score based winning to be done
    
    
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
    });

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
        if (cmd.type === CommandType.SystemBuildUnit) {
            game = processSystemBuildUnitCommand(cmd as BuildUnitCommand, game);
        }
        if (cmd.type === CommandType.SystemBuildingBuild) {
            game = processSystemBuildBuildingCommand(cmd as BuildBuildingCommand, game);
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
                    origUnits: [],
                    system: star,
                    round: 0,
                    done: false,
                    roundLog: [],
                    currentRoundLog: {
                        attacks: [],
                        messages: [],
                        round: 0,
                        status: []
                    }
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
        const shipDesign = getDesignByName(command.shipName);
        const system = getSystemFromGame(game, command.targetSystem);


        if(command.turn === game.turn) {
            if (faction.money >= shipDesign.cost) {
                faction.money = faction.money - shipDesign.cost;
                command.turnsLeft--;
                if(command.turnsLeft === 0) {
                    markCommandDone(command);
                    const unit = createShipFromDesign(shipDesign, command.factionId, system.location);
                    game.units.push(unit); 
                    return updateFactionInGame(game, faction);
                }
                command.save = true;
                return updateFactionInGame(game, faction);

            }
        } else {
            command.turnsLeft--;
            if(command.turnsLeft === 0) {
                markCommandDone(command);
                const unit = createShipFromDesign(shipDesign, command.factionId, system.location);
                game.units.push(unit); 
                return updateFactionInGame(game, faction);
            } else {
                command.save = true;
            }
        }        
    }

    return { ...game };
}

function processSystemBuildBuildingCommand(command: BuildBuildingCommand, game: GameModel): GameModel {
    const faction = getFactionFromArrayById(game.factions, command.factionId);

    if (faction) {
        const bdesign = getBuildingDesignByType(command.buildingType);

        if (command.turn === game.turn) {
            // If faction can afford the building pay the cost and start building;
            if (faction.money >= bdesign.cost) {
                faction.money = faction.money - bdesign.cost;
                command.turnsLeft--;
                if (command.turnsLeft === 0) {
                    markCommandDone(command);
                    const system = getSystemFromGame(game, command.targetSystem);
                    system.buildings.push(createBuildingFromDesign(bdesign));
                    return updateFactionInGame(updateSystemInGame(game, system), faction);
                }
                command.save = true;
                return updateFactionInGame(game, faction);
            }
            // If the cannot build the building just do not execute this command
            //TODO: Add info to turn report about this. When turn reports exist...
        } else {
            command.turnsLeft--;

            // Finish building
            if (command.turnsLeft === 0) {
                const system = getSystemFromGame(game, command.targetSystem);
                system.buildings.push(createBuildingFromDesign(bdesign));
                markCommandDone(command);
                return updateSystemInGame(game, system);
            } else {
                command.save = true;
            }
        }
    }

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
        throw new Error(
            `Combat cannot happen outside of a system, the null is only used in testing needs to be removed`
        );
    }

    const factionIds = origCombat.units.reduce((fids: Set<string>, u: ShipUnit) => {
        if (!fids.has(u.factionId)) {
            fids.add(u.factionId);
        }
        return fids;
    }, new Set<string>());

    const combat = spaceCombatMain(game, origCombat.units, origCombat.system);

    const destroyedUnits = origCombat.units
        .filter((ou: ShipUnit) => {
            const isAlive = combat.units.find((au: ShipUnit) => au.id === ou.id);
            if (!isAlive) {
                return true;
            }
            return false;
        })
        .map((u: ShipUnit) => u.id);

    game.units = game.units.reduce((units: ShipUnit[], unit: ShipUnit) => {
        if (destroyedUnits.includes(unit.id)) return units;
        const cunit = combat.units.find((au: ShipUnit) => au.id === unit.id);
        if (cunit) {
            units.push(cunit);
        } else {
            units.push(unit);
        }

        return units;
    }, []);

    return addReportToSystem(game, origCombat.system, ReportType.COMBAT, Array.from(factionIds), ["Combat occured"]);

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


/***********************************************************************************************************
 * SPACE COMBAT
 */

export function spaceCombatMain(game: GameModel, units: ShipUnit[], system: SystemModel | null): SpaceCombat {
    let combat: SpaceCombat = {
        units: [...units],
        origUnits: [...units],
        system: system,
        round: 0,
        roundLog: [],
        currentRoundLog: {
            round: 0,
            messages: [],
            attacks: [],
            status: [],
        },
        done: false,
    };

    // PRE COMBAT
    
    combat = spaceCombatPreCombat(game, combat, system);


    // TODO

    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;

        combat.currentRoundLog = {
            round: combat.round,
            messages: [],
            attacks: [],
            status: [],
        };

        combat = spaceCombatAttacks(game, combat);
        combat = spaceCombatDamageResolve(game, combat);
        combat = spaceCombatMorale(game, combat);

        combat = spaceCombatRoundCleanUp(game, combat);

        // if(combat.round >= 10) {
        //     combat.done = true;
        // }

        combat.roundLog.push({ ...combat.currentRoundLog });
    }

    // POST COMBAT

    return spaceCombatPostCombat(combat);
}

export function spaceCombatPreCombat(game: GameModel, origCombat: SpaceCombat, system: SystemModel|null): SpaceCombat {

    const combat ={...origCombat};

    // Deploy Fighters
    const designations: string[] = shuffle(["Alpha", "Beta", "Gamma", "Delta", "Phi", "Tau", "Red", "Blue", "Green", "Gold", "Yellow", "Brown", "Tan"]);
    const fighters: ShipUnit[] = combat.units.reduce((fighters: ShipUnit[], unit: ShipUnit) => {

        if(unit.fighters > 0) {
            const des = designations.pop();
            for(let i=0; i<unit.fighters; i++) {
                const fighter = createShipFromDesign(DATASHIPS[0], unit.factionId, {x: 0, y:0});
                fighter.name = `${des} squadron ${i}`;
                fighters.push(fighter);
            }
        }
        
        return fighters;
    }, []);
    
    combat.units = [...combat.units, ...fighters];
    combat.origUnits = [...combat.units];

    return {...combat};
}

export function spaceCombatPostCombat(combat: SpaceCombat): SpaceCombat {

    // Fighters returning to their ships if possible
    const fightersPerFaction = new Map<string, number>();
    combat.units.forEach((s: ShipUnit) => {
        if(s.type === SHIPCLASS.FIGHTER) {
            mapAdd(fightersPerFaction, s.factionId, 1);
        }
    });

    combat.units = combat.units.map((su: ShipUnit) => {
        su.shields = su.shieldsMax;
        su.experience += combat.round;

        if(su.fightersMax > 0) {
            const fightersLeft = fightersPerFaction.get(su.factionId);
            if(fightersLeft) {
                if(su.fightersMax > fightersLeft) {
                    su.fighters = fightersLeft;
                    fightersPerFaction.set(su.factionId, 0);
                } else {
                    su.fighters = su.fightersMax;
                    fightersPerFaction.set(su.factionId, fightersLeft - su.fightersMax);
                }
            }
        }

        return su;
    }).filter((s: ShipUnit) =>s.type !== SHIPCLASS.FIGHTER);

    return {...combat};
}

export function spaceCombatAttacks(game: GameModel, origCombat: SpaceCombat): SpaceCombat {
    const attackers = [...origCombat.units];
    
    let combat = { ...origCombat };

    return attackers.reduce(
        (combat: SpaceCombat, ship: ShipUnit) => {
            let hit = false;
            const nCombat = ship.weapons.reduce(
                (c: SpaceCombat, weapon: ShipWeapon) => {
                    // if(weapon.cooldownTime > 0) console.log(c.round, ship.id, weapon);
                    if (weaponCanFire(weapon)) {
                        const target = spaceCombatAttackChooseTarget(c, ship, weapon, game);
                        if (target) {
                            const oldDmg = target.damage + target.shields;

                            let rc = spaceCombatAttackShoot(game, c, ship, weapon, target);

                            const newDmg = target.damage + target.shields;

                            if (oldDmg < newDmg) hit = true;
                            return { ...rc };
                        }
                    } else {
                        const faction = getFactionFromArrayById(game.factions, ship.factionId);
                        c.currentRoundLog.attacks.push({
                            attacker: ship.id,
                            weapon: weapon.name,
                            weaponId: weapon.id,
                            result: "RELOAD",
                            hitRoll: weapon.cooldown + 1,
                            damage: 0,
                            hitTarget: 0,
                            target: "",
                        });
                    }
                    return { ...c };
                },
                { ...combat }
            );

            if (hit) {
                ship.experience++;
            }

            return { ...nCombat };
        },
        { ...origCombat }
    );
}

export function spaceCombatAttackChooseTarget(
    combat: SpaceCombat,
    attacker: ShipUnit,
    weapon: ShipWeapon,
    game: GameModel
): ShipUnit | null {
    const target = combat.units.find((su: ShipUnit) => {
        return su.factionId !== attacker.factionId && su.damage < su.hull;
    });
    if (target) {
        // console.log(`${combat.round}: ${attacker.name} choosing target for ${weapon.name}:`);
        // console.log(`\tInitial target: ${target.name}`);
        const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
            if (pos.factionId !== attacker.factionId) {
                const posHps = pos.hull + pos.shields - pos.damage;
                const curHps = t.hull + t.shields - t.damage;

                if (pos.damage >= pos.hull || pos.hull === 0) {
                    return t;
                }

                let points = 0;

                // Hit chance
                const oldHitChance = getHitChance(weapon, attacker, t, game);
                const newHitChance = getHitChance(weapon, attacker, pos, game);
                if (newHitChance < 0) {
                    return t;
                }
                const hitChanceValue = Math.round((newHitChance - oldHitChance) / 10);
                points += hitChanceValue > 10 ? 10 : hitChanceValue < -10 ? -10 : hitChanceValue;

                // Damage potential
                const oldDmgPot = damagePotential(weapon, attacker, t, game);
                const newDmgPot = damagePotential(weapon, attacker, pos, game);

                if (newDmgPot < 0) {
                    return t;
                }
                const dmgPotValue = newDmgPot > 150 ? -1 : Math.round((newDmgPot) / 10);
                const oldDmgPotValue = oldDmgPot > 150 ? -1 : Math.round((oldDmgPot) / 10);
                
                points += dmgPotValue > oldDmgPotValue ? 1 : 0;

                // console.log("\t", pos.typeClassName, pos.name, hitChanceValue, dmgPotValue, points);

                const valueO = oldHitChance / 10 + oldDmgPot;
                const valueN = newHitChance / 10 + newDmgPot;

                if (points <= 0) {
                    // console.log(`\t KEEP: ${t.name} H%${oldHitChance} Dmg: ${oldDmgPot}`);
                    return t;
                } else {
                    // console.log(`\t NEW : ${pos.name} H%:${newHitChance/10}  Dmg:${newDmgPot} Val:${valueN}`);
                    return pos;
                }
            }
            return t;
        }, target);
        // console.log(`\tselected: ${betterTarget.name}`);
        if (betterTarget) return betterTarget;
        return target;
    }
    combat.done = true;
    return null;
}

export function spaceCombatAttackShoot(
    game: GameModel,
    combat: SpaceCombat,
    attacker: ShipUnit,
    weapon: ShipWeapon,
    target: ShipUnit
): SpaceCombat {
    const attackFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    const targetFaction = getFactionFromArrayById(game.factions, target.factionId);

    if (!attackFaction || !targetFaction) return combat;

    const hitChance = getHitChance(weapon, attacker, target, game); //50 + weapon.accuracy - target.agility;
    const hitRoll = rnd(1, 100);

    if (hitRoll <= hitChance) {
        const targetFactionUnit = getFactionAdjustedUnit(targetFaction, target);
        const factionWeapon = getFactionAdjustedWeapon(weapon, attackFaction);

        const [nTarget, dmg] = spaceCombatInflictDamage(factionWeapon, target);

        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            weaponId: weapon.id,
            result: "HIT",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: dmg,
            target: target.id,
        });
        combat.units = combat.units.map((su: ShipUnit) => {
            if (su.id === nTarget.id) {
                return { ...nTarget };
            }
            return su;
        });
    } else {
        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            weaponId: weapon.id,
            result: "MISS",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: 0,
            target: target.id,
        });
    }

    return { ...combat };
}

export function spaceCombatInflictDamage(weapon: ShipWeapon, targetUnit: ShipUnit): [ShipUnit, number] {
    let loop =
        1 +
        (weapon.special.includes(SHIPWEAPONSPECIAL.DOUBLESHOT) ? 1 : 0) +
        (weapon.special.includes(SHIPWEAPONSPECIAL.RAPIDFIRE) ? 2 : 0) +
        (weapon.special.includes(SHIPWEAPONSPECIAL.HAILOFFIRE) ? 4 : 0);

    let totalDmg = 0;
    for (let i = 0; i < loop; i++) {
        const dmg = Array.isArray(weapon.damage) ? rnd(weapon.damage[0], weapon.damage[1]) : weapon.damage;

        let newDmg = 0;
        switch (weapon.type) {
            case WEAPONTYPE.KINETIC:
                [targetUnit, newDmg] = spaceCombatKineticDamage(dmg, weapon, targetUnit);
                break;
            case WEAPONTYPE.MISSILE:
                [targetUnit, newDmg] = spaceCombatMissileDamage(dmg, weapon, targetUnit);
                break;
            default:
                [targetUnit, newDmg] = spaceCombatDefaultDamage(dmg, weapon, targetUnit);
                break;
        }
        totalDmg += newDmg;
        // if (targetUnit.shields  > 0) {
        // 	if (targetUnit.shields >= dmg) {
        // 		targetUnit.shields -= dmg;
        // 	} else {
        //         const dmgThrough = dmg - targetUnit.shields;
        // 		targetUnit.damage += dmgThrough - targetUnit.armor;
        // 		targetUnit.shields = 0;
        // 	}
        // } else {
        // 	targetUnit.damage += dmg - targetUnit.armor;
        // }
    }

    return [{ ...targetUnit }, totalDmg];
}

// Kinetic weapons ignore shields but are more heavily affected by armor
function spaceCombatKineticDamage(damage: number, weapon: ShipWeapon, target: ShipUnit): [ShipUnit, number] {
    const dmg = damage - getArmorValue(weapon, target);
    target.damage += Math.round(dmg > 0 ? dmg : 0);
    
    return [{ ...target }, Math.round(dmg > 0 ? dmg : 0)];
}

// Energy weapons are baseline weapons
function spaceCombatDefaultDamage(damage: number, weapon: ShipWeapon, target: ShipUnit): [ShipUnit, number] {
    let damageLeft = damage;
    if (target.shields > 0) {
        if (target.shields > damageLeft) {
            target.shields -= damageLeft;
            damageLeft = 0;
        } else {
            damageLeft -= target.shields;
            target.shields = 0;
        }
    }
    const dmgPreCheck = damageLeft - getArmorValue(weapon, target);
    const totDmg = dmgPreCheck >= 0 ? dmgPreCheck : 0;

    target.damage += totDmg ;
    return [{ ...target }, totDmg];
}

// Missle weapons cause double damage to shields
function spaceCombatMissileDamage(damage: number, weapon: ShipWeapon, target: ShipUnit): [ShipUnit, number] {
    let damageLeft = damage;
    if (target.shields > 0) {
        if (target.shields > damageLeft * 2) {
            target.shields -= damageLeft * 2;
            damageLeft = 0;
        } else {
            damageLeft -= Math.ceil(target.shields / 2);
            target.shields = 0;
        }
    }
    const dmgPreCheck = damageLeft - getArmorValue(weapon, target);
    const totDmg = dmgPreCheck >= 0 ? dmgPreCheck : 0;
    
    // const totDmg = Math.round(damageLeft >= 0 ? damageLeft : 0);
    
    target.damage += totDmg;
    return [{ ...target }, totDmg];
}

function getArmorValue(weapon: ShipWeapon, target: ShipUnit): number {
    const mult = weapon.type === WEAPONTYPE.KINETIC ? 1.25 : 1;
    return weapon.special.includes(SHIPWEAPONSPECIAL.ARMOURPIERCE) ? 0 : target.armor * mult;
}

export function spaceCombatDamageResolve(game: GameModel, combat: SpaceCombat): SpaceCombat {
    combat.units = combat.units.filter((unit: ShipUnit) => {
        const faction = getFactionFromArrayById(game.factions, unit.factionId);
        if (!faction) throw new Error(`Invalid facion on unit ${unit.id} ${unit.factionId}`);
        const factionUnit = getFactionAdjustedUnit(faction, unit);

        const destroyed = unit.damage >= factionUnit.hull;

        const status: CombatRoundStatus = {
            unitId: unit.id,
            damage: unit.damage,
            shields: unit.shields,
            hull: unit.hull,
            morale: 100,
            retreated: false,
            destroyed: destroyed,
        };

        combat.currentRoundLog.status.push(status);

        if (destroyed) {
            const logText = `${unit.factionId} ${unit.name} is destroyed with ${unit.damage} / ${factionUnit.hull}!`;

            combat.currentRoundLog.messages.push(logText);
            return false;
        } else {
            const logText = `${unit.factionId} ${unit.name} HULL DAMAGE: ${unit.damage} / ${factionUnit.hull} SHIELDS: ${unit.shields} / ${factionUnit.shieldsMax}`;
            combat.currentRoundLog.messages.push(logText);
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
    });

    if (combat.units.length === 0) combat.done = true;
    if (combat.round >= COMBAT_MAXROUNDS) {
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

export function getHitChance(weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit, game: GameModel): number {
    const attFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    const tarFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    if (!attFaction || !tarFaction) return 0;
    const targetUnit = getFactionAdjustedUnit(tarFaction, target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, attFaction);
    
    
    let chance = 50 + factionWeapon.accuracy - targetUnit.agility + specialAntiFighter(weapon, attacker, targetUnit);
    const sizeMod = (target.sizeIndicator - attacker.sizeIndicator) * 2;
    
    return chance + sizeMod;
}

export function damagePotential(weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit, game: GameModel): number {
    const attFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    const tarFaction = getFactionFromArrayById(game.factions, attacker.factionId);
    if (!attFaction || !tarFaction) return 0;
    const targetUnit = getFactionAdjustedUnit(tarFaction, target);
    const factionWeapon = getFactionAdjustedWeapon(weapon, attFaction);
    const maxDamage = getMaxDamageForWeapon(factionWeapon, true, targetUnit.armor);
    const hpleft = targetUnit.hull - target.damage + target.shields;
    return Math.round(((maxDamage - targetUnit.armor) / hpleft) * 100);
}
