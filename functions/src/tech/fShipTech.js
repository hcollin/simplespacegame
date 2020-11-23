"use strict";
exports.__esModule = true;
var fDataTechnology_1 = require("../data/fDataTechnology");
var fTechTools_1 = require("./fTechTools");
/**
 * Technology function for IonEngines
 */
function techIonEngines(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.IonEngines))
        return 0;
    return 1;
}
exports.techIonEngines = techIonEngines;
/**
 * Returns the adjustment for speed for units for factions with Warp Engines
 * @param
 */
function techWarpEngines(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.WarpEngines))
        return 0;
    return 3;
}
exports.techWarpEngines = techWarpEngines;
function techTargetingComputerOne(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.TargetingComp1))
        return 0;
    return 5;
}
exports.techTargetingComputerOne = techTargetingComputerOne;
function techTargetingComputerTwo(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.TargetingComp2))
        return 0;
    return 5;
}
exports.techTargetingComputerTwo = techTargetingComputerTwo;
function techTargetingComputerThree(faction) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.TargetingComp3))
        return 0;
    return 10;
}
exports.techTargetingComputerThree = techTargetingComputerThree;
function techHeavyRounds(faction, damage) {
    function dmgMultiplier(techId, mult, dmg) {
        if (!fTechTools_1.factionHasTechnology(faction, techId)) {
            return dmg;
        }
        if (Array.isArray(dmg)) {
            return [Math.round(dmg[0] * mult), Math.round(dmg[1] * mult)];
        }
        return Math.round(dmg * mult);
    }
    return dmgMultiplier(fDataTechnology_1.TECHIDS.HeavyRounds3, 1.1, dmgMultiplier(fDataTechnology_1.TECHIDS.HeavyRounds2, 1.1, dmgMultiplier(fDataTechnology_1.TECHIDS.HeavyRounds1, 1.05, damage)));
}
exports.techHeavyRounds = techHeavyRounds;
function techManouveringJets(faction, agility) {
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.ManouveringJets3)) {
        return Math.round(agility * 1.25);
    }
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.ManouveringJets2)) {
        return Math.round(agility * 1.15);
    }
    if (fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.ManouveringJets1)) {
        return Math.round(agility * 1.05);
    }
    return agility;
}
exports.techManouveringJets = techManouveringJets;
function techFocusBeam(faction, damage) {
    function dmgMultiplier(techId, mult, dmg) {
        if (!fTechTools_1.factionHasTechnology(faction, techId)) {
            return dmg;
        }
        if (Array.isArray(dmg)) {
            return [Math.round(dmg[0] * mult), Math.round(dmg[1] * mult)];
        }
        return Math.round(dmg * mult);
    }
    return dmgMultiplier(fDataTechnology_1.TECHIDS.FocusBeam3, 1.1, dmgMultiplier(fDataTechnology_1.TECHIDS.FocusBeam2, 1.1, dmgMultiplier(fDataTechnology_1.TECHIDS.FocusBeam1, 1.05, damage)));
}
exports.techFocusBeam = techFocusBeam;
function techPowerShields(faction, ship) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.PowerShields))
        return 0;
    if (ship.shieldRegeneration === 0)
        return 0;
    return Math.round(ship.shieldRegeneration * 1.25);
}
exports.techPowerShields = techPowerShields;
function techAutoRepairBots(faction, ship) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AutoRepBots1))
        return 0;
    return Math.round(ship.hull / 10);
}
exports.techAutoRepairBots = techAutoRepairBots;
function techAutoRepairBots2(faction, ship) {
    if (!fTechTools_1.factionHasTechnology(faction, fDataTechnology_1.TECHIDS.AutoRepBots2))
        return 0;
    return Math.round(ship.sizeIndicator * 3);
}
exports.techAutoRepairBots2 = techAutoRepairBots2;
