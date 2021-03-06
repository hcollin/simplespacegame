import { joki } from "jokits-react";
import { v4 } from "uuid";
import { Trade } from "../../models/Communication";
import { FactionSetup, GameModel, PreGameSetup } from "../../models/Models";
import { SERVICEID } from "../services";

export function doProcessTurn() {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "processTurn",
    });
}

export function doPlayerDone(factionId: string) {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "ready",
        data: factionId,
    });
}

export function doPlayerNotDone(factionId: string) {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "unready",
        data: factionId,
    })
}

export function doCreateNewGame(setup: PreGameSetup) {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "newGame",
        data: setup,
    });
}

export function doJoinGame(setup: FactionSetup) {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "joinGame",
        data: setup,
    });
}

export function doCreateDraftGame() {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "createGameDraft",
    });
}

export function doLoadGame(gameId: string) {
    joki.trigger({
        to: "GameService",
        action: "loadGame",
        data: gameId,
    });
}

export function doCloseCurrentGame() {
    joki.trigger({
        to: SERVICEID.GameService,
        action: "closeGame",
    });
}

export function doTradeAgreement(trade: Trade) {
    const game = joki.service.getState(SERVICEID.GameService) as GameModel;

    const trades = [...game.trades];
    trade.id = v4();
    trades.push(trade);

    joki.trigger({
        to: SERVICEID.GameService,
        action: "updateTrades",
        data: trades,
    });
}
