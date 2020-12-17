import DATASHIPS, { SHIPWEAPONSPECIAL } from "../../data/dataShips";
import { FactionModel, GameModel, SpaceCombat } from "../../models/Models";
import { CombatReport, CombatRoundStatus, DetailReportType } from "../../models/Report";
import { SystemModel } from "../../models/StarSystem";
import { ShipUnit, SHIPCLASS, ShipWeapon, WEAPONTYPE } from "../../models/Units";

import { techAutoRepairBots2 } from "../../tech/shipTech";
import { getFactionFromArrayById } from "../../utils/factionUtils";
import { mapAdd } from "../../utils/generalUtils";
import { shuffle, rnd } from "../../utils/randUtils";
import { getFactionAdjustedWeapon, getFactionAdjustedUnit, getMaxDamageForWeapon, createShipFromDesign } from "../../utils/unitUtils";
import { specialAntiFighter } from "../../utils/weaponUtils";

const COMBAT_MAXROUNDS = 100;


export function resolveCombat(game: GameModel, origCombat: SpaceCombat): CombatReport {
	if (origCombat.system === null) {
		throw new Error(`Combat cannot happen outside of a system, the null is only used in testing needs to be removed`);
	}

	const factionIds = origCombat.units.reduce((fids: Set<string>, u: ShipUnit) => {
		if (!fids.has(u.factionId)) {
			fids.add(u.factionId);
		}
		return fids;
	}, new Set<string>());

	const combat = spaceCombatMain(game, origCombat.units, origCombat.system);
	console.log("COMBAT UNITS AFTER CONFLICT:", combat.units.length, combat.origUnits.length);
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

	const report = convertSpaceCombatToCombatReport(game, origCombat, combat);
	// const docRef = await firestore.collection("Reports").add(report);
	// report.id = docRef.id;
	// await firestore
	// 	.collection("Reports")
	// 	.doc(report.id)
	// 	.set({ ...report });
	return report;
	// return addReportToSystem(game, origCombat.system, DetailReportType.Combat, Array.from(factionIds), report.id, `Space Combat in ${origCombat.system.name}`);

	// return updateSystemInGame(game, system);
}



function convertSpaceCombatToCombatReport(game: GameModel, origCombat: SpaceCombat, combat: SpaceCombat): CombatReport {
	const report: CombatReport = {
		id: "",
		gameId: game.id,
		systemId: origCombat.system.id,
		title: "Combat Report!",
		turn: game.turn,
		type: DetailReportType.Combat,
		factionIds: game.factions.map((fm: FactionModel) => fm.id),
		rounds: combat.roundLog,
		units: combat.units,
		origUnits: [...origCombat.units, ...combat.origUnits.filter((s: ShipUnit) => s.type === SHIPCLASS.FIGHTER)],
	};

	return report;
}


export function spaceCombatMain(game: GameModel, units: ShipUnit[], system: SystemModel): SpaceCombat {
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

		if (combat.round > 100) combat.done = true;
	}

	// POST COMBAT

	return spaceCombatPostCombat(combat);
}

export function spaceCombatPreCombat(game: GameModel, origCombat: SpaceCombat, system: SystemModel | null): SpaceCombat {
	const combat = { ...origCombat };

	// Deploy Fighters
	const designations: string[] = shuffle(["Alpha", "Beta", "Gamma", "Delta", "Phi", "Tau", "Red", "Blue", "Green", "Gold", "Yellow", "Brown", "Tan"]);
	const fighters: ShipUnit[] = combat.units.reduce((fighters: ShipUnit[], unit: ShipUnit) => {
		if (unit.fighters > 0) {
			const des = designations.pop();
			for (let i = 0; i < unit.fighters; i++) {
				const fighter = createShipFromDesign(DATASHIPS[0], unit.factionId, { x: 0, y: 0 });
				fighter.name = `${des} squadron ${i}`;
				fighters.push(fighter);
			}
		}

		return fighters;
	}, []);
	combat.units = [...combat.units, ...fighters];
	combat.origUnits = [
		...combat.units.map((s: ShipUnit) => {
			return { ...s };
		}),
	];

	return { ...combat };
}

export function spaceCombatPostCombat(combat: SpaceCombat): SpaceCombat {
	// Fighters returning to their ships if possible
	const fightersPerFaction = new Map<string, number>();
	combat.units.forEach((s: ShipUnit) => {
		if (s.type === SHIPCLASS.FIGHTER) {
			mapAdd(fightersPerFaction, s.factionId, 1);
		}
	});

	combat.units = combat.units
		.map((su: ShipUnit) => {
			su.shields = su.shieldsMax;
			su.experience += combat.round;

			if (su.fightersMax > 0) {
				const fightersLeft = fightersPerFaction.get(su.factionId);
				if (fightersLeft) {
					if (su.fightersMax > fightersLeft) {
						su.fighters = fightersLeft;
						fightersPerFaction.set(su.factionId, 0);
					} else {
						su.fighters = su.fightersMax;
						fightersPerFaction.set(su.factionId, fightersLeft - su.fightersMax);
					}
				}
			}

			return su;
		})
		.filter((s: ShipUnit) => s.type !== SHIPCLASS.FIGHTER);

	return { ...combat };
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
						ship = updateWeaponInUnit(ship, updateCooldownTime(weapon));
						const target = spaceCombatAttackChooseTarget(c, ship, weapon, game);
						c = updateUnitInCombat(c, ship);
						if (target) {
							const oldDmg = target.damage + target.shields;
							c.currentRoundLog.messages.push(`${ship.name}:${weapon.name}:FIRES:${target.name}`);
							const rc = spaceCombatAttackShoot(game, c, ship, weapon, target);

							const newDmg = target.damage + target.shields;

							if (oldDmg < newDmg) hit = true;
							return { ...rc };
						}
					} else {
						c.currentRoundLog.messages.push(`${ship.name}:${weapon.name}: Cannot fire`);
						ship = updateWeaponInUnit(ship, updateCooldownTime(weapon));
						c = updateUnitInCombat(c, ship);
						const faction = getFactionFromArrayById(game.factions, ship.factionId);
						console.log("WEAPON:", ship.name, weapon, c.round);
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
				const dmgPotValue = newDmgPot > 150 ? -1 : Math.round(newDmgPot / 10);
				const oldDmgPotValue = oldDmgPot > 150 ? -1 : Math.round(oldDmgPot / 10);

				points += dmgPotValue > oldDmgPotValue ? 1 : 0;

				// console.log("\t", pos.typeClassName, pos.name, hitChanceValue, dmgPotValue, points);

				// const valueO = oldHitChance / 10 + oldDmgPot;
				// const valueN = newHitChance / 10 + newDmgPot;

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
	combat.currentRoundLog.messages.push(`No valid target found for ${attacker.name}. Combat ends.`);

	const factionsWithUnitsInCombat = combat.units.reduce((fs: string[], unit: ShipUnit) => {
		if (!fs.includes(unit.factionId)) {
			fs.push(unit.factionId);
		}
		return fs;
	}, []);
	if (factionsWithUnitsInCombat.length < 2) {
		combat.done = true;
	}

	return null;
}

export function spaceCombatAttackShoot(game: GameModel, combat: SpaceCombat, attacker: ShipUnit, weapon: ShipWeapon, target: ShipUnit): SpaceCombat {
	const attackFaction = getFactionFromArrayById(game.factions, attacker.factionId);
	const targetFaction = getFactionFromArrayById(game.factions, target.factionId);

	if (!attackFaction || !targetFaction) return combat;

	const hitChance = getHitChance(weapon, attacker, target, game); //50 + weapon.accuracy - target.agility;
	const hitRoll = rnd(1, 100);

	combat.currentRoundLog.messages.push(`${attacker.name}:${weapon.name}:${hitRoll}/${hitChance}`);
	if (hitRoll <= hitChance) {
		// const targetFactionUnit = getFactionAdjustedUnit(targetFaction, target);
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

	target.damage += totDmg;
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

		su.damage -= techAutoRepairBots2(faction, su);
		if (su.damage < 0) {
			su.damage = 0;
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
		return false;
	}
	// Fire!
	return true;
}

export function updateCooldownTime(weapon: ShipWeapon): ShipWeapon {
	// No cool down
	if (weapon.cooldownTime === 0) {
		return weapon;
	}

	// Weapon is reloading
	if (weapon.cooldown > 0) {
		weapon.cooldown--;
		return { ...weapon };
	}

	// Fire!
	weapon.cooldown = weapon.cooldownTime;
	return { ...weapon };
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

export function updateUnitInCombat(combat: SpaceCombat, unit: ShipUnit): SpaceCombat {
	combat.units = combat.units.map((s: ShipUnit) => {
		if (s.id === unit.id) {
			return { ...unit };
		}
		return s;
	});

	return { ...combat };
}

function updateWeaponInUnit(unit: ShipUnit, weapon: ShipWeapon): ShipUnit {
	unit.weapons = unit.weapons.map((w: ShipWeapon) => {
		if (w.id === weapon.id) {
			return { ...weapon };
		}
		return w;
	});
	return { ...unit };
}
