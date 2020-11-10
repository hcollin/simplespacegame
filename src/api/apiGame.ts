import { GameModel, GameState } from "../models/Models";
import { getAllItems, getItem, getItemsWhere, insertOrUpdateItem, listenItemWhere } from "./apiFirebaseGeneral";

const COLLECTION = "Games";

export async function apiNewGame(game: GameModel): Promise<GameModel> {
    const newId = await insertOrUpdateItem<GameModel>(game, COLLECTION, true);
    game.id = newId;
    await apiUpdateGame(game);
    return game;
}

export async function apiUpdateGame(game: GameModel): Promise<boolean> {
    if (game.id !== "") {
        try {
            await insertOrUpdateItem<GameModel>(game, COLLECTION);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

export async function apiListGames(): Promise<GameModel[]> {
    const games = await getAllItems<GameModel>(COLLECTION);
    return games;
}

export async function apiListMyGames(playerId: string): Promise<GameModel[]> {
    const games = await getItemsWhere<GameModel>(COLLECTION, ["playerIds", "array-contains", playerId]);
    return games;
}


export async function apiListOpenGames(): Promise<GameModel[]> {
    const games = await getItemsWhere<GameModel>(COLLECTION, ["state", "==", GameState.OPEN]);
    return games;
}
export async function apiLoadGame(gameId: string): Promise<GameModel|null> {
    const game = await getItem<GameModel>(COLLECTION, gameId);
    if(!game) {
        return null;
    }
    return game;
}


export function apiSubscribeToGame(gameId: string, onChange: (GameModel: GameModel) => void): () => void {
    const unsub =  listenItemWhere<GameModel>(COLLECTION, ["id", "==", gameId], ((model: GameModel[]|undefined) => {
        if(model !== undefined && model.length === 1) {
            onChange(model[0]);
        }
    }));
    return unsub;
}
