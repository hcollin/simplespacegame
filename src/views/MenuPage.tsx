import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { fnProcessTurn } from "../api/apiFunctions";
import { apiListGames, apiListMyGames } from "../api/apiGame";
import ShipInfo from "../components/ShipInfo";
import DATASHIPS from "../data/dataShips";
import { GameModel, GameState } from "../models/Models";
import { doCreateNewGame, doLoadGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "1rem",
            background: "radial-gradient(#444, black)",
            color: "#FFFD",
            minHeight: "100vh",
            "&  header": {
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
        row: {
            display: "flex",
            flexDirection: "row",
            "& > div": {
                flex: "1 1 auto",
            }
        }
    })
);

const MenuPage: FC = () => {
    const classes = useStyles();

    const [playerCount] = useState<number>(4);
    const [user, send] = useCurrentUser();

    const [gameList, setGameList] = useState<GameModel[]>([]);


    useEffect(() => {
        
        async function loadGames(uid: string) {
            const games = await apiListMyGames(uid);

            if (games) {
                setGameList(games);
            }

        }
        if(user) {
            loadGames(user.id);
        }
        
    }, [user]);

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

    function processTurn(gid: string) {
        fnProcessTurn(gid);
    }

    async function refreshList() {
        if(user) {
            const games = await apiListMyGames(user.id);

            if (games) {
                setGameList(games);
            }
        }
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
                    <header>
                        <h2>List of Games</h2>
                        <Button variant="contained" onClick={refreshList}>Refresh</Button>
                    </header>
                    
                    {gameList.map((gm: GameModel) => {
                        return (
                        <div key={gm.id} className={classes.row}>

                            <div>
                                <h4>{gm.name}</h4>
                            </div>
                            <div>
                                <p>{gm.turn}</p>
                            </div>
                            <div>
                                <p>{GameState[gm.state]}</p>
                            </div>
                            <div>
                                <Button onClick={() => loadGame(gm.id)} variant="contained">LOAD</Button>
                                {/* {gm.state !== GameState.PROCESSING && <Button onClick={() => processTurn(gm.id)} variant="outlined">PROCESS</Button>} */}
                            </div>
                        </div>);
                    })}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
