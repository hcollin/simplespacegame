import { GameObject } from "./Models";

export interface ChatMessage extends GameObject{
    gameId: string;
    from: string;
    to: string;
    message: string;
    sent: number;
}


export interface Trade extends GameObject {
    from: string;
    to: string;
    message: string;
    money: number;
    researchPoints: number;
    length: number;  // How many turns is this Trade valid
}


