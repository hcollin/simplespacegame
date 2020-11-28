import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";

import { apiListMyGames, apiListOpenGames } from "../api/apiGame";
import FactionBlock from "../components/FactionBlock";
import MenuPageContainer from "../components/MenuPageContainer";
import { FactionModel, GameModel, GameState } from "../models/Models";
import { doCreateDraftGame, doLoadGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";
import ReplayIcon from '@material-ui/icons/Replay';
import LoginForm from "../components/LoginForm";
import AuthProviders from "../components/AuthProviders";

import frostTrollLogoPng from '../images/FrostTrollLogo.png';
import SubMenuButton from "../components/SubMenuButton";


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
            alignItems: "center",
            marginBottom: "0.5rem",
            "& > div": {
                flex: "1 1 auto",

                "& > h4, & > p": {
                    margin: 0,
                },
                "&.sm": {
                    flex: "0 0 auto",
                    width: "4rem",
                },
                "&.md": {
                    flex: "0 0 auto",
                    width: "8rem",
                    [theme.breakpoints.down("md")]: {
                        width: "25%",
                    }
                },
                "&.lg": {
                    flex: "0 0 auto",
                    width: "16rem",
                    [theme.breakpoints.down("md")]: {
                        width: "50%",
                    }
                },
                "&.center": {
                    textAlign: "center",
                },
                "&.right": {
                    textAlign: "right",
                },
                "&.first": {
                    paddingLeft: "1rem",
                }

            },
            "&:nth-child(odd)": {
                backgroundColor: "#FFF1",
            },
            "&:nth-child(even)": {
                backgroundColor: "#0001",
            },
            [theme.breakpoints.down("md")]: {
                flexWrap: "wrap",
                
            }


        },
    })
);

const ENV = process.env.NODE_ENV;

const MenuPage: FC = () => {
    const classes = useStyles();

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

    function loginInDev(ind: number) {
        if (!user) {
            send("loginAsDev", ind);
        }
    }

    function clickNewGame() {
        // doCreateNewGame(playerCount);
        doCreateDraftGame();
    }

    function loadGame(gid: string) {
        doLoadGame(gid);
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

    // const rndNames: string[] =  [];
    // for(let i = 0; i <100; i++) {
    //     rndNames.push(shipNameGenerator());
    // }

    // rndNames.sort();



    const isDev = ENV === "development";
    return (
        <MenuPageContainer title="Frost Galaxy">
            

            {!user && (
                <section className="row">
                    <LoginForm />
                    <AuthProviders />

                    <div style={{flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <img src={frostTrollLogoPng} alt="Frost Troll" style={{width: "80%"}}/>
                    </div>
                </section>
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
                                <ReplayIcon />
                            </Button>
                        </header>

                        {myGames.map((gm: GameModel) => {
                            const faction = gm.factions.find((fm: FactionModel) => fm.playerId === user.id);
                            if (!faction) return null;
                            return (

                                <div key={gm.id} className={classes.row}>
                                    <div className="lg first">
                                        <h4>{gm.name}</h4>
                                    </div>
                                    <div>
                                        <FactionBlock faction={faction} size="sm" />
                                    </div>
                                    <div className="sm center">
                                        <p>{gm.turn}</p>
                                    </div>
                                    <div className="sm center">
                                        <p>
                                            {gm.factions.length}/{gm.setup.playerCount}
                                        </p>
                                    </div>

                                    <div className="sm center">
                                        <p>{GameState[gm.state]}</p>
                                    </div>
                                    <div className="md right">
                                        {gm.state === GameState.TURN && (
                                            <Button onClick={() => loadGame(gm.id)} variant="contained">
                                                LOAD
                                            </Button>
                                        )}
                                        {gm.state === GameState.OPEN && (
                                            <Button onClick={() => loadGame(gm.id)} variant="contained">
                                                VIEW
                                            </Button>
                                        )}
                                        {gm.state === GameState.OPEN && !gm.playerIds.includes(user.id) && (
                                            <Button onClick={() => loadGame(gm.id)} variant="contained">
                                                JOIN
                                            </Button>
                                        )}
                                        {/* {gm.state === GameState.OPEN && gm.playerIds.includes(user.id) && (
                                            <p>Waiting for more players...</p>
                                        )} */}
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
                                    <div className="first">
                                        <h4>{gm.name}</h4>
                                    </div>
                                    <div className="sm center">
                                        <p>{gm.turn}</p>
                                    </div>
                                    <div className="sm center">
                                        <p>
                                            {gm.factions.length}/{gm.setup.playerCount}
                                        </p>
                                    </div>
                                    <div className="sm center">
                                        <p>{GameState[gm.state]}</p>
                                    </div>
                                    <div className="md right">
                                        <Button onClick={() => loadGame(gm.id)} variant="contained">
                                            JOIN
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </>
            )}

            {/* <h3>Test area</h3> */}
            

            {/* <div style={{display: "flex", flexWrap: "wrap"}}>{rndNames.map((n: string, i: number) => <p key={i} style={{width: "15rem", margin: "0.25rem 0", padding: 0}}>{n}</p>)}</div> */}

        </MenuPageContainer>
    );
};

export default MenuPage;
