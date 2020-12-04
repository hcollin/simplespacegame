import { Planet, PlanetType } from "../models/StarSystem";

export function planetStyle(planet: Planet): [React.CSSProperties, string] {
    const size = 1 + planet.size / 2;

    let additionalClasses = "";

    const style: React.CSSProperties = {
        height: `${size}rem`,
        width: `${size}rem`,
        background: "radial-gradient(white, black)",
    };
    switch (planet.type) {
        case PlanetType.Ocean:
            style.background = `radial-gradient(blue, deepblue)`;
            break;
        case PlanetType.Desert:
            style.background = `radial-gradient(sand, black)`;
            break;
        case PlanetType.Lava:
            style.background = `radial-gradient(#F00 10%, #800 50%, #840 80%, black)`;
            additionalClasses = "cracked";
            break;
        case PlanetType.IcePlanet:
        case PlanetType.IceGiant:
            style.background = `radial-gradient(white 20%, #88F 60%, blue 90%, black 100%)`;
            additionalClasses = "cracked";
            break;
        

        
        default:
            break;
    }

    return [style, additionalClasses];
}
