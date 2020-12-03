import { Building } from "./fBuildings";
import { GameObject, Coordinates, Report } from "./fModels";


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
}

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