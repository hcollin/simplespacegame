import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Command } from "../models/Commands";

import { v4 } from "uuid";
import { joki } from "jokits-react";
import { apiLoadCommands, apiLoadCommandsAtTurn, apiNewCommand } from "../api/apiCommands";

import { GameModel, GameState } from "../models/Models";
import { SERVICEID } from "./services";

export default function createCommandService(serviceId: string, api: JokiServiceApi): JokiService<Command> {
    let commands: Command[] = [];

    let unsub: null | (() => void) = null;

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

        if (event.from === SERVICEID.GameService && event.action === "loaded") {
            gameLoad(event.data);
        }

        if (event.from === SERVICEID.GameService && event.action === "unloaded") {
            gameUnload();
        }

        if (event.from === SERVICEID.GameService && event.action === "playerDone") {
            // gameUnload();
            playerDone(event.data)
        }

        if (event.action === "nextTurn") {
            clearCompletedCommands();
        }
    }

    function gameLoad(gameId: string) {
        gameUnload();
    }

    function gameUnload() {
        if (unsub) {
            unsub();
        }
    }

    async function addCommand(command: Command) {
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

    function playerDone(game: GameModel) {
        
        // Save all commands to Firebase
        const allSaved: Promise<Command>[] = [];
        commands.forEach((cmd:  Command) => {
            if(cmd)
            cmd.id = "";
            allSaved.push(apiNewCommand(cmd));
        });

        Promise.all(allSaved).then((cmds: Command[]) => {
            console.log("Commands Saved!", cmds);

            if(game.factionsReady.length === game.factions.length) {    
                loadAllCommandsForProcessing(game.id, game.turn);
            }
        });
    }

    async function loadAllCommandsForProcessing(gameId: string, turn: number) {
        const allCommands = await apiLoadCommands(gameId);
        if(allCommands) {
            
            commands = allCommands.filter((cmd: Command) => cmd.turn === turn);
            console.log("All by turn Commands", allCommands, commands);
            joki.trigger({
                to: SERVICEID.GameService,
                action: "processTurn",
                data: commands,
            });
        }
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
