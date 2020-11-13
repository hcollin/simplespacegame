"use strict";
exports.__esModule = true;
exports.factionHasTechnology = void 0;
function factionHasTechnology(faction, techId) {
    return faction.technology.includes(techId);
}
exports.factionHasTechnology = factionHasTechnology;
