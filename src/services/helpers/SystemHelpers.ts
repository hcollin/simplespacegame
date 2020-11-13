
import { SYSTEMBONUS } from "../../configs";
import { greekAlphabet, romanNumbers, starName } from "../../data/dataWords";
import { Coordinates, GameModel, SystemModel } from "../../models/Models";
import { inSameLocation } from "../../utils/locationUtils";
import { arnd, rnd, roll } from "../../utils/randUtils";

const starColors: string[] = ["#FFFD", "#FDAD", "#FF8D"];

let sysIds = 1000;

export function createNewSystem(ax = 1, ay = 1, as = 99): SystemModel {
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
        ringWorld: false,
        keywords: [],
        reports: [],
    };

    if(roll(60)) {
        const key = arnd(SYSTEMBONUS);
        star.keywords.push(key);
    }

    return star;
}

export function createRandomMap(starCount: number, size=99): SystemModel[] {
    const stars: SystemModel[] = [];

    const c = Math.round(starCount / 10);
    const p = size / 3;

    // [x, y, size, star count]
    const ar: [number, number, number, number][] = [
        [1, 1, p-1, c], [p, 1, p-1, c * 2], [p*2, 1, p-1, c * 3],
        [1, p, p-1, c * 4], [p, p, p-1, c * 6], [p*2, p, p-1, c * 7],
        [1, p*2, p-1, c * 8], [p, p*2, p-1, c * 9], [p*2, p*2, p-1, starCount],
    ];

    let confIndex = 0;
    let conf = ar[confIndex];

    while (stars.length < starCount) {

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

    // const st = 11;

    // const ringWorldAreas: [number, number, number, number][] = [
    //     [st, st, st, c], [st*4, st, st, c * 2], [st*7, st, st, c * 3],
    //     [st, st*4, st, c * 4], [st*4, st*4, st, c * 6], [st*7, st*4, st, c * 7],
    //     [st, st*7, st, c * 8], [st*4, st*7, st, c * 9], [st*7, st*7, st, starCount],
    // ];

    // ringWorldAreas.forEach((conf: [number, number, number, number], ind: number) => {

    //     function createRingWorld(conf: [number, number, number, number], currentStars: SystemModel[]): boolean {
    //         const star = createNewSystem(conf[0], conf[1], conf[2]);

    //         star.ringWorld = true;

    //         if (
    //             currentStars.findIndex(
    //                 (sm: SystemModel) =>
    //                     (sm.location.x === star.location.x && sm.location.y === star.location.y) || sm.name === star.name
    //             ) === -1
    //         ) {
    //             currentStars.push(star);
    //             return true;
    //         }
    //         return false;
    //     }

    //     while(createRingWorld(conf, stars) === false) {

    //     }

    // })


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

export function getSystemByCoordinates(game: GameModel, coords: Coordinates): SystemModel | undefined {
    // const game = joki.service.getState("GameService") as GameModel;
    return game.systems.find((sm: SystemModel) => inSameLocation(sm.location, coords));
}