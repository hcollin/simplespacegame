import { greekAlphabet, romanNumbers, starName } from "../../data/dataWords";
import { SystemModel } from "../../models/Models";
import { arnd, rnd, roll } from "../../utils/randUtils";

const starColors: string[] = ["#FFFD", "#FDAD", "#FF8D"];

let sysIds = 1000;

export function createNewSystem(): SystemModel {
    const id = sysIds++;

    const x = rnd(1, 99);
    const y = rnd(1, 99);

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

    while (stars.length < count) {
        const star = createNewSystem();

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
