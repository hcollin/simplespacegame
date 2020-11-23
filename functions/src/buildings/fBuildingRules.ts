import { BUILDINGTYPE } from "../data/fDataBuildings";
import { Building } from "../models/fBuildings";
import { SystemModel, SystemKeyword, GameModel, FactionModel } from "../models/fModels";
import { factionValues } from "../utils/fFactionUtils";
import { distanceBetweenCoordinates } from "../utils/fMathUtils";
import { roll } from "../utils/fRandUtils";
import { SystemEconomy } from "../utils/fSystemUtils";

function starHasBuilding(star: SystemModel, bt: BUILDINGTYPE): boolean {
    return star.buildings.find((b: Building) => b.type === bt) !== undefined;
}

export function buildBuildingRules(star: SystemModel, bt: BUILDINGTYPE): boolean {
    switch (bt) {
        case BUILDINGTYPE.COREMINE:
            return (
                star.keywords.includes(SystemKeyword.MINERALRARE) || star.keywords.includes(SystemKeyword.MINERALRICH)
            );
        case BUILDINGTYPE.GAIAPROJECT:
            return star.keywords.includes(SystemKeyword.GAIA);
        case BUILDINGTYPE.TRADEPOST:
            return star.keywords.includes(SystemKeyword.NATIVES);
        default:
            return true;
    }
}

export function buildingBioDome(star: SystemEconomy): SystemEconomy {
    if (starHasBuilding(star, BUILDINGTYPE.BIODOME)) {
        star.economyMax += 1;
        star.welfareMax += 1;
    }
    return { ...star };
}

export function buildingTradePost(star: SystemEconomy): number {
    if (starHasBuilding(star, BUILDINGTYPE.TRADEPOST)) {
        return 1;
    }
    return 0;
}

export function buildingIndustrySector(star: SystemEconomy): SystemEconomy {
    if (starHasBuilding(star, BUILDINGTYPE.INDSECTOR)) {
        star.industryMax += 1;
    }
    return { ...star };
}

export function buildingBunkers(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.BUNKERS)) {
        return 3;
    }
    return 0;
}

export function buildingCoreMine(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.COREMINE)) {
        return 3;
    }
    return 0;
}

export function buildingCGaiaProject(star: SystemModel, type: "COMMAND" | "RESEARCH"): number {
    if (starHasBuilding(star, BUILDINGTYPE.GAIAPROJECT)) {
        if (type === "COMMAND") return 1;
        return 3;
    }
    return 0;
}

export function buildingFactoryAutomation(star: SystemEconomy): SystemEconomy {
    if (starHasBuilding(star, BUILDINGTYPE.FACTAUTOM)) {
        star.industryMax += 3;
    }
    return { ...star };
}

export function buildingRepairStation(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.REPAIRSTATION)) {
        return 3;
    }
    return 1;
}

export function buildingOrbitalCannon(star: SystemModel, invadingTroops: number): number {
    if (starHasBuilding(star, BUILDINGTYPE.REPAIRSTATION)) {
        let successfullyLanding = 0;
        for (let i = 0; i < invadingTroops; i++) {
            if (roll(75)) {
                successfullyLanding++;
            }
        }
        return successfullyLanding;
    }
    return invadingTroops;
}

export function buildingUniversity(star: SystemModel): number {
    // const faction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    if (starHasBuilding(star, BUILDINGTYPE.UNIVERSITY)) {
        return 3;
    }
    return 0;
}

export function buildingRobotWorkers(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.ROBOTWORKERS)) {
        return 1.25;
    }
    return 1;
}

export function buildingCommandCenter(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.CMDCENTER)) {
        return 1;
    }
    return 0;
}

export function buildingSpacePort(star: SystemModel): number {
    if (starHasBuilding(star, BUILDINGTYPE.SPACEPORT)) {
        return 2;
    }
    return 1;
}

export function buildingGalacticExchange(star: SystemModel, stars: SystemModel[]): number {
    if (starHasBuilding(star, BUILDINGTYPE.GALEXCH)) {
        return stars.reduce((inRange: number, st: SystemModel) => {
            if (st.ownerFactionId === star.ownerFactionId) {
                const dist = distanceBetweenCoordinates(star.location, st.location);
                if (dist <= 20) return inRange + 1;
            }

            return inRange;
        }, 0);
    }
    return 0;
}

export function buildingGateway(star: SystemModel, target: SystemModel, factionId: string): boolean {
    return (
        star.ownerFactionId === factionId &&
        target.ownerFactionId === factionId &&
        starHasBuilding(star, BUILDINGTYPE.GATEWAY) &&
        starHasBuilding(target, BUILDINGTYPE.GATEWAY)
    );
}

export function buildingRingWorld(star: SystemEconomy): SystemEconomy {
    if (starHasBuilding(star, BUILDINGTYPE.RINGWORLD)) {
        star.economyMax += 2;
        star.welfareMax += 2;
        star.buildingSlots += 3;
    }

    return { ...star };
}

export function buildingDysonSphere(star: SystemModel): boolean {
    return starHasBuilding(star, BUILDINGTYPE.DYSONSP);
}

export function buildingArcology(star: SystemEconomy): SystemEconomy {
    if (starHasBuilding(star, BUILDINGTYPE.ROBOTWORKERS)) {
        star.economyMax += 5;
        star.industryMax += 5;
        star.welfareMax += 5;
    }
    return { ...star };
}

export function buildingGalacticSenate(game: GameModel, faction: FactionModel): number {
    const hasSenate = game.systems.find((sm: SystemModel) => {
        return sm.ownerFactionId === faction.id && starHasBuilding(sm, BUILDINGTYPE.SENATE);
    });
    if (!hasSenate) return 0;

    const values = factionValues(game, faction.id);
    return Math.floor(values.totalWelfare / 30);
}
