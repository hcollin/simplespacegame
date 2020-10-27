import { joki } from "jokits-react";
import { NewGameOptions } from "../GameService";


export function processTurn() {
     joki.trigger({
         to: "GameService",
         action: "processTurn",
     });
}


export function playerDone() {
    joki.trigger({
        to: "GameService",
        action: "ready"
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