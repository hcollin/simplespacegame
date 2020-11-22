import { buildingGateway } from "../buildings/buildingRules";
import { Coordinates, GameModel } from "../models/Models";
import { getSystemByCoordinates } from "./systemUtils";



export function inSameLocation(locA: Coordinates, locB: Coordinates): boolean {
    return (locA.x === locB.x && locA.y === locB.y);
}


export function warpGateBetweenSystems(game: GameModel, from: Coordinates, to: Coordinates): boolean {
    const startStar = getSystemByCoordinates(game, from);
    if(!startStar) return false;
    const endStar = getSystemByCoordinates(game, to);
    if(!endStar) return false;

    return buildingGateway(startStar, endStar, startStar.ownerFactionId);
}