import { User } from "../models/User";



export function userIsAdmin(user: User): boolean {
    return user.groups.includes("ADMIN");
}


export function userIsBlocked(user: User): boolean {
    return user.groups.includes("BLOCKED");
}