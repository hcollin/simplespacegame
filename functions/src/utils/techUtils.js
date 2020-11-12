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
exports.getTechById = exports.factionPaysForTech = exports.canAffordTech = void 0;
var dataTechnology_1 = require("../data/dataTechnology");
function canAffordTech(tech, faction) {
    var canAfford = true;
    tech.fieldreqs.forEach(function (val) {
        var field = faction.technologyFields.find(function (f) { return f.field === val[0]; });
        if (!field) {
            throw new Error("Unknown technology requirement field " + val[0]);
        }
        if (field.points < val[1]) {
            canAfford = false;
        }
        console.log(tech.name, field.field, field.points, val[1], canAfford);
    });
    if (tech.techprereq.length > 0 && canAfford) {
        tech.techprereq.forEach(function (tid) {
            if (!faction.technology.includes(tid)) {
                canAfford = false;
            }
        });
    }
    return canAfford;
}
exports.canAffordTech = canAffordTech;
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
    var tech = dataTechnology_1.DATATECHNOLOGY.find(function (t) { return t.id === techId; });
    if (!tech) {
        throw new Error("Not a valid technology id " + techId);
    }
    return tech;
}
exports.getTechById = getTechById;
