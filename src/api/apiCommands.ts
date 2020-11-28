import { Command } from "../models/Commands";
import { deleteItem, getItemsWhere, getItemsWheres, insertOrUpdateItem, listenItemWhere } from "./apiFirebaseGeneral";

const COLLECTION = "Commands";


export async function apiLoadCommands(gameId: string): Promise<Command[]> {
    return await getItemsWhere(COLLECTION, ["gameId", "==", gameId]);
}


export async function apiLoadMyCommands(gameId: string, factionId: string): Promise<Command[]> {
    return await getItemsWheres(gameId, [["gameId", "==", gameId], ["factionId", "==", factionId]] );
}

export async function apiLoadCommandsAtTurn(gameId: string, turn: number): Promise<Command[]> {
    return await getItemsWheres(gameId, [["gameId", "==", gameId], ["turn", "==", turn]] );
}


export async function apiNewCommand(command: Command) {
    const newId = await insertOrUpdateItem<Command>(command, COLLECTION, true);
    command.id = newId;
    await apiUpdateCommand(command);
    return command;
}

export async function apiUpdateCommand(commmand: Command): Promise<boolean> {
    if (commmand.id !== "") {
        try {
            await insertOrUpdateItem<Command>(commmand, COLLECTION);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

export async function apiDeleteCommand(command: Command): Promise<void> {
    return await deleteItem(COLLECTION, command);
}

export async function apiClearCommands(gameId: string, cmdIds: string[]) {

}

export function apiSubscribeToCommands(gameId: string, onChange: (commands: Command[]) => void): () => void {
    const unsub =  listenItemWhere<Command>(COLLECTION, ["gameId", "==", gameId], ((model: Command[]|undefined) => {
        if(model !== undefined) {
            onChange(model);
        }
    }));
    return unsub;
}