import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
// import PeopleAltIcon from "@material-ui/icons/PeopleAlt";

import FlashOnIcon from '@material-ui/icons/FlashOn';
import AdjustIcon from '@material-ui/icons/Adjust';

import useMyCommands from "../hooks/useMyCommands";
import { useService } from "jokits-react";
import { GameModel, SystemModel } from "../models/Models";
import { factionValues } from "../utils/factionUtils";
import { playerDone } from "../services/commands/GameCommands";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "5rem",
        width: "calc(100% - 28rem)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: "solid 2px #0008",

        "& >  div": {

            marginRight: "1rem",
            padding: "0 0.5rem",
            borderLeft: "solid 1px black",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "8rem",

            "& > h1": {
                color: "white",
                fontSize: "1.8rem",
                textShadow: "2px 2px 0 black, -2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black",
                "& > span": {
                    display: "block",
                    fontSize: "1rem",
                }
            },

            "& > img": {
                height: "80%",
            },

            "& > div.mainView": {
                "& > b": {
                    fontSize: "2rem",
                    fontWeight: "bold",
                    padding: "0.5rem",
                },
                "& >span": {
                    fontSize: "1rem",
                    fontWeight: "normal",
                    padding: "0.5rem",
                }

            },
            "& > div.hoverView": {
                display: "none"
            },
            "&:hover": {
                "& > div.mainView": {
                    display: "none"
                },
                "& > div.hoverView": {
                    display: "block"
                },
            }
        }
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
        }
    }
}));

const FactionHeader: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();
    const commands = useMyCommands();

    if (!faction || !game) return null;

    const values = factionValues(game, faction.id);

    const isReady = game.factionsReady.includes(faction.id);

    const totalRingWorlds = game.systems.filter((sm: SystemModel) => sm.ringWorld);
    const myRingWorlds = totalRingWorlds.filter((sm: SystemModel) => sm.ownerFactionId === faction.id);

    const factionTitleStyle = {
        fontFamily: faction.style.fontFamily ? faction.style.fontFamily : "Arial"
    }

    // console.log(faction.name, faction.id, game.factionsReady, isReady)
    return (
        <div className={classes.root} style={{background: `linear-gradient(170deg, #222 0, ${faction.color} 10%,  white 50%, white 80%, gray 100%)`}}>
            <div>
                <img src={require(`../images/symbols/${faction.iconFileName}`)} alt={`faction ${faction.name} logo`}/>
            </div>
            <div>
    <h1 style={factionTitleStyle}>{faction.name} <span>{faction.playerId} {faction.style.fontFamily}</span></h1>
            </div>
            <div>
                <div className="mainView">
                    <MonetizationOnIcon /> <b>{faction.money}</b> <span>( {values.income} )</span>
                </div>
                <div className="hoverView">

                    <div className={classes.sheet}>
                        <label>economy:</label> <span>{values.totalEconomy}</span>
                    </div>
                    <div className={classes.sheet}>
                        <label>expenses:</label> <span>-{values.expenses}</span>
                    </div>
                    <div className={`${classes.sheet} res`}>
                        <label>income:</label> <span>{values.income}</span>
                    </div>
                </div>

            </div>
            <div>
                <div className="mainView">
                    <FlashOnIcon /> <b>{commands.length}</b> <span>/ {values.maxCommands}</span>
                </div>
            </div>
            <div>
                <div className="mainView">
                    <AdjustIcon /> <b>{myRingWorlds.length}</b> <span>( / {totalRingWorlds.length} )</span>
                </div>
            </div>
            <div>
                {!isReady && <Button variant="contained" color="primary" onClick={playerDone}>READY</Button>}
            </div>
        </div>
    )
}


export default FactionHeader;