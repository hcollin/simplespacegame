import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Command } from "../models/Commands";

import { v4 } from "uuid";

export default function createCommandService(serviceId: string, api: JokiServiceApi): JokiService<Command> {
    let commands: Command[] = [];

    let unsub: null |(() => void) = null;

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "removeCommand":
                    removeCommand(event.data);
                    break;

                case "addCommand":
                    addCommand(event.data);
                    break;

                case "commandDone":
                    commandDone(event.data);
                    break;
            }
        }

        if(event.from === "GameService" && event.action === "loaded") {
            gameLoad(event.data);
        }

        if(event.from === "GameService" && event.action === "unloaded") {
            gameUnload();
        }

        if (event.action === "nextTurn") {
            clearCompletedCommands();
        }
    }

    function gameLoad(gameId: string) {
        gameUnload();

        
    }

    function gameUnload() {
        if(unsub) {
            unsub();
        }
    }

    


    function addCommand(command: Command) {
        command.id = v4();
        commands.push(command);
        sendUpdate();
    }

    function removeCommand(cmdId: string) {
        commands = commands.filter((cm: Command) => cm.id !== cmdId);
        sendUpdate();
    }

    function commandDone(cmdId: string) {
        commands = commands.map((cm: Command) => {
            if (cm.id === cmdId) {
                cm.completed = true;
            }
            return cm;
        });
    }

    function clearCompletedCommands() {
        commands = commands.filter((cmd: Command) => cmd.completed === false);
        sendUpdate();
    }

    function getState(): Command[] {
        return [...commands];
    }

    function sendUpdate() {
        api.updated([...commands]);
    }

    return {
        eventHandler,
        getState,
    };
}
