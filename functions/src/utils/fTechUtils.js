"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getTechValue = exports.getTechById = exports.factionPaysForTech = exports.techPrerequisitesFulfilled = exports.missingResearchPoints = exports.canAffordTech = void 0;
var fDataTechnology_1 = require("../data/fDataTechnology");
function canAffordTech(tech, faction) {
    var missingTech = missingResearchPoints(tech, faction);
    var allTechReqs = techPrerequisitesFulfilled(tech, faction);
    return missingTech.size === 0 && allTechReqs === true;
}
exports.canAffordTech = canAffordTech;
function missingResearchPoints(tech, faction) {
    var missing = new Map();
    tech.fieldreqs.forEach(function (val) {
        var field = faction.technologyFields.find(function (f) { return f.field === val[0]; });
        if (!field) {
            throw new Error("Unknown technology requirement field " + val[0]);
        }
        if (field.points < val[1]) {
            missing.set(field.field, field.points - val[1]);
        }
    });
    return missing;
}
exports.missingResearchPoints = missingResearchPoints;
function techPrerequisitesFulfilled(tech, faction) {
    var hasAllTech = true;
    if (tech.techprereq.length > 0) {
        tech.techprereq.forEach(function (tid) {
            if (!faction.technology.includes(tid)) {
                hasAllTech = false;
            }
        });
    }
    return hasAllTech;
}
exports.techPrerequisitesFulfilled = techPrerequisitesFulfilled;
function factionPaysForTech(fields, tech) {
    return fields.map(function (tf) {
        var cost = tech.fieldreqs.find(function (tr) { return tr[0] === tf.field; });
        if (cost) {
            tf.points -= cost[1];
        }
        return __assign({}, tf);
    });
}
exports.factionPaysForTech = factionPaysForTech;
function getTechById(techId) {
    var tech = fDataTechnology_1.DATATECHNOLOGY.find(function (t) { return t.id === techId; });
    if (!tech) {
        throw new Error("Not a valid technology id " + techId);
    }
    return tech;
}
exports.getTechById = getTechById;
/**
 * Total value (as in cost) for the provided technology. This useful in sorting for example.
 *
 * @param tech
 */
function getTechValue(tech) {
    var reqSum = tech.fieldreqs.reduce(function (tot, req) {
        return tot + req[1];
    }, 0);
    return reqSum + tech.techprereq.length * 5;
}
exports.getTechValue = getTechValue;
