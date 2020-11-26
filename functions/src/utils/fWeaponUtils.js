"use strict";
exports.__esModule = true;
var fDataShips_1 = require("../data/fDataShips");
function specialAntiFighter(weapon, attacker, target) {
    if (!weapon.special.includes(fDataShips_1.SHIPWEAPONSPECIAL.ANTIFIGHTER))
        return 0;
    var dmg = Math.round(((15 - (target.sizeIndicator * 5)) * 10));
    return dmg >= 0 ? dmg : 0;
}
exports.specialAntiFighter = specialAntiFighter;
