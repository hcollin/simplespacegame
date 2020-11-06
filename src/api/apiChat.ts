
import { ChatMessage } from "../models/Communication";
import { getItemsWhere, insertOrUpdateItem, listenItemWhere } from "./apiFirebaseGeneral";

const COLLECTION = "CHAT";


export async function apiLoadChat(gameId: string): Promise<ChatMessage[]> {
    return await getItemsWhere(COLLECTION, ["gameId", "==", gameId]);
}

export async function apiNewChat(chatMsg: ChatMessage) {
    const newId = await insertOrUpdateItem<ChatMessage>(chatMsg, COLLECTION, true);
    chatMsg.id = newId;
    await apiUpdateChat(chatMsg);
    return chatMsg;
}

export async function apiUpdateChat(chatMsg: ChatMessage): Promise<boolean> {
    if (chatMsg.id !== "") {
        try {
            await insertOrUpdateItem<ChatMessage>(chatMsg, COLLECTION);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}


export function apiSubscribeToChat(gameId: string, onChange: (chatMsgs: ChatMessage[]) => void): () => void {
    const unsub =  listenItemWhere<ChatMessage>(COLLECTION, ["gameId", "==", gameId], ((model: ChatMessage[]|undefined) => {
        if(model !== undefined) {
            onChange(model);
        }
    }));
    return unsub;
}