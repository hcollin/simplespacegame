import { FACTION_NAMES } from "../../configs";
import { arnd, arnds } from "../../utils/randUtils";

const factNamePart1 = FACTION_NAMES[0];
const factNamePart2 = FACTION_NAMES[1];
const factNamePart3 = FACTION_NAMES[2];

const np1s = arnds(factNamePart1, 12, true);
const np2s = arnds(factNamePart2, 12, true);
const np3s = arnds(factNamePart3, 12, true);

let factionNoId = -1;

/**
 * USE WITH CAUTION! Get a unique faction name for this session. Mainly used for quickly generating random unique names for testing and development purposes.
 */
export function getFactionName() {
    factionNoId++;
    return `${np1s[factionNoId]} ${np2s[factionNoId]} ${np3s[factionNoId]}`;
}

/**
 * Generates a random faction name
 */
export function randomFactionName(): string {
    return `${arnd(factNamePart1)} ${arnd(factNamePart2)} ${arnd(factNamePart3)}`;
}
