import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Command } from "../models/Commands";

import { v4 } from "uuid";
import { joki } from "jokits-react";
import { apiDeleteCommand, apiLoadCommands, apiNewCommand, apiSubscribeToCommands } from "../api/apiCommands";

import { FactionModel, GameModel, GameState } from "../models/Models";
import { SERVICEID } from "./services";
import { User } from "../models/User";

export default function createCommandService(serviceId: string, api: JokiServiceApi): JokiService<Command> {
	let commands: Command[] = [];

	let unsub: null | (() => void) = null;
	let currentTurn: number = -1;

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

				case "syncCommands":
					loadCommands();
					break;

				case "clearCommands":
					commands = [];
					sendUpdate();
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
			playerDone(event.data);
		}

		if (event.action === "CLEANUP") {
			// clearAllCommands();
			console.log("CLEAN UP!", event);
			setTimeout(() => {
				loadCommands();
			}, 10);
		}

		if (api.eventIs.updateFromService(event, SERVICEID.UserService)) {
			loadCommands();
		}

		if (event.from === SERVICEID.GameService && event.action === "ServiceStateUpdated") {
			if (event.data) {
				const g = event.data as GameModel;
				if (currentTurn !== g.turn) {
					currentTurn = g.turn;
					commands = [];
					sendUpdate();
				}
			}
		}
	}

	async function loadCommands() {
		const game = api.api.getServiceState(SERVICEID.GameService) as GameModel;
		const user = api.api.getServiceState(SERVICEID.UserService) as User | null;
		if (user !== null && game.state === GameState.TURN) {
			const faction = game.factions.find((fm: FactionModel) => fm.playerId === user.id);
			if (faction) {
				const allCommands = await apiLoadCommands(game.id);
				const myCommands = allCommands.filter((c: Command) => c.factionId === faction.id && c.completed !== true);
				commands = myCommands;
				sendUpdate();
			}
		}

		// apiLoadMyCommands()
	}

	async function gameLoad(gameId: string) {
		gameUnload();
		// await loadCommands();
		const game = api.api.getServiceState(SERVICEID.GameService) as GameModel;
		try {
			if (gameId !== "" && game.state >= GameState.TURN) {
				unsub = apiSubscribeToCommands(gameId, (cmds: Command[]) => {
					const faction = _getMyFaction();
					commands = cmds.filter((cmd: Command) => cmd.factionId === faction.id && cmd.completed !== true);
					console.log("Commands updated!", commands);
					sendUpdate();
				});
			}
		} catch (e) {
			console.error(e);
		}
	}

	function gameUnload() {
		if (unsub) {
			unsub();
		}
	}

	async function addCommand(command: Command) {
		command.id = `TEMP-${v4()}`;
		
		commands.push(command);
		console.log(command);
		const tempId = command.id;
        sendUpdate();
        try {
            const newCmd = await apiNewCommand({...command, id: ""});
            if(!newCmd) throw new Error("Did not recieve a new command with proper ID");

            commands = commands.map((cmd: Command) => {
                if(cmd.id === tempId) {
                    return newCmd;
                }
                return cmd;
            })
            sendUpdate();
        } catch(e) {
            console.error("Could not recieve a new order id from backend for", command);
            console.error(e)
        }
        
        
	}

	async function removeCommand(cmdId: string) {
		if (cmdId.slice(0, 5) === "TEMP-") {
			console.log("Command not saved yet", cmdId);
			return;
		}
		const cmd = commands.find((cm: Command) => cm.id === cmdId);
		if (cmd) {
			commands = commands.filter((cm: Command) => cm.id !== cmdId);
			sendUpdate();
			try {
				await apiDeleteCommand(cmd);
			} catch (e) {
				console.error("Could not remove command", e);
			}
		}
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

		// const allSaved: Promise<Command>[] = [];
		// commands.forEach((cmd: Command) => {
		// 	if (cmd) cmd.id = "";
		// 	allSaved.push(apiNewCommand(cmd));
		// });

		// Promise.all(allSaved).then((cmds: Command[]) => {
		// 	console.log("Commands Saved!", cmds);

		// 	if (game.factionsReady.length === game.factions.length) {
		// 		loadAllCommandsForProcessing(game.id, game.turn);
		// 	}
		// });
	}

	async function loadAllCommandsForProcessing(gameId: string, turn: number) {
		const allCommands = await apiLoadCommands(gameId);
		if (allCommands) {
			commands = allCommands.filter((cmd: Command) => cmd.turn === turn);
			console.log("All by turn Commands", allCommands, commands);
			joki.trigger({
				to: SERVICEID.GameService,
				action: "processTurn",
				data: commands,
			});
		}
	}

	// function clearAllCommands() {
	//     commands = [];
	//     sendUpdate();
	// }

	function _getMyFaction(): FactionModel {
		const game = api.api.getServiceState("GameService") as GameModel;
		const user = api.api.getServiceState("UserService") as User;

		const f = game.factions.find((fm: FactionModel) => fm.playerId === user.id);
		if (!f) {
			throw new Error(`No faction for user ${user.name} ${user.id} found in game ${game.id}!`);
		}
		return f;
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
