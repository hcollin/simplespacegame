import { joki } from "jokits-react";
import { v4 } from "uuid";
import { Trade } from "../../models/Communication";
import { GameModel } from "../../models/Models";
import { NewGameOptions } from "../GameService";
import { SERVICEID } from "../services";


export function doProcessTurn() {
     joki.trigger({
         to: "GameService",
         action: "processTurn",
     });
}


export function doPlayerDone(factionId: string) {
   
    joki.trigger({
        to: "GameService",
        action: "ready",
        data: factionId,
        
    });
}


export function doCreateNewGame(plCount: number) {
    
    const options: NewGameOptions = {
        playerCount: plCount,
    }

    joki.trigger({
        to: "GameService",
        action: "newGame",
        data: options
    })
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
        data: gameId
    });
}

export function doTradeAgreement(trade: Trade) {
    
    const game = joki.service.getState("GameService") as GameModel;

    const trades = [...game.trades];
    trade.id = v4();
    trades.push(trade);

    joki.trigger({
        to: "GameService",
        action: "updateTrades",
        data: trades
    });
    
    
}