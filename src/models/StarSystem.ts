import { Building } from "./Buildings";
import { GameObject, Coordinates, Report } from "./Models";

export enum SystemKeyword {
    HOMEWORLD = "Homeworld",
    MINERALRICH = "Mineral Rich",
    MINERALPOOR = "Mineral Poor",
    MINERALRARE = "Rare Minerals",
    HOSTILE = "Hostile Environment",
    GAIA = "Gaia world",
    NATIVES = "Natives",
    ARTIFACTS = "Alien Artifacts",
}

export interface SystemModel extends GameObject {
    name: string;
    location: Coordinates;
    ownerFactionId: string;

    industry: number;
    economy: number;
    defense: number;
    welfare: number;

    color: string;
    keywords: (string | SystemKeyword)[];
    reports: Report[];

    buildings: Building[];
    description?: string;
    
    info?: SystemInfo;
}

export interface SystemInfo {
    planets: Planet[];
    starClass: string;
}

export interface Planet {
    type: PlanetType;
    distanceFromStar: number;
    size: number;
    name: string;
    population: number;
    maxPopulation: number;
    foodProduction: number;
    foodSupply: number;
    morale: number;
    keywords: PlanetKeyword[];
}

export enum PlanetType {
    // Chthonian = "Chthonian planet",
    // Carbon = "Carbon planet",
    // Coreless = "Coreless planet",
    Desert = "Desert planet",
    // GasDwarf = "Gas Dwarf",
    GasGiant = "Gas Giant",
    // Helium = "Helium planet",
    // IceGiant = "Ice Giant",
    IcePlanet = "Ice planet",
    // Iron = "Iron planet",
    Lava = "Lava planet",
    Ocean = "Ocean planet",
    // Proto = "Protoplanet",
    // Puffy = "Puffy planet",
    // Silicate = "Silicate planet",
    Terrestrial = "Terrestrial planet",
    Gaia = "Gaia planet",
    Barren = "Barren",
}

export enum PlanetKeyword {
    LOWNATIVES = "Primitive Natives",
    HIGHNATIVES = "Industrial Natives",
    PREDATORS = "Predators",
    ARTIFACTS = "Artifacts",
    REMNANTS = "Remnants of older Civilization",
    HOSTILEFAUNA = "Hostile Fauna",
    EDIBLEFAUNA = "Edible Fauna",

    VULCANIC = "Active Vulcanos",
    SEISMIC = "Seismic Activity",
    CRYSTALS = "Rare Crystals",
    
    RAREMINERALS = "Rare Minerals",
    RICHMINERALS = "Mineral Rich",
    POORMINERALS = "Mineral Poor",

    TIDALLOCK = "Tidal Locked",
    
};
