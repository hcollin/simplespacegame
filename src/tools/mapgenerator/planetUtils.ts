import { PlanetTypeData, PlanetTypeInfo } from "../../data/dataSystems";
import { PlanetType } from "../../models/StarSystem";
import { getRandomEnum } from "../../utils/generalUtils";
import { arnd } from "../../utils/randUtils";

export function getPlanetInfoByType(type: PlanetType): PlanetTypeInfo {
    const info = PlanetTypeData.find((pti: PlanetTypeInfo) => pti.type === type);
    if (!info) {
        throw new Error(`Invalid Planet type ${type}`);
    }
    return info;
}

export function getRandomPlanetType(distance: number): PlanetType {
    const types = PlanetTypeData.reduce((tot: PlanetType[], p: PlanetTypeInfo) => {
        if (distance >= p.distanceRange[0] && distance <= p.distanceRange[1]) {
            for (let i = 0; i < p.frequency; i++) {
                tot.push(p.type);
            }
        }

        return tot;
    }, []);

    const ptype = arnd(types);

    return ptype;
}
