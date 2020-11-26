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
var fDataBuildings_1 = require("../data/fDataBuildings");
var fModels_1 = require("../models/fModels");
var fFactionUtils_1 = require("../utils/fFactionUtils");
var fMathUtils_1 = require("../utils/fMathUtils");
var fRandUtils_1 = require("../utils/fRandUtils");
function starHasBuilding(star, bt) {
    return star.buildings.find(function (b) { return b.type === bt; }) !== undefined;
}
function buildBuildingRules(star, bt) {
    switch (bt) {
        case fDataBuildings_1.BUILDINGTYPE.COREMINE:
            return (star.keywords.includes(fModels_1.SystemKeyword.MINERALRARE) || star.keywords.includes(fModels_1.SystemKeyword.MINERALRICH));
        case fDataBuildings_1.BUILDINGTYPE.GAIAPROJECT:
            return star.keywords.includes(fModels_1.SystemKeyword.GAIA);
        case fDataBuildings_1.BUILDINGTYPE.TRADEPOST:
            return star.keywords.includes(fModels_1.SystemKeyword.NATIVES);
        default:
            return true;
    }
}
exports.buildBuildingRules = buildBuildingRules;
function buildingBioDome(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.BIODOME)) {
        star.economyMax += 1;
        star.welfareMax += 1;
    }
    return __assign({}, star);
}
exports.buildingBioDome = buildingBioDome;
function buildingTradePost(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.TRADEPOST)) {
        return 1;
    }
    return 0;
}
exports.buildingTradePost = buildingTradePost;
function buildingIndustrySector(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.INDSECTOR)) {
        star.industryMax += 1;
    }
    return __assign({}, star);
}
exports.buildingIndustrySector = buildingIndustrySector;
function buildingBank(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.BANK)) {
        return 3;
    }
    return 0;
}
exports.buildingBank = buildingBank;
function buildingBunkers(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.BUNKERS)) {
        return 3;
    }
    return 0;
}
exports.buildingBunkers = buildingBunkers;
function buildingCoreMine(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.COREMINE)) {
        return 6;
    }
    return 0;
}
exports.buildingCoreMine = buildingCoreMine;
function buildingCGaiaProject(star, type) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.GAIAPROJECT)) {
        if (type === "COMMAND")
            return 1;
        return 3;
    }
    return 0;
}
exports.buildingCGaiaProject = buildingCGaiaProject;
function buildingFactoryAutomation(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.FACTAUTOM)) {
        star.industryMax += 3;
    }
    return __assign({}, star);
}
exports.buildingFactoryAutomation = buildingFactoryAutomation;
function buildingRepairStation(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.REPAIRSTATION)) {
        return 3;
    }
    return 1;
}
exports.buildingRepairStation = buildingRepairStation;
function buildingOrbitalCannon(star, invadingTroops) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.REPAIRSTATION)) {
        var successfullyLanding = 0;
        for (var i = 0; i < invadingTroops; i++) {
            if (fRandUtils_1.roll(75)) {
                successfullyLanding++;
            }
        }
        return successfullyLanding;
    }
    return invadingTroops;
}
exports.buildingOrbitalCannon = buildingOrbitalCannon;
function buildingUniversity(star) {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.UNIVERSITY)) {
        return 3;
    }
    return 0;
}
exports.buildingUniversity = buildingUniversity;
function buildingRobotWorkers(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.ROBOTWORKERS)) {
        return 1.25;
    }
    return 1;
}
exports.buildingRobotWorkers = buildingRobotWorkers;
function buildingCommandCenter(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.CMDCENTER)) {
        return 1;
    }
    return 0;
}
exports.buildingCommandCenter = buildingCommandCenter;
function buildingSpacePort(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.SPACEPORT)) {
        return 2;
    }
    return 1;
}
exports.buildingSpacePort = buildingSpacePort;
function buildingGalacticExchange(star, stars) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.GALEXCH)) {
        return stars.reduce(function (inRange, st) {
            if (st.ownerFactionId === star.ownerFactionId) {
                var dist = fMathUtils_1.distanceBetweenCoordinates(star.location, st.location);
                if (dist <= 20)
                    return inRange + 1;
            }
            return inRange;
        }, 0);
    }
    return 0;
}
exports.buildingGalacticExchange = buildingGalacticExchange;
function buildingGateway(star, target, factionId) {
    return (star.ownerFactionId === factionId &&
        target.ownerFactionId === factionId &&
        starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.GATEWAY) &&
        starHasBuilding(target, fDataBuildings_1.BUILDINGTYPE.GATEWAY));
}
exports.buildingGateway = buildingGateway;
function buildingRingWorld(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.RINGWORLD)) {
        star.economyMax += 2;
        star.welfareMax += 2;
        star.buildingSlots += 3;
    }
    return __assign({}, star);
}
exports.buildingRingWorld = buildingRingWorld;
function buildingDysonSphere(star) {
    return starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.DYSONSP);
}
exports.buildingDysonSphere = buildingDysonSphere;
function buildingArcology(star) {
    if (starHasBuilding(star, fDataBuildings_1.BUILDINGTYPE.ROBOTWORKERS)) {
        star.economyMax += 5;
        star.industryMax += 5;
        star.welfareMax += 5;
    }
    return __assign({}, star);
}
exports.buildingArcology = buildingArcology;
function buildingGalacticSenate(game, faction) {
    var hasSenate = game.systems.find(function (sm) {
        return sm.ownerFactionId === faction.id && starHasBuilding(sm, fDataBuildings_1.BUILDINGTYPE.SENATE);
    });
    if (!hasSenate)
        return 0;
    var values = fFactionUtils_1.factionValues(game, faction.id);
    return Math.floor(values.totalWelfare / 30);
}
exports.buildingGalacticSenate = buildingGalacticSenate;
