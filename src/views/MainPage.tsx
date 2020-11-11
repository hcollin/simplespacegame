// import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import { GameModel, GameState } from "../models/Models";
// import { doCreateNewGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";
import GameSetup from "./GameSetup";
import GameView from "./GameView";
import JoinGameView from "./JoinGame";
import MenuPage from "./MenuPage";


// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         root: {
//             padding: "1rem",
//             background: "radial-gradient(#444, black)",
//             color: "#FFFD",
//             minHeight: "100vh",
//             "& > header": {
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",

//                 "& > div.logins": {
//                     "& > button": {
//                         marginLeft: "0.5rem",
//                     }
//                 }
//             }
//         }
//     }));

const MainPage: FC = () => {
    // const classes = useStyles();

    const [user] = useCurrentUser();
    const [game] = useService<GameModel>("GameService");

    console.log(game && game.state);

    if(user === null || !game) {
        return <MenuPage />
    }

    // console.log(game.state, GameState[game.state]);

    switch(game.state) {
        case GameState.INIT:
            return <GameSetup />;
        case GameState.OPEN:
            return <JoinGameView />;
        case GameState.TURN:
        case GameState.PROCESSING:
            return <GameView />
        default:
            return <MenuPage />
    }



    // if(user === null || !game || game.state === GameState.NONE) {
    //     return <MenuPage />
    // }
    
    // if(game.state === GameState.INIT || game.id === "") {
    //     return <GameSetup />
    // }

    // return <GameView />

}

export default MainPage;