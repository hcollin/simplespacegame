import {
    makeStyles,
    Theme,
    createStyles,
    Button,
    TextField,
    ButtonGroup,
    InputLabel,
    Switch,
    FormControlLabel,
    Grid,
} from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import FactionSetupView from "../components/FactionSetup";
import { FactionSetup, GameModel } from "../models/Models";
import { doCloseCurrentGame, doCreateNewGame } from "../services/commands/GameCommands";
import { SERVICEID } from "../services/services";

import starfieldJpeg from "../images/starfield2.jpg";
import MenuPageContainer from "../components/MenuPageContainer";


import MiniMap from "../components/MiniMap";
import { PLAYERCOUNTS } from "../configs";
import { SystemModel } from "../models/StarSystem";
import { getDistanceMultiplier, getStarCount, createRandomMap } from "../tools/mapgenerator/mapGenerator";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "radial-gradient(#666F, #555E 15%, #444D 30%, #111D 80%, #000A)",
            color: "#FFFD",
            minHeight: "100vh",
            padding: "1rem",
            margin: 0,
            position: "relative",
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundImage: `url(${starfieldJpeg})`,
                backgroundSize: "cover",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: "-1",
            },

            "& > div": {
                background: "#0124",
                border: "groove 5px #68A8",
                padding: 0,
                boxShadow: "inset 0 0 5rem 2rem #0008",
                borderRadius: "2rem",
            },
        },

        header: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#68A3",
            boxShadow: "inset 0 0 1rem 0.5rem #0004",
            padding: "1rem",
            border: "solid 5px transparent",
            borderBottom: "ridge 5px #68A",
            borderTopLeftRadius: "2rem",
            borderTopRightRadius: "2rem",

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
            },
        },

        part: {
            margin: "1rem 0",
            padding: "1rem",

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
                    },
                },
            },

            "& .field": {},
        },
        column: {
            "& > div": {
                marginBottom: "2rem",
                padding: "0.5rem",
                "& > label": {
                    margin: "0.5rem 0",
                },
            },
        },
    })
);

const GameSetup: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>(SERVICEID.GameService);

    const [name, setName] = useState<string>("");
    const [plCount, setPlCount] = useState<number>(4);
    const [starDensity, setStarDensity] = useState<string>("");
    const [distances, setDistances] = useState<string>("");
    const [specials, setSpecials] = useState<string>("AVERAGE");
    const [autoJoin, setAutoJoin] = useState<boolean>(true);
    const [webHook, setWebHook] = useState<string>("");

    const [factionSetup, setFactionSetup] = useState<FactionSetup | undefined>(undefined);

    const [exampleMap, setExampleMap] = useState<SystemModel[]>([]);

    useEffect(() => {
        if (game) {
            setName((prev: string) => {
                if (prev === "") return game.name;
                return prev;
            });
            if (game.setup.playerCount > 0 && game.setup.playerCount < 9) {
                setPlCount(game.setup.playerCount);
            }
            setStarDensity((prev: string) => {
                if (prev === "") return game.setup.density;
                return prev;
            });
            setDistances((prev: string) => {
                if (prev === "") return game.setup.distances;
                return prev;
            });
        }
    }, [game]);

    useEffect(() => {
        console.log("Example map")
        if (distances !== "" && starDensity !== "" && plCount > 0) {
            // const densityMultiplier = getDensityMultiplier(starDensity);
            const sizeCounter = getDistanceMultiplier(distances);
            const starCount = getStarCount(starDensity, distances, plCount);
            console.log("StarCount", starCount);
            const rndMap = createRandomMap(starCount, sizeCounter,specials, plCount);
            setExampleMap(rndMap);
        }
    }, [distances, starDensity, plCount, specials]);

    if (!game) return null;

    function createGame() {
        doCreateNewGame({
            autoJoin: autoJoin,
            name: name,
            density: starDensity,
            distances: distances,
            playerCount: plCount,
            faction: factionSetup || undefined,
            specials: specials,
            length: "MEDIUM",
            discordWebHook: webHook
        });
    }

    function setFaction(fs: FactionSetup) {
        setFactionSetup(fs);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleWebHookChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebHook(event.target.value);
    };

    // const denM = getDensityMultiplier(starDensity);
    const distM = getDistanceMultiplier(distances);

    return (
        <MenuPageContainer title="Game Setup" backHandler={doCloseCurrentGame}>
            <div className="actions">
                <Button variant="contained" color="primary">
                    Random Game
                </Button>

                <Button variant="contained" color="primary" onClick={createGame}>
                    Create Game
                </Button>
            </div>

            <div className={classes.part}>
                <h2>Basic Setup</h2>

                <Grid container spacing={1}>
                    <Grid item lg={3} className={classes.column}>
                        <div>
                            <InputLabel>Name of the Game</InputLabel>
                            <TextField value={name} variant="outlined" onChange={handleNameChange} />
                        </div>
                        <div>
                            <InputLabel>Player Count</InputLabel>
                            <ButtonGroup variant="contained">
                                {PLAYERCOUNTS.map((plc: number) => {
                                    return (
                                        <Button
                                        key={`playerCount-${plc}`}
                                            onClick={() => setPlCount(plc)}
                                            color={plCount === plc ? "primary" : "default"}
                                        >
                                            {plc}
                                        </Button>
                                    );
                                })}
{/* 
                                <Button onClick={() => setPlCount(4)} color={plCount === 4 ? "primary" : "default"}>
                                    4
                                </Button>
                                <Button onClick={() => setPlCount(6)} color={plCount === 6 ? "primary" : "default"}>
                                    6
                                </Button>
                                <Button onClick={() => setPlCount(8)} color={plCount === 8 ? "primary" : "default"}>
                                    8
                                </Button> */}
                            </ButtonGroup>
                        </div>
                        <div>
                            <InputLabel>Auto Join</InputLabel>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={autoJoin}
                                        onChange={() => setAutoJoin((prev: boolean) => !prev)}
                                        color="primary"
                                    />
                                }
                                label={autoJoin ? "Yes" : "No "}
                                color="default"
                            />
                        </div>
                        <div>
                        <InputLabel>Discord Web Hook</InputLabel>
                        <TextField value={webHook} variant="outlined" onChange={handleWebHookChange} />
                        </div>
                    </Grid>
                    <Grid item lg={4} className={classes.column}>
                        <div>
                            <InputLabel>Star Density</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button
                                    onClick={() => setStarDensity("LOW")}
                                    color={starDensity === "LOW" ? "primary" : "default"}
                                >
                                    Low
                                </Button>
                                <Button
                                    onClick={() => setStarDensity("MEDIUM")}
                                    color={starDensity === "MEDIUM" ? "primary" : "default"}
                                >
                                    Medium
                                </Button>
                                <Button
                                    onClick={() => setStarDensity("HIGH")}
                                    color={starDensity === "HIGH" ? "primary" : "default"}
                                >
                                    High
                                </Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <InputLabel>Galaxy Size</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button
                                    onClick={() => setDistances("SHORT")}
                                    color={distances === "SHORT" ? "primary" : "default"}
                                >
                                    Small
                                </Button>
                                <Button
                                    onClick={() => setDistances("MEDIUM")}
                                    color={distances === "MEDIUM" ? "primary" : "default"}
                                >
                                    Medium
                                </Button>
                                <Button
                                    onClick={() => setDistances("LONG")}
                                    color={distances === "LONG" ? "primary" : "default"}
                                >
                                    Large
                                </Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <InputLabel>Specials</InputLabel>
                            <ButtonGroup variant="contained">
                                <Button
                                    onClick={() => setSpecials("NONE")}
                                    color={specials === "NONE" ? "primary" : "default"}
                                >
                                    None
                                </Button>
                                <Button
                                    onClick={() => setSpecials("RARE")}
                                    color={specials === "RARE" ? "primary" : "default"}
                                >
                                    Rare
                                </Button>
                                <Button
                                    onClick={() => setSpecials("AVERAGE")}
                                    color={specials === "AVERAGE" ? "primary" : "default"}
                                >
                                    Average
                                </Button>
                                <Button
                                    onClick={() => setSpecials("COMMON")}
                                    color={specials === "COMMON" ? "primary" : "default"}
                                >
                                    Common
                                </Button>
                                <Button
                                    onClick={() => setSpecials("ALL")}
                                    color={specials === "ALL" ? "primary" : "default"}
                                >
                                    All
                                </Button>
                            </ButtonGroup>
                        </div>

                        <div>
                            <h4>Map info</h4>
                            <p>Star count {exampleMap.length}</p>
                            <p>
                                Map Size {distM}x{distM}
                            </p>
                        </div>
                    </Grid>
                    <Grid item lg={5} className={classes.column}>
                        <label>Example of the map</label>
                        <MiniMap stars={exampleMap} size={distM * 2} distances={distM} />
                    </Grid>
                </Grid>
            </div>

            {autoJoin && <FactionSetupView onChange={setFaction} factions={[]} />}
        </MenuPageContainer>
    );
};

export default GameSetup;
