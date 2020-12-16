import { makeStyles, Theme, createStyles, TextField, Select, MenuItem, Button, Grid } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import React, { FC, useEffect, useState } from "react";
import { FACTION_COLORS, FACTION_FONTS, FACTION_NAMES } from "../configs";
import { FactionModel, FactionSetup } from "../models/Models";

import { arnd, prnd, rnd } from "../utils/randUtils";
import RandomizeButton from "./RandomizeButton";
import useCurrentUser from "../services/hooks/useCurrentUser";
import { randomFactionName } from "../tools/factionsetup/factionNameGenerator";

const ICONSPERPAGE = 16;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
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
                "& > label": {
                    flex: "0 0 auto",
                    width: "20%",
                },
            },

            "& > div": {
                margin: "1rem 0",
            },

            "& .field": {},

            "& .info": {
                padding: "1rem",

                "& div.icon-grid": {
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    "& > div:not(.pageing)": {
                        flex: "0 0 auto",
                        width: "23%",
                        padding: "1%",
                        background: "#FFFA",
                        borderRadius: "5%",
                        margin: "0.5%",
                        border: "solid 2px transparent",
                        userSelect: "none",

                        "&:hover": {
                            border: "solid 2px #0008",
                            background: "#ACFA",
                            cursor: "pointer",
                        },

                        "&.selected": {
                            border: "solid 2px #0008",
                            background: "#BDFA",
                        },
                        "&.taken": {
                            opacity: 0.25,
                        },
                    },
                    "& >div.pageing": {
                        flex: "1 1 auto",
                        width: "100%",
                        padding: "1rem 0",

                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    },
                },

                "& div.faction-icon": {
                    height: "5rem",
                    width: "5rem",
                    padding: "0.5rem",
                    boxShadow: "inset 0 0 1rem 0.25rem #0008",
                },

                "& div.color-grid": {
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",

                    "& > div.color-box": {
                        width: "3rem",
                        height: "3rem",
                        flex: "0 0 auto",
                        margin: "0.75rem",

                        border: "solid 3px transparent",

                        "&:hover": {
                            border: "solid 3px gray",
                        },
                        "&.selected": {
                            border: "solid 3px white",
                            width: "4rem",
                            height: "4rem",
                            margin: "0.25rem",
                        },
                        "&.taken": {
                            opacity: 0.75,
                            width: "2rem",
                            height: "2rem",
                            margin: "1.25rem",
                            
                        }
                    },
                },

                "& h1": {
                    fontWeight: "normal",
                    fontSize: "3rem",
                    lineHeight: "5rem",
                    padding: 0,
                    margin: 0,
                },

                "& label": {
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    margin: "1rem 0",
                },
            },
        },
    })
);

interface Props {
    setup?: FactionSetup;
    onChange: (setup: FactionSetup) => void;
    factions: FactionModel[];
}

const FactionSetupView: FC<Props> = (props) => {
    const classes = useStyles();

    const [setup, setSetup] = useState<FactionSetup>(
        props.setup || {
            name: randomFactionName(),
            color: arnd(FACTION_COLORS),
            fontFamily: arnd(FACTION_FONTS),
            iconFileName: `abstract-${prnd(1,118)}.svg`,
            playerId: "",
        }
    );
    
    

    const [valid] = useState<boolean>(true);

    const [iconIndex, setIconIndex] = useState<number>(1);
    const [user] = useCurrentUser();

    useEffect(() => {
        if (user) {
            setSetup((prev: FactionSetup) => {
                if (prev.playerId !== user.userId) {
                    return { ...prev, playerId: user.userId };
                }
                return prev;
            });
        }
    }, [user]);

    useEffect(() => {
        if (valid) {
            props.onChange(setup);
        }
    }, [setup, valid, props]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const valid = props.factions.find((fm: FactionModel) => fm.name === event.target.value) === undefined;
        if (valid) {
            setSetup((prev: FactionSetup) => {
                prev.name = event.target.value;
                return { ...prev };
            });
        }
    };

    const handleFontChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSetup((prev: FactionSetup) => {
            prev.fontFamily = event.target.value as string;
            return { ...prev };
        });
    };

    const handleChangeIcon = (iconFn: string) => {
        const valid = props.factions.find((fm: FactionModel) => fm.iconFileName === iconFn) === undefined;
        if (valid) {
            setSetup((prev: FactionSetup) => {
                prev.iconFileName = iconFn;
                return { ...prev };
            });
        }
    };

    const handleChangeColor = (color: string) => {
        const validColor = props.factions.find((fm: FactionModel) => fm.color === color) === undefined;
        if (validColor) {
            setSetup((prev: FactionSetup) => {
                prev.color = color;
                return { ...prev };
            });
        }
    };

    function randomName() {
        setSetup((prev: FactionSetup) => {
            prev.name = `${arnd(FACTION_NAMES[0])} ${arnd(FACTION_NAMES[1])} ${arnd(FACTION_NAMES[2])}`;
            return { ...prev };
        });
    }

    function randomFaction() {
        if (user) {

            let valid = false;
            while(!valid) {
                const newSetup: FactionSetup = {
                    name: `${arnd(FACTION_NAMES[0])} ${arnd(FACTION_NAMES[1])} ${arnd(FACTION_NAMES[2])}`,
                    color: arnd(FACTION_COLORS),
                    fontFamily: arnd(FACTION_FONTS),
                    iconFileName: `abstract-${prnd(1, 120)}.svg`,
                    playerId: user.userId,
                };

                valid = true;

                if(props.factions.find((fm: FactionModel) => {
                    if(fm.color === newSetup.color) return true;
                    if(fm.name === newSetup.name) return true;
                    if(fm.iconFileName === newSetup.iconFileName) return true;
                    if(fm.style.fontFamily === newSetup.fontFamily) return true;
                    return false;
                }) !== undefined) {
                    valid=false;
                }

                

                if(valid) {
                    setSetup(newSetup);
                }
            }


            // const newSetup: FactionSetup = {
            //     name: `${arnd(FACTION_NAMES[0])} ${arnd(FACTION_NAMES[1])} ${arnd(FACTION_NAMES[2])}`,
            //     color: arnd(FACTION_COLORS),
            //     fontFamily: arnd(FACTION_FONTS),
            //     iconFileName: `abstract-${String(rnd(1, 120)).padStart(3, "0")}.svg`,
            //     playerId: user.id,
            // };
            
        }
    }

    const icons: string[] = [];
    for (let i = iconIndex; i < iconIndex + ICONSPERPAGE; i++) {
        icons.push(`abstract-${String(i).padStart(3, "0")}.svg`);
    }

    return (
        <div className={classes.root}>
            <header className="row">
                <h2>Faction setup</h2>
                <RandomizeButton
                    variant="contained"
                    color="primary"
                    onClick={randomFaction}
                    toolTip="Randomize Faction!"
                />
            </header>

            <div className="info">
                <Grid container>
                    <Grid item lg={12}>
                        <label>My faction</label>
                    </Grid>
                    <Grid item lg={1}>
                        <div className="faction-icon" style={{ backgroundColor: setup.color }}>
                            <img src={require(`../images/symbols/${setup.iconFileName}`)} alt="Faction Icon" />
                        </div>
                    </Grid>
                    <Grid item lg={11}>
                        <h1 style={{ fontFamily: setup.fontFamily }}>{setup.name}</h1>
                    </Grid>
                </Grid>
            </div>

            <Grid container>
                <Grid item lg={6}>
                    <div className="info row">
                        <InputLabel>Faction Name</InputLabel>
                        <TextField value={setup.name} onChange={handleNameChange} fullWidth={true} />
                        <RandomizeButton onClick={randomName} variant="contained" toolTip="Give me a random name!" />
                    </div>

                    <div className="info row">
                        <InputLabel id="faction-font-label">Font</InputLabel>
                        <Select value={setup.fontFamily} labelId="faction-font-label" onChange={handleFontChange}>
                            {FACTION_FONTS.map((ff: string) => (
                                <MenuItem value={ff} key={ff}>
                                    {ff}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="info row">
                        <InputLabel id="faction-color-label">Color</InputLabel>

                        <div className="color-grid">
                            {FACTION_COLORS.map((c: string) => {
                                const available = props.factions.find((fm: FactionModel) => fm.color === c) === undefined;
                                
                                return (
                                    <div
                                        className={`color-box ${setup.color === c ? "selected" : ""} ${available ? "" : "taken"}`}
                                        key={c}
                                        style={{ backgroundColor: c }}
                                        onClick={() => available ? handleChangeColor(c) : null}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </Grid>
                <Grid item lg={6}>
                    <div className="info row">
                        <InputLabel id="faction-icon-label">Icon</InputLabel>

                        <div className="icon-grid">
                            {icons.map((fn: string) => {
                                const available = props.factions.find((fm: FactionModel) => fm.iconFileName === fn) === undefined;
                                return (
                                    <div
                                        key={fn}
                                        className={`icon-container ${fn === setup.iconFileName ? "selected" : ""} ${available ? "" : "taken"}`}
                                        onClick={() => available ? handleChangeIcon(fn) : null}
                                    >
                                        <img src={require(`../images/symbols/${fn}`)} alt="Icon" />
                                    </div>
                                );
                            })}

                            <div className="pageing">
                                <Button
                                    variant="contained"
                                    disabled={iconIndex <= 1}
                                    onClick={() =>
                                        setIconIndex((prev: number) =>
                                            prev > ICONSPERPAGE + 1 ? prev - ICONSPERPAGE : 1
                                        )
                                    }
                                >
                                    Prev
                                </Button>
                                <RandomizeButton
                                    variant="contained"
                                    onClick={() =>
                                        handleChangeIcon(`abstract-${String(rnd(1, 120)).padStart(3, "0")}.svg`)
                                    }
                                    toolTip="Randomize faction icon"
                                />

                                <Button
                                    variant="contained"
                                    disabled={iconIndex + ICONSPERPAGE >= 120}
                                    onClick={() =>
                                        setIconIndex((prev: number) =>
                                            prev + ICONSPERPAGE < 120 ? prev + ICONSPERPAGE : prev
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default FactionSetupView;
