import { Button, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import CommandList from "../components/CommandList";
import FactionHeader from "../components/FactionHeader";
// import FactionInfo from "../components/FactionInfo"
import LargeMap from "./subviews/LargeMap";
// import SimpleMap from "../components/SimpleMap"
import SystemInfo from "../components/SystemInfo";
import { FactionModel, GameModel, GameState, SpaceCombat, SystemModel } from "../models/Models";
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
import { CombatReport, CombatRoundAttackReport, CombatRoundReport, CombatRoundStatus, DetailReportType } from "../models/Report";
import { SERVICEID } from "../services/services";
import { arnd, arnds, rnd } from "../utils/randUtils";
import CombatViewer from "../components/CombatViewer";
import DATASHIPS from "../data/dataShips";
import { ShipDesign, ShipUnit, ShipWeapon } from "../models/Units";
import { createShipFromDesign } from "../services/helpers/UnitHelpers";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { getFactionAdjustedUnit, getFactionAdjustedWeapon } from "../utils/unitUtils";

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
            };

            const factions = [rep.factionIds[0], rep.factionIds[1], ...arnds(rep.factionIds, rnd(2, 8))];
            


            rep.units = arnds<ShipDesign>(DATASHIPS, factions.length).map((sd: ShipDesign, ind: number) => {
                return createShipFromDesign(sd, factions[ind], star.location);
            });

            const combat = spaceCombatMain(game, rep.units, star);
            console.log("COMBAT", combat);
            rep.rounds = combat.roundLog;

            setReport(rep);
        }
    }, [game, report]);

    if (!game || !report) return null;

    return <CombatViewer combatReport={report} />;
};

export default GameView;

/// Temporary space combat

export function spaceCombatMain(game: GameModel, units: ShipUnit[], system: SystemModel | null): SpaceCombat {
    let combat: SpaceCombat = {
        units: [...units],
        system: system,
        round: 0,
        log: [],
        roundLog: [],
        currentRoundLog: {
            round: 0,
            messages: [],
            attacks: [],
            status: [],
        },
        done: false,
    };

    combat.log.push(`Space combat starts`);
    // PRE COMBAT
    // TODO

    // COMBAT ROUNDS
    while (!combat.done) {
        combat.round++;
        combat.log.push(`ROUND ${combat.round}`);

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

    combat.units = combat.units.map((su: ShipUnit) => {
        su.shields = su.shieldsMax;
        su.experience += combat.round;
        return su;
    });

    combat.log.push(`Space combat ends`);
    return combat;
}

export function spaceCombatAttacks(game: GameModel, origCombat: SpaceCombat): SpaceCombat {
    const attackers = [...origCombat.units];

    let combat = { ...origCombat };

    attackers.forEach((ship: ShipUnit) => {
        let hit = false;
        ship.weapons.forEach((weapon: ShipWeapon) => {
            if(weapon.cooldownTime > 0) console.log(combat.round, ship.id, weapon);
            if (weaponCanFire(weapon)) {
                const target = spaceCombatAttackChooseTarget(combat, ship, weapon);
                if (target) {
                    const oldDmg = target.damage + target.shields;
                    combat = spaceCombatAttackShoot(game, combat, ship, weapon, target);
                    const newDmg = target.damage + target.shields;
                    if (oldDmg < newDmg) hit = true;
                }
            } else {
                const faction = getFactionFromArrayById(game.factions, ship.factionId);
                const logText = `RELOADING: ${faction ? faction.name : "Uknown faction"} ${ship.name} is reloading ${
                    weapon.name
                }, ${weapon.cooldown + 1} round until ready to fire`;
                // combat.currentRoundLog.messages.push(logText);
                combat.log.push(logText);
                combat.currentRoundLog.attacks.push({
                    attacker: ship.id,
                    weapon: weapon.name,
                    result: "RELOAD",
                    hitRoll: weapon.cooldown + 1,
                    damage: 0,
                    hitTarget: 0,
                    target: "",
                });
            }
        });
        if (hit) {
            ship.experience++;
        }
    });

    return combat;
}

export function spaceCombatAttackChooseTarget(
    combat: SpaceCombat,
    attacker: ShipUnit,
    weapon: ShipWeapon
): ShipUnit | null {
    const target = combat.units.find((su: ShipUnit) => {
        return su.factionId !== attacker.factionId;
    });
    if (target) {
        // const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
        //     if(t.factionId !== attacker.factionId) {
        //         const attackerFaction = getFactionFromArrayById(combat.factions, attacker.factionId);
        //         if(!attackerFaction) {
        //             throw new Error("WTF?!");
        //         }
        //         const oldHitChance = getHitChance(attackerFaction, weapon, attacker, t);
        //         const newHitChance = getHitChance(attackerFaction, weapon, attacker, pos);
        //         const oldDmgPot = damagePotential(weapon, t, attackerFaction);
        //         const newDmgPot = damagePotential(weapon, pos, attackerFaction);

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

    const hitChance = getHitChance(attackFaction, weapon, attacker, target); //50 + weapon.accuracy - target.agility;
    const hitRoll = rnd(1, 100);

    if (hitRoll <= hitChance) {
        const targetFactionUnit = getFactionAdjustedUnit(targetFaction, target);
        const factionWeapon = getFactionAdjustedWeapon(weapon, attackFaction);
        const dmg =
            (Array.isArray(factionWeapon.damage)
                ? rnd(factionWeapon.damage[0], factionWeapon.damage[1])
                : factionWeapon.damage) - targetFactionUnit.armor;

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

        const logText = `HIT (${hitRoll} <= ${hitChance}): ${attackFaction.name} ${attacker.name} shoots ${target.name} of ${targetFaction.name} with ${weapon.name} causing ${dmg} points of hull damage.`;
        combat.log.push(logText);
        // combat.currentRoundLog.messages.push(logText);
        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            result: "HIT",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: dmg,
            target: target.id,
        });
        combat.units = combat.units.map((su: ShipUnit) => {
            if (su.id === target.id) {
                return target;
            }
            return su;
        });
    } else {
        const logText = `MISS (${hitRoll} > ${hitChance}): ${attackFaction.name} ${attacker.name} misses ${target.name} of ${targetFaction.name} with ${weapon.name}.`;
        combat.log.push(logText);
        // combat.currentRoundLog.messages.push(logText);
        combat.currentRoundLog.attacks.push({
            attacker: attacker.id,
            weapon: weapon.name,
            result: "MISS",
            hitRoll: hitRoll,
            hitTarget: hitChance,
            damage: 0,
            target: target.id,
        });
    }

    return { ...combat };
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
            combat.log.push(logText);
            combat.currentRoundLog.messages.push(logText);
            return false;
        } else {
            const logText = `${unit.factionId} ${unit.name} HULL DAMAGE: ${unit.damage} / ${factionUnit.hull} SHIELDS: ${unit.shields} / ${factionUnit.shieldsMax}`;
            combat.log.push(logText);
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
