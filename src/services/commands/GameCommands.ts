import { joki } from "jokits-react";


export function processTurn() {
     joki.trigger({
         to: "GameService",
         action: "processTurn",
     });
}


export function playerDone() {
    
}