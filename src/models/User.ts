import { GameObject } from "./Models";

export interface User extends GameObject {
    userId: string;
    name: string;
    email: string;
    groups: string[];
    registered: number;
    lastLogin: number;
}