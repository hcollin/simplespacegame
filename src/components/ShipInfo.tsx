import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { OldShip } from "../models/Models";

import SecurityIcon from '@material-ui/icons/Security';
import StarIcon from '@material-ui/icons/Star';

import SpeedIcon from '@material-ui/icons/Speed';

import { IconCredit, IconIndustry } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            padding: 0,
            border: "solid 2px #0008",
            // background: "#0004",
            background: "#666",
            borderRadius: "0.5rem",
            width: "25rem",
            boxShadow: "inset 0 0 1rem 0.25rem #0044",
            "& > h3": {
                padding: "0.25rem",
                height: "2.2rem",
                margin: 0,
                background: "#0004",
                borderBottom: "solid 2px #0008",
                color: "#FFFD",
                textShadow: "1px 1px 1px #000, -1px 1px 2px #000, -1px -1px 1px #000, 1px -1px 1px #000",
            },
            "& > div.corner": {
                position: "absolute",
                top: 0,
                right: 0,
                padding: "0 0.25rem 0 0.75rem",
                height: "2.2rem",
                background: "#0007",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                fontWeight: "bold",
                borderBottomLeftRadius: "1rem",
                color: "#FFFE",

                "& > img": {
                    margin: "0 9px 0 3px",
                    height: "1.5rem",
                    width: "1.5rem",
                }
            },

            "& > div.description": {
                padding: "0.5rem",
                background: "repeating-linear-gradient(#444D 0, #222D 5px, #444D 10px)",
                fontSize: "0.8rem",
                textAlign: "center",
                fontStyle: "italic",
                color: "#FFFE",
            },

            "& > div.data": {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
                // padding: "0.25rem",


                "& > span": {
                    flex: "1 1 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    
                    
                    padding: "0.25rem",

                    borderRight: "solid 1px #0008",
                    color: "#000D",
                    

                    "& > svg": {
                        marginRight: "0.25rem",
                    },
                    "&:last-child": {
                        borderRight: "none",
                    }
                }
            },
            "&.clickable": {
                "&:hover": {
                    background: "#999",
                    cursor: "pointer",
                }
            },
            "&.selected": {
                background: "#486",
                "&.clickable:hover":{
                    background: "#6A8",
                }
            }
            
            
        }
    })
);

interface ShipInfoProps {
    ship: OldShip;
    className?: string;
    onClick?: (ship: OldShip) => void;
    selected?: boolean;
}

const ShipInfo: FC<ShipInfoProps> = (props) => {
    const classes = useStyles();
    
    function handleClick() {
        if(props.onClick) {
            props.onClick(props.ship);
        }
    }

    return (
        <div className={`${classes.root}${props.onClick ? " clickable": ""}${props.selected ? " selected": ""} ${props.className}`} onClick={handleClick}>
            <h3>{props.ship.name}</h3>

            <div className="corner">
                {props.ship.minIndustry} <IconIndustry size="lg" />
                {props.ship.cost} <IconCredit size="lg" />
            </div>
            {props.ship.description && <div className="description">
                {props.ship.description}
            </div>}

            <div className="data">

                <span><SecurityIcon />{props.ship.hull}</span>
                <span><StarIcon />{props.ship.weapons}</span>

                <span><SpeedIcon />{props.ship.speed}</span>

            </div>

        </div>
    );
}

export default ShipInfo;
