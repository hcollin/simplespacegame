const functions = require('firebase-functions');
const admin = require('firebase-admin');

// MODELS
import { GameModel, GameState } from '../src/models/Models';
import { Command } from '../src/models/Commands';
import { processTurn } from './processes/turnProcessor';


admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


interface PlayerReadyData {
    gameId: string;
    factionId: string;
    commands: Command[];
}

/**
 * PLayer is ready Cloud function
 * 
 * Stores the provided commands to the Commands Collection and triggers the turn processing if all players are ready.
 * 
 */
exports.playerReady = functions.https.onCall((data: PlayerReadyData, context: any) => {
    console.log("playerReady started", data);

    async function readyPlayer(gameId: string, factionId: string, commands: Command[]) {

        let game: GameModel | null = null;

        try {
            const gameRef = await db.collection("Games").doc(data.gameId).get();
            game = gameRef.data();
            if (!game) {
                console.error(`No game found with id: ${gameId}`);
                return;
            }

            if (game.factionsReady.includes(factionId)) {
                throw new Error(`Faction ${factionId} is already set to ready!`);
            }

            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                cmd.turn = game.turn;
                cmd.factionId = factionId;
                const docRef = await db.collection("Commands").add(cmd);
            }

            game.factionsReady.push(factionId);
            await db.collection("Games").doc(game.id).set({ ...game });

            if (game.factionsReady.length === game.factions.length) {
                await runTurnProcessor(game.id);
            }


        } catch (e) {
            console.error("Could not load the game", gameId, e);
            return;
        }

        return;
    }

    return readyPlayer(data.gameId, data.factionId, data.commands)
});

/**
 * Run the turn processor by force for provided gameId
 */
exports.processTurn = functions.https.onCall((data: { gameId: string }, context: any) => {
    return runTurnProcessor(data.gameId);
});


async function runTurnProcessor(gameId: string) {
    let game: GameModel | null = null;
    const commands: Command[] = [];
    try {
        const gameRef = await db.collection("Games").doc(gameId).get();
        game = gameRef.data();

        const cmdsSnap = await db.collection("Commands").where("gameId", "==", gameId).get();
        cmdsSnap.forEach((item: any) => {
            const cmd = item.data() as Command;
            commands.push(cmd);
        })
    } catch (e) {
        console.error("Could not load the game", gameId, e);
        return;
    }

    if (game === null) {
        return;
    }


    // Make sure all players are ready
    // if (game.factionsReady.length !== game.factions.length) {
    //     console.warn("Not all player ready: ", gameId);
    //     return;
    // }
    console.log("Turn to process", game.turn);
    game.state = GameState.PROCESSING;
    await db.collection("Games").doc(game.id).set({ ...game });
    const turnCommands = commands.filter((cmd: Command) => cmd.turn === game.turn);

    try {
        const newGame = await processTurn(game, commands);
        console.log("new turn: ", newGame.turn, GameState[newGame.state]);
        newGame.state = GameState.TURN;
        await db.collection("Games").doc(newGame.id).set(newGame);
    } catch (e) {
        console.error("FAILED TO PROCESS THE TURN", e);
    }
}