import { SYSTEMBONUS } from "../../configs";
import { greekAlphabet, romanNumbers, starName } from "../../data/dataWords";
import { GameModel } from "../../models/Models";
import { SystemModel, SystemKeyword, SystemInfo, Planet, PlanetType } from "../../models/StarSystem";
import { getRandomEnum } from "../../utils/generalUtils";

import { arnd, arnds, rnd, roll } from "../../utils/randUtils";
import { getSpecialChances } from "./GameHelpers";

const starColors: string[] = ["#FFFD", "#FDAD", "#FF8D"];

let sysIds = 1000;

export function createNewSystem(ax = 1, ay = 1, as = 99, special = "AVERAGE"): SystemModel {
    const id = sysIds++;

    const rx = rnd(0, as / 2) * 2;
    const ry = rnd(0, as / 2) * 2;

    const x = ax + rx;
    const y = ay + ry;

    const star: SystemModel = {
        id: `star-${id}`,
        color: arnd(starColors),
        defense: 0,
        economy: 0,
        welfare: 0,
        industry: 0,
        name: randomStarName(),
        location: {
            x,
            y,
        },
        ownerFactionId: "",
        keywords: [],
        reports: [],
        buildings: [],
    };

    if (roll(getSpecialChances(special))) {
        const key = arnd(SYSTEMBONUS);
        star.keywords.push(key);
    }

    // star.info = systemInfoGenerator(star);
    star.info = systemInfoGenerator(star);

    let fillC = "#777";
    if (star.keywords.includes(SystemKeyword.HOSTILE)) {
        fillC = "#F00";
    }
    if (star.keywords.includes(SystemKeyword.MINERALRARE)) {
        fillC = "#FFD700";
    }
    if (star.keywords.includes(SystemKeyword.MINERALRICH)) {
        fillC = "#68C";
    }
    if (star.keywords.includes(SystemKeyword.NATIVES)) {
        fillC = "#88F";
    }
    if (star.keywords.includes(SystemKeyword.ARTIFACTS)) {
        fillC = "#F0F";
    }
    if (star.keywords.includes(SystemKeyword.GAIA)) {
        fillC = "#0F0";
    }
    if (star.keywords.includes(SystemKeyword.MINERALPOOR)) {
        fillC = "#A33";
    }

    star.color = fillC;

    star.description = systemDescriptionGenerator(star);
    // console.log("system info", star.info);
    return star;
}

export function createRandomMap(starCount: number, size = 99, special = "AVERAGE"): SystemModel[] {
    const stars: SystemModel[] = [];

    const c = Math.round(starCount / 10);
    const p = size / 3;

    // [x, y, size, star count]
    const ar: [number, number, number, number][] = [
        [1, 1, p - 1, c],
        [p, 1, p - 1, c * 2],
        [p * 2, 1, p - 1, c * 3],
        [1, p, p - 1, c * 4],
        [p, p, p - 1, c * 5],
        [p * 2, p, p - 1, c * 6],
        [1, p * 2, p - 1, c * 7],
        [p, p * 2, p - 1, c * 8],
        [p * 2, p * 2, p - 1, c * 9],
        [p, p, p - 1, starCount],
    ];

    let confIndex = 0;
    let conf = ar[confIndex];

    while (stars.length < starCount) {
        if (stars.length > conf[3]) {
            confIndex++;
            conf = ar[confIndex];
        }

        const star = createNewSystem(conf[0], conf[1], conf[2], special);

        if (
            stars.findIndex(
                (sm: SystemModel) =>
                    (sm.location.x === star.location.x && sm.location.y === star.location.y) || sm.name === star.name
            ) === -1
        ) {
            stars.push(star);
        }
    }

    return stars;
}

export function randomStarName() {
    const gr = roll(15) ? ` ${arnd(greekAlphabet)}` : "";
    const rm = roll(15) ? ` ${arnd(romanNumbers)}` : "";
    return `${arnd(starName)}${gr}${rm}`;
}

export function getSystemById(game: GameModel, systemId: string): SystemModel | undefined {
    // const game = joki.service.getState("GameService") as GameModel;
    return game.systems.find((sm: SystemModel) => sm.id === systemId);
}

export function systemDescriptionGenerator(star: SystemModel): string {
    const planetCount = rnd(1, 12);
    const starClass = arnd(["O", "B", "A", "F", "G", "K", "M"]);

    return `${star.name} is ${starClass} class star with  ${planetCount} planets circling it.`;
}

export function systemInfoGenerator(star: SystemModel): SystemInfo {
    const planets = arnds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], rnd(1, 6), true).map((d: number) => {
        return planetGenerator(star, d);
    });

    return {
        planets: planets,
        starClass: arnd(["O", "B", "A", "F", "G", "K", "M"]),
    };
}

export function planetGenerator(star: SystemModel, distance: number): Planet {
    return {
        population: 0,
        type: getRandomEnum(PlanetType),
        distanceFromStar: distance,
        name: `${star.name} ${distance}`,
        size: rnd(1, 8),
    };
}
