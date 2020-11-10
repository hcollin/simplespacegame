import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { fnPlayerReady, fnProcessTurn } from "../api/apiFunctions";
import { apiLoadGame, apiNewGame, apiSubscribeToGame, apiUpdateGame } from "../api/apiGame";

import { Command } from "../models/Commands";

import { GameModel, FactionModel, GameState, PreGameSetup } from "../models/Models";

import { User } from "../models/User";
// import { techMarketing } from "../tech/businessTech";
// import { rnd } from "../utils/randUtils";
import { getFactionByUserId } from "./helpers/FactionHelpers";
import { createGameFromSetup, randomGameName } from "./helpers/GameHelpers";
import { SERVICEID } from "./services";


export interface NewGameOptions {
    playerCount: number;
}

export default function createGameService(serviceId: string, api: JokiServiceApi): JokiService<GameModel> {
    let game: GameModel = {
        id: "",
        setup: {
            playerCount: 0,
            density: "",
            distances: ""
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
                case "newGame":
                    newGame(event.data);
                    break;
                case "loadGame":
                    loadGame(event.data);
                    break;
                case "closeGame":
                    closeGame();
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
    }

    function createNewGameDraft() {
        const draft: GameModel = {
            id: "",
            setup: {
                playerCount: 4,
                density: "MEDIUM",
                distances: "MEDIUM"
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
        }
        
        game = draft;

        sendUpdate();
    }

    async function closeGame() {
        switch(game.state) {
            case GameState.OPEN:
            case GameState.INIT:
                game.state = GameState.NONE;
                sendUpdate();
                break;    
            default:
                break;    
        }   
    }

    async function newGame(gameSetup: PreGameSetup) {
        console.log("NEW GAME", gameSetup);

        game = createGameFromSetup(gameSetup);
        
        // game = createNewGame(gameSetup.playerCount);
        game = await apiNewGame(game);

        sendUpdate();
        // startListening();
    }

    async function loadGame(gameId: string) {
        console.log("LOAD GAME", gameId);

        const res = await apiLoadGame(gameId);
        if (res) {
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
                data: game.id
            });
        }

        if (game.id !== "") {
            unsub = apiSubscribeToGame(game.id, (gm) => {
                if (gm.id === game.id) {
                    game = gm;
                    sendUpdate();
                }
            });
            api.api.trigger({
                from: serviceId,
                action: "loaded",
                data: game.id
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

    async function _setFactionDone(factionId: string) {
        if (!game.factionsReady.includes(factionId)) {
            game.factionsReady.push(factionId);

            sendUpdate();

            const allCommands = api.api.getServiceState<Command[]>(SERVICEID.CommandService);
            if (allCommands) {
                await fnPlayerReady(game.id, factionId, allCommands.filter((cmd: Command) => cmd.turn === game.turn && cmd.factionId === factionId));

            }


        }
    }



    function updateFaction(fm: FactionModel) {
        game = updateFactionInGame(game, fm);
        sendUpdate();
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
            return faction;
        }
        return fm;
    });
    return { ...game };
}
