import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import useMyCommands from "../hooks/useMyCommands";
import { useService } from "jokits-react";
import { GameModel } from "../models/Models";
import { factionValues, getFactionScore, researchPointGenerationCalculator } from "../utils/factionUtils";
import { doPlayerDone } from "../services/commands/GameCommands";
import { IconCommand, IconCredit, IconResearchPoint, IconScore } from "./Icons";
import { Command } from "../models/Commands";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
            height: "5rem",
            // width: "calc(100% - 18rem)",
            width: "50%",
            minWidth: "30rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderBottomRightRadius: "15rem 5rem",
            // background: "linear-gradient(170deg, #222 0, red 10%,  white 50%, white 80%, gray 100%)`}}",
            // background: "linear-gradient(0deg, white 0, black 0)",
            // borderBottom: "solid 2px #0008",
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: "-4px",
                zIndex: -1,
                userSelect: "none",
                pointerEvents: "none",
                background: "linear-gradient(to bottom, #222 0, #444E 5%, #555D 80%, #777C 90%, #444E 95%, #222 100%)",
                borderBottom: "solid 4px #0008",
                borderBottomRightRadius: "15rem 5rem",
            },

            "& >  div": {
                // marginRight: "1rem",
                // padding: "0 0.5rem",
                borderLeft: "groove 5px #0008",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "8rem",
                background: "linear-gradient(to bottom, #222 0, #444E 5%, #555D 80%, #777C 90%, #444E 95%, #222 100%)",
                boxShadow: "inset 0 0 1rem 0.5rem #4448",
                
                // background: "linear-gradient(to right, #0008 0, transparent 25%, #FFF6 50%, #0000 100%)",

                "&.title": {
                    background:
                        "linear-gradient(to bottom, #000 5%, #333 10%, #444E 80%, #666D 85%, #333 90%, #000 95%)",
                    boxShadow: "inset 0 0 1rem 0.5rem #0008",
                    "& > h1": {
                        color: "white",
                        fontSize: "1.8rem",
                        fontWeight: "normal",
                        textShadow: "2px 2px 0 black, -2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black",
                        margin: "0 1rem",
                        "& > span": {
                            padding: 0,
                            margin: 0,
                            display: "block",
                            fontSize: "1rem",
                        },
                    },
                },

                "&.rest": {
                    flex: "1 1 auto",
                    borderBottomRightRadius: "15rem 5rem",
                    position: "relative",
                    "&:after": {
                        content: '""',
                        position: "absolute",
                        top:0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderBottomRightRadius: "15rem 5rem",
                        background: "linear-gradient(45deg, transparent 25%, #0001 40%, #FFF3 50%, #0002 60%, #000D 100%)",

                    }
                    
                },

                "& > img": {
                    height: "80%",
                },

                "& > div.mainView, & > div.singleView": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 1rem",
                    "& > div.wrapper": {
                        marginRight: "0.5rem",
                    },
                    "& > b": {
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#FFFD",
                        textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                        // padding: "0.5rem",
                    },
                    "& >span": {
                        fontSize: "1rem",
                        fontWeight: "normal",
                        color: "#FFFD",
                        textShadow: "1px 1px 1px #000, -1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000",
                        marginLeft: "0.25rem",
                    },
                },
                "& > div.hoverView": {
                    display: "none",
                },
                "&:hover": {
                    "& > div.mainView": {
                        display: "none",
                    },
                    "& > div.hoverView": {
                        display: "block",
                    },
                },
            },
        },
        sheet: {
            padding: 0,
            margin: 0,
            fontSize: "1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "8rem",
            alignItems: "center",
            "& > label": {
                fontSize: "0.7rem",
                fontWeight: "bold",
            },

            "&.res": {
                fontWeight: "bold",
                borderTop: "double 3px black",
            },
        },
    })
);

const FactionHeader: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();
    const commands = useMyCommands();

    if (!faction || !game) return null;

    const values = factionValues(game, faction.id);
    const pointsGenerated = researchPointGenerationCalculator(game, faction);

    const isReady = game.factionsReady.includes(faction.id);

    const factionTitleStyle = {
        fontFamily: faction.style.fontFamily ? faction.style.fontFamily : "Arial",
    };

    const uncompletedCommands = commands.filter((cmd: Command) => cmd.completed === false);

    return (
        <div
            className={classes.root}
            style={{
                background: `linear-gradient(190deg, #222 0, ${faction.color} 10%,  white 50%, white 80%, gray 100%)`,
            }}
        >
            <div className="logo" style={{ background: faction.color }}>
                <img src={require(`../images/symbols/${faction.iconFileName}`)} alt={`faction ${faction.name} logo`} />
            </div>
            <div className="title" style={{ borderBottom: `ridge 3px ${faction.color}` }}>
                <h1 style={factionTitleStyle}>{faction.name}</h1>
            </div>
            {/* <div>
                <div className="singleView">
                    <IconCredit size="xl" wrapper="light" />
                    <b>{faction.money}</b> <span>( {values.income} )</span>
                </div>
            </div>
            <div>
                <div className="singleView">
                    <IconCommand size="xl" wrapper="light" /> <b>{uncompletedCommands.length}</b>{" "}
                    <span>/ {values.maxCommands}</span>
                </div>
            </div>
            <div>
                <div className="singleView">
                    <IconResearchPoint size="xl" wrapper="light" /> <b>{pointsGenerated}</b>
                </div>
            </div>
            <div>
                <div className="singleView">
                    <IconScore size="xl" wrapper="light" /> <b>{getFactionScore(game, faction.id)}</b>
                </div>
            </div>
            <div>
                {!isReady && (
                    <Button variant="contained" color="primary" onClick={() => doPlayerDone(faction.id)}>
                        READY
                    </Button>
                )}
            </div> */}
            <div className="rest" style={{background: faction.color}}></div>
        </div>
    );
};

export default FactionHeader;
