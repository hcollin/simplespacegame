import { Coordinates } from "../models/fModels";



export function distanceBetweenCoordinates(a: Coordinates, b: Coordinates): number {
    return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y),2));
}

export function travelingBetweenCoordinates(from: Coordinates, to: Coordinates, distance: number): Coordinates {

    const v1 = getVectorFromCoords(from, to);
    const len = Vectors.length(v1);

    if(distance > len) return {...to};

    const norm = Vectors.normalize(v1);

    const x = from.x + distance * norm[0];
    const y = from.y + distance * norm[1];

    return {x,y};

}


export function angleBetweenCoordinates(a: Coordinates, b: Coordinates): number {

    return 0;
}


export function findClosestCoordinate(coords: Coordinates[], point: Coordinates): Coordinates {

    let closest: Coordinates = {x: 0, y: 0};
    let distance = 1000000;

    coords.forEach((c: Coordinates, i: number) => {
        
        const d = Math.pow(c.x - point.x, 2) + Math.pow(c.y - point.y, 2);
        
        if(d < distance) {
            
            distance = d;
            closest = c;
        }
    })

    return closest;
}


export type Vector = [number, number];

export function getVectorFromCoords(a: Coordinates, b: Coordinates): Vector {
    return [b.x - a.x, b.y - a.y];
}

interface VectorsInterface {
    normalize: (vector: Vector) => Vector;
    length: (vector: Vector) => number;
}


function normalize(vec: Vector): Vector {
    const len = length(vec);
    return [vec[0]/len, vec[1]/len];
}

function length(vec: Vector): number {
    return Math.sqrt((vec[0]*vec[0]) + (vec[1]*vec[1]));
}

const Vectors: VectorsInterface = {
    normalize,
    length,
}

export { Vectors };