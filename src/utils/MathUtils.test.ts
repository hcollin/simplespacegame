import { Coordinates } from "../models/Models"
import { distanceBetweenCoordinates, getVectorFromCoords, travelingBetweenCoordinates, Vector } from "./MathUtils";


describe("Math utils tests", () => {

    it("Distance", () => {

        const a: Coordinates = {
            x: 1,
            y: 1,
        };

        const b: Coordinates = {
            x: 2,
            y: 2,
        };
        
        const dis = distanceBetweenCoordinates(a, b);

        expect(dis).toBe(Math.sqrt(2));

    });

    it("Get Vector from coordinates", () => {

        const a: Coordinates = {
            x: 3,
            y: 4,
        };

        const b: Coordinates = {
            x: 5,
            y: 6,
        };

        expect(travelingBetweenCoordinates(a, b, 6)).toEqual(b);

        const res = travelingBetweenCoordinates(a, b, 2);
        expect(res.x > a.x).toBeTruthy();
        expect(res.x < b.x).toBeTruthy();

        expect(res.y > a.y).toBeTruthy();
        expect(res.y < b.y).toBeTruthy();

    


        
        
    })

});

describe("Vectors", () => {


    it("vPlus", () => {
      
    });
    
})

