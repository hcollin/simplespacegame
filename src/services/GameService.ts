import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { fnPlayerNotReady, fnPlayerReady, fnProcessTurn } from "../api/apiFunctions";
import { apiLoadGame, apiNewGame, apiSubscribeToGame, apiUpdateGame } from "../api/apiGame";

import { Command } from "../models/Commands";

import { GameModel, FactionModel, GameState, PreGameSetup, FactionSetup } from "../models/Models";

import { User } from "../models/User";
// import { techMarketing } from "../tech/businessTech";
// import { rnd } from "../utils/randUtils";
import { getFactionByUserId } from "./helpers/FactionHelpers";
import { createFactionFromSetup, createGameFromSetup, randomGameName, startGame } from "./helpers/GameHelpers";
import { SERVICEID } from "./services";

export interface NewGameOptions {
    playerCount: number;
}

const EMPTYGAME: GameModel = {
    id: "",
    setup: {
        playerCount: 0,
        density: "",
        distances: "",
        specials: "",
        length: "MEDIUM",
    },
    name: "",
    state: GameState.NONE,
    turn: 0,
    systems: [],
    units: [],
    factions: [],
    factionsReady: [],
    trades: [],
    playerIds: [],
};

export default function createGameService(serviceId: string, api: JokiServiceApi): JokiService<GameModel> {
    let game: GameModel = { ...EMPTYGAME };

    let unsub: null | (() => void) = null;
    // let game: GameModel = createNewGame();

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "setGameState":
                    setGameState(event.data);
                    break;
                case "processTurn":
                    processTurn(event.data);
                    break;
                case "ready":
                    factionReady(event.data);
                    break;
                case "unready":
                    factionNotReady(event.data);
                    break;
                case "newGame":
                    newGame(event.data);
                    break;
                case "loadGame":
                    loadGame(event.data);
                    break;
                case "joinGame":
                    joinGame(event.data);
                    break;
                case "closeGame":
                    closeGame();
                    break;
                case "devUpdateGame":
                    updateGame(event.data);
                    break;
                case "updateFaction":
                    updateFaction(event.data as FactionModel);
                    break;
                case "updateTrades":
                    game.trades = event.data;
                    sendUpdate();
                    break;
                case "createGameDraft":
                    createNewGameDraft();
                    break;
            }
        }

        if (event.from === SERVICEID.UserService && event.action === "LOGOUT") {
            closeGame();
        }
    }

    function createNewGameDraft() {
        const draft: GameModel = {
            id: "",
            setup: {
                playerCount: 4,
                density: "MEDIUM",
                distances: "MEDIUM",
                specials: "AVERAGE",
                length: "MEDIUM",
            },
            name: randomGameName(),
            state: GameState.INIT,
            turn: 0,
            systems: [],
            units: [],
            factions: [],
            factionsReady: [],
            trades: [],
            playerIds: [],
        };

        game = draft;

        sendUpdate();
    }

    async function closeGame() {
        switch (game.state) {
            case GameState.OPEN:
            case GameState.INIT:
            case GameState.TURN:
                game = { ...EMPTYGAME };
                sendUpdate();
                break;
            default:
                break;
        }
    }

    async function newGame(gameSetup: PreGameSetup) {
        console.log("NEW GAME", gameSetup);

        game = createGameFromSetup(gameSetup);
        // debugger;

        // game = createNewGame(gameSetup.playerCount);
        game = await apiNewGame(game);

        sendUpdate();
        // startListening();
    }

    async function joinGame(factionSetup: FactionSetup) {
        const faction = createFactionFromSetup(factionSetup);
        if (faction) {
            game.factions.push(faction);
            game.playerIds.push(factionSetup.playerId);
            sendUpdate();

            if (game.factions.length === game.setup.playerCount) {
                //START THE GAME
                console.log("START GAME!", game);
                game = startGame(game);
            }
            await apiUpdateGame(game);
        }
    }

    async function loadGame(gameId: string) {
        const user: User | null | undefined = api.api.getServiceState(SERVICEID.UserService);
        if (!user) {
            return;
        }

        const res = await apiLoadGame(gameId);
        if (res) {
            if (res.state >= GameState.TURN && !res.playerIds.includes(user.id)) {
                return;
            }
            game = res;
            sendUpdate();
            startListening();
        }
    }

    async function setGameState(st: GameState) {
        game.state = st;
        sendUpdate();
        await saveGame();
        return 1;
    }

    function startListening() {
        if (unsub !== null) {
            unsub();
            api.api.trigger({
                from: serviceId,
                action: "unloaded",
                data: game.id,
            });
        }

        if (game.id !== "") {
            unsub = apiSubscribeToGame(game.id, (gm) => {
                if (gm.id === game.id) {
                    if (gm.state === GameState.TURN && game.state === GameState.PROCESSING) {
                        console.log("TURN PROCESSING ENDED!");
                        api.api.trigger({
                            from: SERVICEID.GameService,
                            action: "CLEANUP",
                            data: gm.turn,
                        });
                    }

                    game = gm;
                    sendUpdate();
                }
            });
            api.api.trigger({
                from: serviceId,
                action: "loaded",
                data: game.id,
            });
        }
    }

    function factionReady(factionId?: string) {
        if (factionId) {
            _setFactionDone(factionId);
            return;
        }
        const user = api.api.getServiceState<User>("UserService");
        if (user) {
            const faction = getFactionByUserId(game.factions, user.id);
            if (faction) {
                _setFactionDone(faction.id);
            }
        }
    }

    async function factionNotReady(factionId: string) {
        if (game.factionsReady.includes(factionId)) {
            game.state = GameState.PROCESSING;
            sendUpdate();
            await fnPlayerNotReady(game.id, factionId);
        }
    }

    async function _setFactionDone(factionId: string) {
        if (!game.factionsReady.includes(factionId)) {
            game.factionsReady.push(factionId);
            game.state = GameState.PROCESSING;
            sendUpdate();
            await fnPlayerReady(game.id, factionId);
            // if(game.factionsReady.length === game.factions.length) {
            // 	game.state = GameState.PROCESSING;
            // }
            // sendUpdate();
        }
    }

    function updateFaction(fm: FactionModel) {
        game = updateFactionInGame(game, fm);
        sendUpdate();
        saveGame();
    }

    function updateGame(newGame: GameModel) {
        if (newGame.id === game.id) {
            game = newGame;
            sendUpdate();
            saveGame();
        }
    }

    async function processTurn(comms?: Command[]) {
        if (game.state === GameState.PROCESSING) return;
        await fnProcessTurn(game.id);
    }

    function getState(): GameModel {
        return { ...game };
    }

    async function saveGame() {
        await apiUpdateGame(game);
    }

    function sendUpdate() {
        api.updated({ ...game });
    }

    return {
        eventHandler,
        getState,
    };
}

function updateFactionInGame(game: GameModel, faction: FactionModel): GameModel {
    game.factions = game.factions.map((fm: FactionModel) => {
        if (fm.id === faction.id) {
            console.log("Update faction", faction.name);
            return faction;
        }
        return fm;
    });
    return { ...game };
}
