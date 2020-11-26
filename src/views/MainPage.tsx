import { makeStyles, Theme, createStyles, LinearProgress } from "@material-ui/core";
import { useAtomValue, useService } from "jokits-react";
import React, { FC } from "react";
import { GameModel, GameState } from "../models/Models";
// import { doCreateNewGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";
import GameSetup from "./GameSetup";
import GameView from "./GameView";
import JoinGameView from "./JoinGame";
import MenuPage from "./MenuPage";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		processing: {
			display: "flex",
			height: "100vh",
			width: "100%",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			background: "radial-gradient(#456 0, #000 100%)",
			"& > h1": {
				color: "#FFFA",
				fontSize: "4rem",
				textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
			},
			"& > div": {
				width: "60%",
				height: "1rem",
				boxShadow: "0 0 1rem 0.25rem #0008",
			},
		},
	}),
);

const MainPage: FC = () => {
	const classes = useStyles();

	const [user] = useCurrentUser();
	const [game] = useService<GameModel>("GameService");

	const loginState = useAtomValue<string>("UserLoginState", "UNKNOWN");

	// console.log(game && game.state);

	if (loginState === "PROCESSING") {
		return (
			<div className={classes.processing}>
				<h1>Waiting for authentication process to finish...</h1>
				<LinearProgress />
			</div>
		);
	}

	if (user === null || !game) {
		return <MenuPage />;
	}

	// console.log(game.state, GameState[game.state]);

	switch (game.state) {
		case GameState.INIT:
			return <GameSetup />;
		case GameState.OPEN:
			return <JoinGameView />;
		case GameState.TURN:
		case GameState.PROCESSING:
			return <GameView />;
		default:
			return <MenuPage />;
	}

	// if(user === null || !game || game.state === GameState.NONE) {
	//     return <MenuPage />
	// }

	// if(game.state === GameState.INIT || game.id === "") {
	//     return <GameSetup />
	// }

	// return <GameView />
};

export default MainPage;
