import { SHIPWEAPONSPECIAL } from "../data/dataShips";
import { ShipUnit, ShipWeapon } from "../models/Units";




export function specialAntiFighter(weapon: ShipWeapon, attacker: ShipUnit, target: ShipUnit): number {
    if(!weapon.special.includes(SHIPWEAPONSPECIAL.ANTIFIGHTER)) return 0;
    const dmg = Math.round(((15 - (target.sizeIndicator*5))*10));
    return dmg >= 0 ? dmg : 0;

}
