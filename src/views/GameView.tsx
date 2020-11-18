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
import DATASHIPS, { SHIPWEAPONSPECIAL } from "../data/dataShips";
import { ShipDesign, ShipUnit, ShipWeapon } from "../models/Units";
import { createShipFromDesign } from "../services/helpers/UnitHelpers";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { getFactionAdjustedUnit, getFactionAdjustedWeapon, getMaxDamageForWeapon } from "../utils/unitUtils";

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
	}),
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

			const factions = [rep.factionIds[0], rep.factionIds[1], ...arnds(rep.factionIds, rnd(2, 12))];

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

/************************************************************************************************* */
/************************************************************************************************* */
/************************************************************************************************* */
/************************************************************************************************* */
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
						const logText = `RELOADING: ${faction ? faction.name : "Uknown faction"} ${ship.name} is reloading ${weapon.name}, ${
							weapon.cooldown + 1
						} round until ready to fire`;
						c.log.push(logText);
						c.currentRoundLog.attacks.push({
							attacker: ship.id,
							weapon: weapon.name,
							result: "RELOAD",
							hitRoll: weapon.cooldown + 1,
							damage: 0,
							hitTarget: 0,
							target: "",
						});
					}
					return { ...c };
				},
				{ ...combat },
			);

			if (hit) {
				ship.experience++;
			}

			return { ...nCombat };
		},
		{ ...origCombat },
	);
}

export function spaceCombatAttackChooseTarget(combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon, game: GameModel): ShipUnit | null {
	const target = combat.units.find((su: ShipUnit) => {
		return su.factionId !== attacker.factionId;
	});
	if (target) {
        console.log(`${combat.round}: ${attacker.name} choosing target for ${weapon.name}:`);
		const betterTarget = combat.units.reduce((t: ShipUnit, pos: ShipUnit) => {
			if (pos.factionId !== attacker.factionId) {
				const posHps = pos.hull + pos.shields - pos.damage;
				const curHps = t.hull + t.shields - t.damage;
                
                if (pos.hull > 0 && posHps < curHps) {
					return pos;
				}

				if (t.hull + t.shields - t.damage <= 0) {
					return pos;
				}

				const oldHitChance = getHitChance(weapon, attacker, t, game);
				const newHitChance = getHitChance(weapon, attacker, pos, game);

				// if (newHitChance > oldHitChance) return pos;

				const oldDmgPot = damagePotential(weapon, attacker, t, game );
				const newDmgPot = damagePotential(weapon, attacker, pos, game);

				const valueO = oldHitChance + oldDmgPot;
				const valueN = newHitChance + newDmgPot;

                
                if(valueO > valueN) {
                    console.log(`\t KEEP: ${t.name} H%${oldHitChance} Dmg: ${oldDmgPot}`);
                    return t;
				} else {
                    console.log(`\t NEW : ${pos.name} H%${newHitChance} Dmg: ${newDmgPot}`);
				    return pos;
				}
			}
			return t;
		}, target);
		if (betterTarget) return betterTarget;
		return target;
	}
	combat.done = true;
	return null;
}

export function spaceCombatAttackShoot(game: GameModel, combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon, target: ShipUnit): SpaceCombat {
	const attackFaction = getFactionFromArrayById(game.factions, attacker.factionId);
	const targetFaction = getFactionFromArrayById(game.factions, target.factionId);

	if (!attackFaction || !targetFaction) return combat;

	const hitChance = getHitChance(weapon, attacker, target, game); //50 + weapon.accuracy - target.agility;
	const hitRoll = rnd(1, 100);

	if (hitRoll <= hitChance) {
		const targetFactionUnit = getFactionAdjustedUnit(targetFaction, target);
		const factionWeapon = getFactionAdjustedWeapon(weapon, attackFaction);

		const [nTarget, dmg] = spaceCombatInflictDamage(factionWeapon, target);

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
			if (su.id === nTarget.id) {
				return { ...nTarget };
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

export function spaceCombatInflictDamage(weapon: ShipWeapon, targetUnit: ShipUnit): [ShipUnit, number] {
	let loop = 1 + (weapon.special.includes(SHIPWEAPONSPECIAL.DOUBLESHOT) ? 1 : 0) + (weapon.special.includes(SHIPWEAPONSPECIAL.RAPIDFIRE) ? 2 : 0) + (weapon.special.includes(SHIPWEAPONSPECIAL.HAILOFFIRE) ? 4 : 0);

    let totalDmg = 0;
	for (let i = 0; i < loop; i++) {
		const dmg = (Array.isArray(weapon.damage) ? rnd(weapon.damage[0], weapon.damage[1]) : weapon.damage) - targetUnit.armor;

		if (targetUnit.shields > 0) {
			if (targetUnit.shields >= dmg) {
				targetUnit.shields -= dmg;
			} else {
				targetUnit.damage += dmg - targetUnit.shields;
				targetUnit.shields = 0;
			}
		} else {
			targetUnit.damage += dmg;
        }
        totalDmg += dmg;
	}

	return [{ ...targetUnit }, totalDmg];
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

export function getHitChance(weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit, game: GameModel): number {
	const attFaction = getFactionFromArrayById(game.factions, attacker.factionId);
	const tarFaction = getFactionFromArrayById(game.factions, attacker.factionId);
	if (!attFaction || !tarFaction) return 0;
	const targetUnit = getFactionAdjustedUnit(tarFaction, target);
	const factionWeapon = getFactionAdjustedWeapon(weapon, attFaction);
    let chance = 50 + factionWeapon.accuracy - targetUnit.agility;
    const sizeMod  = (target.sizeIndicator - attacker.sizeIndicator) * 5;
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
