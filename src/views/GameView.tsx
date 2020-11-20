import { Button, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import CommandList from "../components/CommandList";
import FactionHeader from "../components/FactionHeader";
// import FactionInfo from "../components/FactionInfo"
import LargeMap from "./subviews/LargeMap";
// import SimpleMap from "../components/SimpleMap"
import SystemInfo from "../components/SystemInfo";
import { Coordinates, FactionModel, GameModel, GameState, SpaceCombat, SystemModel } from "../models/Models";
// import { doProcessTurn } from "../services/commands/GameCommands"
import useCurrentUser from "../services/hooks/useCurrentUser";

import iconMapSvg from "../images/iconMap.svg";
import iconEconomySvg from "../images/iconEconomy.svg";
import iconScienceSvg from "../images/iconScience.svg";

import iconDiplomacySvg from "../images/iconDiplomacy.svg";
import iconHelpSvg from "../images/iconHelp.svg";

import EconomySheet from "./subviews/EconomySheet";
import HelpView from "./subviews/HelpView";
import ScienceView from "./subviews/ScienceView";
import DiplomacyView from "./subviews/DiplomacyView";
import FleetView from "../components/FleetView";
import SystemView from "../components/SystemView";
import {
    CombatReport,
    CombatRoundAttackReport,
    CombatRoundReport,
    CombatRoundStatus,
    DetailReportType,
} from "../models/Report";
import { SERVICEID } from "../services/services";
import { arnd, arnds, rnd, roll, shuffle } from "../utils/randUtils";
import CombatViewer from "../components/CombatViewer";
import DATASHIPS, { SHIPWEAPONSPECIAL } from "../data/dataShips";
import { SHIPCLASS, ShipDesign, ShipUnit, ShipWeapon, WEAPONTYPE } from "../models/Units";
import { createShipFromDesign } from "../services/helpers/UnitHelpers";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { getFactionAdjustedUnit, getFactionAdjustedWeapon, getMaxDamageForWeapon } from "../utils/unitUtils";
import { specialAntiFighter } from "../utils/weaponUtils";
import { mapAdd } from "../utils/generalUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        factions: {
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "14rem",
            backgroundColor: "#333",
            padding: "0.5rem",
            zIndex: 20,
        },
        rows: {
            marginTop: "5rem",
            display: "flex",
            flexDirection: "row",
        },
        nextTurn: {
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 100,
        },
        mainMenu: {
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 100,

            width: "600px",
            height: "5rem",
            backgroundColor: "#222C",
            borderTopRightRadius: "3rem 100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 4rem 0 2rem",
            borderTop: "solid 3px #8888",
            borderRight: "solid 6px #8888",
            "& > div": {
                flex: "1 1 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                "& > img": {
                    height: "4rem",
                    width: "4rem",
                    filter: "grayscale(0.9)",
                    transform: "scale(0.75)",
                    transition: "all 0.2s ease",
                },
                "&.active": {
                    "& > img": {
                        filter: "none",
                        transform: "scale(1)",
                    },
                },
                "&:hover": {
                    "& > img": {
                        transform: "scale(0.9)",
                        filter: "grayscale(0.75)",
                        cursor: "pointer",
                    },
                },
            },
        },
        processing: {
            display: "flex",
            height: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "radial-gradient(#456 0, #000 100%)",
            "& > h1": {
                color: "#FFFA",
                fontSize: "4rem",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
            },
            "& > div": {
                width: "60%",
                height: "1rem",
                boxShadow: "0 0 1rem 0.25rem #0008",
            },
        },
    })
);

const GameView: FC = () => {
    const classes = useStyles();

    const [view, setView] = useState<string>("map");

    const [game] = useService<GameModel>("GameService");

    // const [user, send] = useCurrentUser();

    // useEffect(() => {
    //     // if (game && !user && send !== undefined) {

    //     //     setTimeout(() => {
    //     //         const faction = game.factions[0];
    //     //         console.log("login as", faction.name, faction.playerId);
    //     //         send("switch", game.factions[0].playerId);
    //     //     }, 500);

    //     // }

    // }, [user, game, send]);

    if (!game) return null;

    if (game.state === GameState.PROCESSING) {
        return (
            <div className={classes.processing}>
                <h1>Processing Turn {game.turn}</h1>
                <LinearProgress />
            </div>
        );
    }

    return (
        <div>
            <FactionHeader />

            {/* <div className={classes.rows}> */}
            {/* <SimpleMap systems={game.systems} factions={game.factions} units={game.units} /> */}

            {view === "map" && (
                <>
                    <LargeMap systems={game.systems} factions={game.factions} units={game.units} />
                    {/* <SystemInfo /> */}
                    <FleetView />
                    <SystemView />
                </>
            )}
            {view === "economy" && <EconomySheet />}
            {view === "science" && <ScienceView />}
            {view === "diplomacy" && <DiplomacyView />}
            {view === "help" && <HelpView />}

            <CombatTestView />

            <CommandList />

            {/* <Button variant="contained" color="primary" onClick={processTurn} className={classes.nextTurn}>END TURN</Button> */}

            {/* <h1>Game {game.turn}</h1> */}

            <div className={classes.mainMenu}>
                <div className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
                    <img src={iconMapSvg} alt="Map View" />
                </div>
                <div className={view === "economy" ? "active" : ""} onClick={() => setView("economy")}>
                    <img src={iconEconomySvg} alt="Economy View" />
                </div>
                <div className={view === "science" ? "active" : ""} onClick={() => setView("science")}>
                    <img src={iconScienceSvg} alt="Science View" />
                </div>
                {/* <div className={view === "units" ? "active": ""} onClick={() => setView("units")}>
                    <img src={iconUnitsSvg} alt="Units View" />
                </div> */}
                <div className={view === "diplomacy" ? "active" : ""} onClick={() => setView("diplomacy")}>
                    <img src={iconDiplomacySvg} alt="Diplomacy View" />
                </div>
                <div className={view === "help" ? "active" : ""} onClick={() => setView("help")}>
                    <img src={iconHelpSvg} alt="Help View" />
                </div>
            </div>
        </div>
    );
};

const CombatTestView: FC = () => {
    const [game] = useService<GameModel>(SERVICEID.GameService);

    const [report, setReport] = useState<CombatReport | null>(null);

    useEffect(() => {
        if (game && report === null) {
            const star = arnd(game.systems);

            const rep: CombatReport = {
                id: "test-id",
                gameId: game.id,
                systemId: star.id,
                title: "Combat Report!",
                turn: game.turn,
                type: DetailReportType.Combat,
                factionIds: game.factions.map((fm: FactionModel) => fm.id),
                rounds: [],
                units: [],
                origUnits: [],
            };

            const targetPoints = rnd(10, 20);

            rep.factionIds.forEach((fid: string) => {
                const fleet = generateFleetForTargetSize(star.location, fid, targetPoints);
                rep.units = [...rep.units, ...fleet];
            });

            // const factions = [rep.factionIds[0], rep.factionIds[1], ...arnds(rep.factionIds, rnd(2, 12))];

            // rep.units = arnds<ShipDesign>(DATASHIPS, factions.length).map((sd: ShipDesign, ind: number) => {
            // 	return createShipFromDesign(sd, factions[ind], star.location);
            // });

            const combat = spaceCombatMain(game, rep.units, star);
            console.log("COMBAT", combat);
            rep.rounds = combat.roundLog;
            rep.origUnits = combat.origUnits;

            setReport(rep);
        }
    }, [game, report]);

    if (!game || !report) return null;

    return <CombatViewer combatReport={report} />;
};

export default GameView;

function generateFleetForTargetSize(location: Coordinates, factionId: string, size: number): ShipUnit[] {
    let points: number = 0;

    const ships: ShipUnit[] = [];

    while (points < size) {
        
        
        const d = arnd<ShipDesign>(DATASHIPS);
        if(d.type !== SHIPCLASS.FIGHTER) {
            const s = createShipFromDesign(d, factionId, location);
            ships.push(s);
            points += s.sizeIndicator;
        
        }
        
    }

    return ships;
}

/************************************************************************************************* */
/************************************************************************************************* */
/************************************************************************************************* */
/************************************************************************************************* */
/// Temporary space combat

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

const COMBAT_MAXROUNDS = 100;
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
