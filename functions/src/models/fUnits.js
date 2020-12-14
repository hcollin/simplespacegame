"use strict";
exports.__esModule = true;
var SHIPCLASS;
(function (SHIPCLASS) {
    SHIPCLASS["FIGHTER"] = "Fighter";
    SHIPCLASS["PATROL"] = "Patrol";
    SHIPCLASS["CORVETTE"] = "Corvette";
    SHIPCLASS["FRIGATE"] = "Frigate";
    SHIPCLASS["DESTROYER"] = "Destroyer";
    SHIPCLASS["CRUISER"] = "Cruiser";
    SHIPCLASS["BATTLESHIP"] = "Battleship";
    SHIPCLASS["CARRIER"] = "Carrier";
})(SHIPCLASS = exports.SHIPCLASS || (exports.SHIPCLASS = {}));
var WEAPONTYPE;
(function (WEAPONTYPE) {
    WEAPONTYPE["ENERGY"] = "Energy Weapon";
    WEAPONTYPE["KINETIC"] = "Kinetic Weapon";
    WEAPONTYPE["MORALE"] = "Psychological Weapon";
    WEAPONTYPE["MISSILE"] = "Missile";
    WEAPONTYPE["ODD"] = "Strange Weapon";
})(WEAPONTYPE = exports.WEAPONTYPE || (exports.WEAPONTYPE = {}));
var SHIPKEYWORD;
(function (SHIPKEYWORD) {
    SHIPKEYWORD["TRASPORTED1"] = "Takes 1 Cargo Space";
    SHIPKEYWORD["TRASPORTED2"] = "Takes 2 Cargo Space";
    SHIPKEYWORD["TRASPORTED3"] = "Takes 3 Cargo Space";
    SHIPKEYWORD["BIOSHIP"] = "BioShip";
})(SHIPKEYWORD = exports.SHIPKEYWORD || (exports.SHIPKEYWORD = {}));
var ShipPartSlot;
(function (ShipPartSlot) {
    ShipPartSlot["WEAPON"] = "Weapon";
    ShipPartSlot["ENGINE"] = "Engine";
    ShipPartSlot["SHIELD"] = "Shields";
    ShipPartSlot["OTHER"] = "Other";
})(ShipPartSlot = exports.ShipPartSlot || (exports.ShipPartSlot = {}));
