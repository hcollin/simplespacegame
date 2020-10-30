import { JokiServiceApi, JokiService, JokiEvent } from "jokits";
import { v4 } from "uuid";
import { ChatMessage } from "../models/Communication";
import { FactionModel, GameModel } from "../models/Models";
import { User } from "../models/User";

export function createChatService(serviceId: string, api: JokiServiceApi): JokiService<ChatMessage> {

    const msgs: ChatMessage[] = [];

    function eventHandler(event: JokiEvent) {
        if(event.to === serviceId) {
            switch(event.action) {
                case "send":
                    sendMessage(event.data.to, event.data.msg);
                    break;
            }
        }
    }

    function sendMessage(to: string, msg: string) {
        const faction = _getMyFaction();
        const chat: ChatMessage = {
            id: v4(),
            from: faction.id,
            to: to,
            message: msg,
            sent: Date.now(),
        };

        msgs.push(chat);
        sendUpdate();
    }

    function getState() {
        return msgs;
    }

    function sendUpdate() {
        api.updated([...msgs]);
    }

    function _getMyFaction(): FactionModel {
        const game = api.api.getServiceState("GameService") as GameModel;
        const user = api.api.getServiceState("UserService") as User;

        const f = game.factions.find((fm: FactionModel) => fm.playerId === user.id);
        if(!f) {
            throw new Error(`No faction for user ${user.name} ${user.id} found in game ${game.id}!`);
        }
        return f;

    }

    return {
        eventHandler,
        getState
    }
}