import { Coordinates } from "../models/Models";



export function inSameLocation(locA: Coordinates, locB: Coordinates): boolean {

    return (locA.x === locB.x && locA.y === locB.y);

}