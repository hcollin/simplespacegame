import { User } from "../models/User";
import { getAllItems, getItem, getItemsWhere, insertOrUpdateItem } from "./apiFirebaseGeneral";

const COLLECTION = "User";

export async function apiNewUser(user: User): Promise<User> {
    try {
        const newId = await insertOrUpdateItem<User>(user, COLLECTION, true);
        user.id = newId;
        user.registered = Date.now();
        user.lastLogin = Date.now();
        if (!newId) {
            throw new Error(`No valid id provided ${newId}, cannot create a new game`);
        }
        await apiUpdateUser(user);
        return user;
    } catch (e) {
        console.error("Could not create a game");
        console.log(user);
        throw new Error(e);
    }
}

export async function apiLoadUsers(): Promise<User[]> {
    const users = await getAllItems<User>(COLLECTION);
    return users;
}

export async function apiLoadUserById(id: string): Promise<User | null> {
    const user = await getItem<User>(COLLECTION, id);
    if (!user) {
        return null;
    }
    return user;
}

export async function apiLoadUserByUserId(userId: string): Promise<User | null> {
    const users = await getItemsWhere<User>(COLLECTION, ["userId", "==", userId]);
    if (users.length === 1) {
        return users[0];
    }
    console.warn(`Recieved ${users.length} results for userId ${userId}`);
    return null;
}

export async function apiUpdateUser(user: User): Promise<boolean> {
    if (user.id !== "") {
        try {
            user.lastLogin = Date.now();
            await insertOrUpdateItem<User>(user, COLLECTION);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}
