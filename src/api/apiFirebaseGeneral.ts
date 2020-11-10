import Firebase from "firebase";
import { db } from "./firebaseDb";

import { GameObject } from "../models/Models";

export interface FirebaseConfiguration {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export async function getAllItems<T extends GameObject>(collectionName: string): Promise<T[]> {
    const snap = await db.collection(collectionName).get();

    const items: T[] = [];
    snap.forEach((doc) => {
        try {
            const item: T = doc.data() as T;
            item.id = doc.id;
            items.push(item);
        } catch (e) {
            console.warn(`${doc.id} data could not be stored as an item T`, e);
        }
    });

    return items;
}

export async function getItem<T extends GameObject>(collectionName: string, itemId: string): Promise<T | undefined> {
    const snap = await db.collection(collectionName).doc(itemId).get();

    if (!snap.data()) {
        console.warn(`Item with id ${itemId} not found!`);
        return;
    }
    const data: T = snap.data() as T;
    if (data.id === undefined) {
        data.id = snap.id;
    }

    return data;
}

export async function getItemsWhere<T extends GameObject>(
    collectionName: string,
    where: [string, Firebase.firestore.WhereFilterOp, string|number]
): Promise<T[]> {
    const snap = await db.collection(collectionName).where(where[0], where[1], where[2]).get();

    const res: T[] = [];
    snap.forEach((item) => {
        const d: T = item.data() as T;

        res.push(d);
    });
    return res;
}

export async function getItemsWheres<T extends GameObject>(
    collectionName: string,
    wheres: [string, Firebase.firestore.WhereFilterOp, string|number][]
): Promise<T[]> {
    const collectionRef = db.collection(collectionName);
    wheres.forEach((where: [string, Firebase.firestore.WhereFilterOp, string|number]) => {
        console.log("Where", where);
        collectionRef.where(where[0], where[1], where[2]);
    });
    console.log("CollectionRef", collectionRef);
    const snap = await collectionRef.get();

    const res: T[] = [];
    snap.forEach((item) => {
        const d: T = item.data() as T;

        res.push(d);
    });
    return res;
}

export function listenItemWhere<T extends GameObject>(
    collectionName: string,
    where: [string, Firebase.firestore.WhereFilterOp, string],
    callback: (item: T[] | undefined) => void
): () => void {
    const subStop = db
        .collection(collectionName)
        .where(where[0], where[1], where[2])
        .onSnapshot((querySnap) => {
            const res: T[] = [];
            querySnap.forEach((doc) => {
                const item: T = doc.data() as T;
                res.push(item);
            });
            callback(res);
        });
    return () => {
        subStop();
    };
}

export async function deleteItem<T extends GameObject>(collectionName: string, item: T): Promise<void> {
    return await db.collection(collectionName).doc(item.id).delete();
}

// export function listenCollection<T extends GameObject>(
//     collectionName: string,
//     callback: (items: T[]) => void
// ): () => void {
//     const unsub = db.collection(collectionName).onSnapshot((querySnapShot) => {
//         console.log("QUERY SNAPSHOT", querySnapShot);
//     });

//     return unsub;
// }

// export function listenItem<T extends GameObject>(
//     collectionName: string,
//     fbId: string,
//     callback: (items: T) => void
// ): () => void {
//     const unsub = db
//         .collection(collectionName)
//         .doc(fbId)
//         .onSnapshot((snap) => {
//             console.log("QUERY SNAPSHOT", snap);
//         });

//     return unsub;
// }

export async function insertOrUpdateItem<T extends GameObject>(
    item: T,
    collectionName: string,
    insert?: boolean
): Promise<string> {
    try {
        if (item.id === "" || insert === true) {
            const docRef = await db.collection(collectionName).add(item);
            return docRef.id;
        }

        await db.collection(collectionName).doc(item.id).set(item);
        return item.id;
    } catch (e) {
        console.error(e);
        throw new Error(e);
    }
}

// export async function updateItem(fbId: string, updateObject: any, collectionName: string) {
//     try {
//         const docRef = await db.collection(collectionName).doc(fbId);
//         if (docRef) {
//             docRef.update(updateObject);
//         }
//     } catch (e) {
//         console.error("ERROR", e);
//     }
// }

// export async function deleteItem(fbId: string, collectionName: string) {
//     try {
//         await db.collection(collectionName).doc(fbId).delete();
//     } catch (e) {
//         console.error("DELETE ITEM ERROR", e);
//     }
// }

// export async function deleteItemsWhere(
//     collectionName: string,
//     where: [string, Firebase.firestore.WhereFilterOp, string]
// ) {
//     try {
//         // const batch = db.batch();
//         const delRefs = await db.collection(collectionName).where(where[0], where[1], where[2]).get();
//         delRefs.forEach((itemRef) => {
//             console.log(itemRef);
//         });
//     } catch (e) {
//         console.error("DELETE ITEMS ERROR", e);
//     }
// }
