import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { apiListGames } from "../api/apiGame";
import ShipInfo from "../components/ShipInfo";
import DATASHIPS from "../data/dataShips";
import { GameModel } from "../models/Models";
import { doCreateNewGame, doLoadGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";

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
                    },
                },
            },
        },
    })
);

const MenuPage: FC = () => {
    const classes = useStyles();

    const [playerCount] = useState<number>(4);
    const [user, send] = useCurrentUser();

    const [gameList, setGameList] = useState<GameModel[]>([]);


    useEffect(() => {
        async function loadGames() {
            const games = await apiListGames();
            if(games) {
                setGameList(games);
            }
            
        }

        loadGames();
    }, []);

    function loginWithGoogle() {
        if (!user) {
            send("loginWithGoogle");
        }
    }

    function loginInDev() {
        if (!user) {
            send("loginAsDev");
        }
    }

    function clickNewGame() {
        doCreateNewGame(playerCount);
    }

    function loadGame(gid: string) {
        doLoadGame(gid);
    }

    return (
        <div className={classes.root}>
            <header>
                <h1>Frost Galaxy</h1>

                {!user && (
                    <div className="logins">
                        <Button variant="contained" color="primary" onClick={loginWithGoogle}>
                            Login with Google
                        </Button>
                        <Button variant="contained" color="primary" onClick={loginInDev}>
                            Login DEVELOPMENT
                        </Button>
                    </div>
                )}
                {user && (
                    <div>
                        <p>Welcome {user.name}</p>
                    </div>
                )}
            </header>

            {user && (
                <div>
                    <h2>Create a new game</h2>

                    <Button variant="contained" color="primary" onClick={clickNewGame}>
                        New {playerCount} player Game
                    </Button>
                </div>
            )}

            {user && (
                <div>
                    <h2>List of Games</h2>
                    {gameList.map((gm: GameModel) => {
                        return <div key={gm.id} onClick={() => loadGame(gm.id)}>{gm.id}</div>;
                    })}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
