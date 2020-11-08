import { JokiServiceApi, JokiService, JokiEvent } from "jokits";
import { apiNewChat, apiSubscribeToChat } from "../api/apiChat";

import { ChatMessage } from "../models/Communication";
import { FactionModel, GameModel } from "../models/Models";
import { User } from "../models/User";
import { SERVICEID } from "./services";

export function createChatService(serviceId: string, api: JokiServiceApi): JokiService<ChatMessage> {
    let msgs: ChatMessage[] = [];

    let gameId: string = "";
    let unsub: null | (() => void) = null;

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "send":
                    sendMessage(event.data.to, event.data.msg);
                    break;
            }
        }

        if (event.from === SERVICEID.GameService && event.action === "loaded") {
            gameLoad(event.data);
        }

        if (event.from === SERVICEID.GameService && event.action === "unloaded") {
            gameUnload();
        }
    }

    function gameLoad(gid: string) {
        gameUnload();
        gameId = gid;

        if (gameId !== "") {
            const faction = _getMyFaction();

            unsub = apiSubscribeToChat(gameId, (chatMsgs: ChatMessage[]) => {
                msgs = chatMsgs.filter(
                    (msg: ChatMessage) =>
                        msg.from === faction.id || msg.to === faction.id || msg.to === GLOBALMESSAGEKEY
                );
                sendUpdate();
            });
        }
    }

    function gameUnload() {
        if (unsub) {
            unsub();
            gameId = "";
        }
    }

    async function sendMessage(to: string, msg: string) {
        if (gameId === "") return;
        const faction = _getMyFaction();

        const chat: ChatMessage = await apiNewChat({
            id: "",
            gameId: gameId,
            from: faction.id,
            to: to,
            message: msg,
            sent: Date.now(),
        });

        console.log("CHAT MESSAGE", chat);
        

        // sendUpdate();
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
        if (!f) {
            throw new Error(`No faction for user ${user.name} ${user.id} found in game ${game.id}!`);
        }
        return f;
    }

    return {
        eventHandler,
        getState,
    };
}

const GLOBALMESSAGEKEY = "_GLOBAL";
export { GLOBALMESSAGEKEY };
