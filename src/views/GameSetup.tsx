import { makeStyles, Theme, createStyles, Container, Button, TextField, ButtonGroup, InputLabel, Switch, FormControlLabel } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import FactionSetupView from "../components/FactionSetup";
import { GameModel, GameState } from "../models/Models";
import { doCreateNewGame } from "../services/commands/GameCommands";
import { SERVICEID } from "../services/services";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "radial-gradient(#444, black)",
            color: "#FFFD",
            minHeight: "100vh",
            padding: "1rem",
            margin: 0,
        },
        
        header: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, transparent 0, #8888 10%, #444 15%, #555 90%, #000 100%)",
            boxShadow: "inset 0 0 1rem 0.5rem #0008",
            padding: "1rem",

            "& h1": {
                margin: 0,
                padding: 0,
            },
            "& > div.buttons": {
                flex: "0 0 auto",
                width: "20rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
            }
        },

        part: {
            margin: "1rem 0",

            "& .row": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                "& > div": {
                    padding: "0.5rem",
                    flex: "1 1 auto",
                    "& > label": {
                        margin: "0.25rem 0",
                    }
                    
                }
            },

            "& .field": {
                
            }

        }

    }));


const GameSetup: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>(SERVICEID.GameService);


    const [name, setName] = useState<string>("");
    const [plCount, setPlCount] = useState<number>(4);
    const [starDensity, setStarDensity] = useState<string>("");
    const [distances, setDistances] = useState<string>("");
    const [autoJoin, setAutoJoin] =  useState<boolean>(true);

    useEffect(() => {
        if (game) {
            setName((prev: string) => {
                if (prev === "") return game.name;
                return prev;
            });
            if(game.setup.playerCount === 4 || game.setup.playerCount === 8 ) {
                setPlCount(game.setup.playerCount);
            }
            setStarDensity((prev: string) => {
                if(prev === "") return game.setup.density;
                return prev;
            });
            setDistances((prev: string) => {
                if(prev === "") return game.setup.distances;
                return prev;
            });
            
        }
    }, [game]);



    if (!game) return null;

    function newRandomGame() {
        doCreateNewGame(4);
    }

    function openGame() {

    }

    function startGame() {

    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <div className={classes.root}>
            <Container>
                <header className={classes.header}>
                    <h1>Game Setup</h1>
                    <div className="buttons">
                        <Button variant="contained" onClick={newRandomGame}>Random Game</Button>
                        <Button variant="contained" color="primary" onClick={openGame}>Open Game</Button>
                    </div>

                </header>

                <div className={classes.part}>
                    <h2>Basic Setup</h2>

                    <div className="row">
                        <div>
                            <InputLabel>Name of the Game</InputLabel>
                            <TextField value={name} variant="outlined" onChange={handleNameChange} />
                        </div>

                        <div>
                            <InputLabel>Player Count</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button onClick={() => setPlCount(4)} color={plCount === 4 ? "primary" : "default"}>4</Button>
                                <Button onClick={() => setPlCount(8)} color={plCount === 8 ? "primary" : "default"}>8</Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <InputLabel>Star Density</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button onClick={() => setStarDensity("LOW")} color={starDensity === "LOW" ? "primary" : "default"}>Low</Button>
                                <Button onClick={() => setStarDensity("MEDIUM")} color={starDensity === "MEDIUM" ? "primary" : "default"}>Medium</Button>
                                <Button onClick={() => setStarDensity("HIGH")} color={starDensity === "HIGH" ? "primary" : "default"}>High</Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <InputLabel>Distances</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button onClick={() => setDistances("SHORT")} color={distances === "SHORT" ? "primary" : "default"}>Short</Button>
                                <Button onClick={() => setDistances("MEDIUM")} color={distances === "MEDIUM" ? "primary" : "default"}>Medium</Button>
                                <Button onClick={() => setDistances("LONG")} color={distances === "LONG" ? "primary" : "default"}>Long</Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <InputLabel>Auto Join</InputLabel>
                            <FormControlLabel 
                                control={ <Switch checked={autoJoin} onChange={() => setAutoJoin((prev: boolean) => !prev)} color="primary" /> }
                                label={autoJoin ? "Yes": "No "}
                                color="default"
                                
                            />

                            
                        </div>

                    </div>
                </div>

                {autoJoin && <FactionSetupView />}


            </Container>




        </div>
    )

}

export default GameSetup;