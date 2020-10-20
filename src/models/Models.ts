
export interface GameObject {
    id: string;
}


export interface GameModel extends GameObject {
    turn: number;
    factions: FactionModel[];
    units: UnitModel[];
    systems: SystemModel[];
}


export interface UnitModel extends GameObject {
    location: Coordinates;
    weapons: number;
    hull: number;
    damage: number;
    speed: number;
    
    cost: number;
    minIndustry: number;
    
}


export interface Coordinates {
    x: number;
    y: number;
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
}

export interface FactionModel extends GameObject {
    name: string;
    money: number;
    done: boolean;
    color: string;
}