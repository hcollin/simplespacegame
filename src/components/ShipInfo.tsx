import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { Ship } from "../models/Models";

import SecurityIcon from '@material-ui/icons/Security';
import StarIcon from '@material-ui/icons/Star';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SpeedIcon from '@material-ui/icons/Speed';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "0.25rem",

            "& > div.data": {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
                "& > span": {
                    flex: "1 1 auto",
                    display: "flex",
                    alignItems: "center",
                    "& > svg": {
                        marginRight: "0.25rem",
                    }
                }
            }
        }
    })
);

interface ShipInfoProps {
    ship: Ship;
}

const ShipInfo: FC<ShipInfoProps> = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <h3>{props.ship.name}</h3>

            <div className="data">
                <span><MonetizationOnIcon />{props.ship.cost}</span>
                <span><BuildIcon />{props.ship.minIndustry}</span>

                <span><SecurityIcon />{props.ship.hull}</span>
                <span><StarIcon />{props.ship.weapons}</span>

                <span><SpeedIcon />{props.ship.speed}</span>

            </div>

        </div>
    );
}

export default ShipInfo;