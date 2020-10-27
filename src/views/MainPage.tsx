import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useState } from "react";
import { GameModel } from "../models/Models";
import { doCreateNewGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";
import GameView from "./GameView";
import MenuPage from "./MenuPage";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "1rem",
            background: "radial-gradient(#444, black)",
            color: "#FFFD",
            minHeight: "100vh",
            "& > header": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                "& > div.logins": {
                    "& > button": {
                        marginLeft: "0.5rem",
                    }
                }
            }
        }
    }));

const MainPage: FC = () => {
    const classes = useStyles();

    const [user, send] = useCurrentUser();
    const [game] = useService<GameModel>("GameService");

    if(user === null || !game || game.id === "") {
        return <MenuPage />
    }

    return <GameView />

}

export default MainPage;