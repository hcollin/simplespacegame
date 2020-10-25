import { joki } from "jokits-react";
import { greekAlphabet, romanNumbers, starName } from "../../data/dataWords";
import { Coordinates, GameModel, SystemModel } from "../../models/Models";
import { inSameLocation } from "../../utils/locationUtils";
import { arnd, rnd, roll } from "../../utils/randUtils";

const starColors: string[] = ["#FFFD", "#FDAD", "#FF8D"];

let sysIds = 1000;

export function createNewSystem(ax = 1, ay = 1, as = 99): SystemModel {
    const id = sysIds++;

    const rx = rnd(0, as/2)*2;
    const ry = rnd(0, as/2)*2;

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
    };

    return star;
}

export function createRandomMap(count: number): SystemModel[] {
    const stars: SystemModel[] = [];

    const c = count / 10;

    const ar: [number, number, number, number][] = [
        [1, 1, 32, c], [33, 1, 34, c * 2], [67, 1, 32, c * 3],
        [1, 33, 32, c * 4], [33, 33, 34, c * 6], [67, 33, 32, c * 7],
        [1, 67, 32, c * 8], [33, 67, 34, c * 9], [67, 67, 32, count],
    ];

    let confIndex = 0;
    let conf = ar[confIndex];


    while (stars.length < count) {

        if (stars.length > conf[3]) {
            confIndex++;
            conf = ar[confIndex];
        }

        const star = createNewSystem(conf[0], conf[1], conf[2]);



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


export function getSystemById(systemId: string): SystemModel|undefined {
    const game = joki.service.getState("GameService") as GameModel;
    return game.systems.find((sm: SystemModel) => sm.id === systemId);
}

export function getSystemByCoordinates(coords: Coordinates): SystemModel|undefined {
    const game = joki.service.getState("GameService") as GameModel;
    return game.systems.find((sm: SystemModel) => inSameLocation(sm.location, coords));
}