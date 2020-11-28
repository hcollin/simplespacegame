import Firebase from "firebase";
import { Command } from "../models/Commands";



export async function fnProcessTurn(gameId: string) {
    const procTurn = Firebase.functions().httpsCallable("processTurn");
    try {
        const res = await procTurn({gameId: gameId});
        return res;
    } catch(e) {
        console.error("Failure in fnProcessTurn", e);
        return;
    }
   
}


export async function fnPlayerReady(gameId: string, factionId: string) {
    const playerReady = Firebase.functions().httpsCallable("playerReady");
    try {
        const res = await playerReady({gameId: gameId, factionId: factionId});
        return res;
    } catch(e) {
        console.error("Failure in fnPlayerReady", e);
        return;
    }
}

export async function fnPlayerNotReady(gameId: string, factionId: string) {
    const notReady = Firebase.functions().httpsCallable("playerCancelReady");
    try {
        const res = await notReady({gameId: gameId, factionId: factionId});
        return res;
    } catch(e) {
        console.error("Failure in fnPlayerNotReady", e);
        return;
    }
}