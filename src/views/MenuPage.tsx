import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { fnProcessTurn } from "../api/apiFunctions";
import { apiListGames, apiListMyGames, apiListOpenGames } from "../api/apiGame";
import MenuPageContainer from "../components/MenuPageContainer";
import ShipInfo from "../components/ShipInfo";
import DATASHIPS from "../data/dataShips";
import { GameModel, GameState } from "../models/Models";
import { doCreateDraftGame, doCreateNewGame, doLoadGame } from "../services/commands/GameCommands";
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
            },
        },
    })
);

const MenuPage: FC = () => {
    const classes = useStyles();

    const [playerCount] = useState<number>(4);
    const [user, send] = useCurrentUser();

    const [myGames, setMyGames] = useState<GameModel[]>([]);
    const [openGames, setOpenGames] = useState<GameModel[]>([]);


    useEffect(() => {
        async function loadGames(uid: string) {
            const games = await apiListMyGames(uid);

            if (games) {
                setMyGames(games);
            }
        }
        if (user) {
            loadGames(user.id);
        }
    }, [user]);

    useEffect(() => {
        async function loadGames() {

            const games = await apiListOpenGames();
            
            if (games) {
                setOpenGames(games);
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
        // doCreateNewGame(playerCount);
        doCreateDraftGame();
    }

    function loadGame(gid: string) {
        doLoadGame(gid);
    }

    function processTurn(gid: string) {
        fnProcessTurn(gid);
    }

    async function refreshList() {
        if (user) {
            apiListMyGames(user.id).then((games) => {
                setMyGames(games);
            });
        }

        apiListOpenGames().then((games) => {
            setOpenGames(games);
        });
    }

    return (
        <MenuPageContainer title="Frost Galaxy">
            {!user && (
                <div className="actions">
                    <Button variant="contained" color="primary" onClick={loginWithGoogle}>
                        Login with Google
                    </Button>
                    <Button variant="contained" color="primary" onClick={loginInDev}>
                        Login DEVELOPMENT
                    </Button>
                </div>
            )}

            {user && (
                <div className="actions">


                    <Button variant="contained" color="primary" onClick={clickNewGame}>
                        New Game
                    </Button>

                </div>
            )}

            {user && (
                <>
                    <section>
                        <header>
                            <h2>List of My Games</h2>
                            <Button variant="contained" onClick={refreshList}>
                                Refresh
                        </Button>
                        </header>

                        {myGames.map((gm: GameModel) => {
                            return (
                                <div key={gm.id} className={classes.row}>
                                    <div>
                                        <h4>{gm.name}</h4>
                                    </div>
                                    <div>
                                        <p>{gm.turn}</p>
                                    </div>
                                    <div>
                                        <p>{gm.factions.length}/{gm.setup.playerCount}</p>
                                    </div>
                                    <div>
                                        <p>{GameState[gm.state]}</p>
                                    </div>
                                    <div>
                                        {gm.state === GameState.TURN && <Button onClick={() => loadGame(gm.id)} variant="contained">
                                            LOAD
                                    </Button>}
                                        {gm.state === GameState.OPEN && !gm.playerIds.includes(user.id) && <Button onClick={() => loadGame(gm.id)} variant="contained">
                                            JOIN
                                    </Button>}
                                        {gm.state === GameState.OPEN && gm.playerIds.includes(user.id) && <p>Waiting for more players...</p>}
                                        {/* {gm.state !== GameState.PROCESSING && <Button onClick={() => processTurn(gm.id)} variant="outlined">PROCESS</Button>} */}
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section>
                        <header>
                            <h2>Open Games</h2>

                        </header>
                        {openGames.map((gm: GameModel) => {
                            if (gm.playerIds.includes(user.id)) return null;
                            return (
                                <div key={gm.id} className={classes.row}>
                                    <div>
                                        <h4>{gm.name}</h4>
                                    </div>
                                    <div>
                                        <p>{gm.turn}</p>
                                    </div>
                                    <div>
                                        <p>{gm.factions.length}/{gm.setup.playerCount}</p>
                                    </div>
                                    <div>
                                        <p>{GameState[gm.state]}</p>
                                    </div>
                                    <div>
                                        <Button onClick={() => loadGame(gm.id)} variant="contained">
                                            JOIN
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}

                    </section></>
            )}
        </MenuPageContainer>
    );
};

export default MenuPage;

