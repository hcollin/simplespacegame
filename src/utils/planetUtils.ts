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
            // style.background = `radial-gradient(white, blue, deepblue)`;
            style.background = `radial-gradient(blue, black)`;
            additionalClasses = "blurclouds";
            break;
        case PlanetType.Desert:
            style.background = `radial-gradient(peru, black)`;
            additionalClasses = "ridges";
            break;
        case PlanetType.Lava:
            style.background = `radial-gradient(#F00 10%, #800 50%, #840 80%, black)`;
            additionalClasses = "cracked";
            break;
        case PlanetType.IcePlanet:
            style.background = `radial-gradient(white 20%, #88F 60%, blue 90%, black 100%)`;
            additionalClasses = "cracked";
            break;
        case PlanetType.GasGiant:
            style.background = `radial-gradient(brown, black)`;
            additionalClasses = "gas";
            break;
        case PlanetType.Barren:
            style.background = `radial-gradient(gray, black)`;
            additionalClasses = "ridges";
            break;
        case PlanetType.Terrestrial:
            style.background = `radial-gradient(green 30%, blue 60%, black)`;
            additionalClasses = "ridges";
            break;
        case PlanetType.Gaia:
            style.background = `radial-gradient(green 10%, blue 30%, green 60%, black)`;
            additionalClasses = "ridges";
            break;

        default:
            break;
    }

    return [style, additionalClasses];
}
