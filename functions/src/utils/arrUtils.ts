import { GameObject } from "../models/Models";


export function hasGameObject<T extends GameObject>(arr: T[], id: string): boolean {
    return arr.find((item: T) => item.id === id) !== undefined;
}