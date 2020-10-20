import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Command } from "../models/Commands";

import { v4 } from "uuid";

export default function createCommandService(serviceId: string, api: JokiServiceApi): JokiService<Command> {
    let commands: Command[] = [];

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "removeCommand":
                    removeCommand(event.data);
                    break;

                case "addCommand": 
                    addCommand(event.data);
                    break;
            }
        }

        if(event.action === "nextTurn") {
            clearCommands();
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


    function clearCommands() {
        commands = [];
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
