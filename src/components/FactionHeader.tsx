import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
// import PeopleAltIcon from "@material-ui/icons/PeopleAlt";

import FlashOnIcon from '@material-ui/icons/FlashOn';
import useMyCommands from "../hooks/useMyCommands";
import { useService } from "jokits-react";
import { GameModel } from "../models/Models";
import { factionValues } from "../utils/factionUtils";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "5rem",
        width: "calc(100% - 28rem)",
        borderBottom: "solid 1px black",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        "& >  div": {
            marginRight: "1rem",
            padding: "0 0.5rem",
            borderLeft: "solid 1px black",
            height: "100%",

            "& > div.mainView": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "8rem",
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

    return (
        <div className={classes.root}>
            <div>
                <h1>{faction.name}</h1>
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
        </div>
    )
}


export default FactionHeader;