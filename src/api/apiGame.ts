// // import { Show, FullShow, Answer, RaisedHand } from "../models/Show";
// import { insertOrUpdateItem, getAllItems, listenCollection, updateItem, getItem, listenItemWhere } from "./apiFirebaseGeneral";

// import { GameModel } from "../services/gameModelService";
// import { GamePhase } from "../models/GameObject";

const COLLECTION = "Games";

export function listenForGame(gameId: string) {
    
}

// export function listenForGame(gameId: string) {}

// export async function apiNewGame(game: GameModel): Promise<GameModel> {
//     const newId = await insertOrUpdateItem<GameModel>(game, "Games", true);
//     game.id = newId;
//     game.created = Date.now();
//     game.phase = GamePhase.Created;
//     await apiUpdateGame(game);
//     return game;
// }

// export async function apiUpdateGame(game: GameModel): Promise<boolean> {
//     if (game.id !== "") {
//         try {
//             await insertOrUpdateItem<GameModel>(game, "Games");
//             return true;
//         } catch (e) {
//             return false;
//         }
//     }
//     return false;
// }

// export async function apiListGames(): Promise<GameModel[]> {
//     const games = await getAllItems<GameModel>("Games");
//     return games;
// }

// export async function apiLoadGame(gameId: string): Promise<GameModel|null> {
//     const game = await getItem<GameModel>("Games", gameId);
//     if(!game) {
//         return null;
//     }
//     return game;
// }


// export function apiSubscribeToGame(gameId: string, onChange: (GameModel: GameModel) => void): () => void {
//     const unsub =  listenItemWhere<GameModel>("Games", ["id", "==", gameId], ((model: GameModel[]|undefined) => {
//         if(model !== undefined && model.length === 1) {
//             onChange(model[0]);
//         }
//     }));
//     return unsub;
// }

// // export function getAnswers(showId: string): Promise<Answer[]> {
// //     return new Promise(async (resolve, reject) => {
// //         try {
// //             const allAnswers: Answer[] = await getAllItems<Answer>("Answers");

// //             const showsAnswers = allAnswers.filter((a: Answer) => a.showId === showId);

// //             resolve(showsAnswers);
// //         } catch (e) {
// //             console.error(e);
// //             reject([]);
// //         }
// //     });
// // }

// // export function listenAnswersForShow(showId: string, callback: (items: any) => void): () => void {
// //     return listenCollection("Answers", callback);
// // }

// // export async function setMyAnswer(show: Show, answer: Answer) {
// //     if (show.firebaseId) {
// //         const updateObject = {
// //             "currentQuestion.activeAnswer": answer,
// //         };
// //         updateItem(show.firebaseId, updateObject, "Shows");
// //     }
// // }

// // export async function apiRaiseHand(show: Show, raisedHand: RaisedHand) {
// //     if (show.firebaseId) {
// //         const updateObject = {
// //             "currentQuestion.handsUp": firebase.firestore.FieldValue.arrayUnion(raisedHand),
// //         };

// //         updateItem(show.firebaseId, updateObject, "Shows");
// //     }
// // }

// // export async function apiConfirmAnswer(show: FullShow, correct: boolean) {
// //     if (show.firebaseId) {
// //         const updateObject = {
// //             "currentQuestion.activeAnswer.correct": correct,
// //             "currentQuestion.activeAnswer.confirmed": true,
// //         };
// //         updateItem(show.firebaseId, updateObject, "Shows");
// //     }
// // }

// // export async function apiSelectGenre(show: Show, genre: string) {
// //     if(show.firebaseId) {
// //         const updateObject = {
// //             "currentGenre": genre
// //         };
// //         updateItem(show.firebaseId, updateObject, "Shows");
// //     }
// // }

// // export async function updateAnswer(answer: Answer): Promise<boolean> {
// //     const [fbId, id] = await insertOrUpdateItem<Answer>(answer, "Answers");
// //     if (fbId && id) {
// //         return true;
// //     }
// //     return false;
// // }
