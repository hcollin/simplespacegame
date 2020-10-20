import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import {  GameModel } from "../models/Models";
import { createNewGame } from "./helpers/GameHelpers";

export default function createGameService(serviceId: string, api: JokiServiceApi): JokiService<GameModel> {

    let game: GameModel = createNewGame();

    function eventHandler(event: JokiEvent) {

    }

    function getState(): GameModel {
        return { ...game };
    }

    return {
        eventHandler,
        getState
    };


}