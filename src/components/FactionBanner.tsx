import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { FactionModel } from "../models/Models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "0.5rem 0.75rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "auto",
            boxShadow: "inset 0 0 0.5rem 3px #0008",
            borderRadius: "0.5rem",
            "& > p" :{
                fontSize: "1.2rem",
                whiteSpace: "nowrap",
                color: "#FFFE",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                padding: 0,
                margin: 0,
                fontWeight: "normal",
            },
            "& > img": {
                height: "1.5rem",
                width: "1.5rem",
                marginRight: "0.5rem",
            },

            "&.sm": {
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
                "& > p": {
                    fontSize: "0.9rem",
                    
                },
                "& > img": {
                    height: "1rem",
                    width: "1rem",
                    marginRight: "0.25rem",
                }
            }
        },
    })
);

interface Props {
    faction: FactionModel;
    className?: string;
    size?: "sm"|"md"|"lg"
}

const FactionBanner: FC<Props> = (props) => {
    const classes = useStyles();
    const size = props.size || "md"
    return (
        <div className={`${classes.root} ${size} ${props.className || ""}`} style={{ background: props.faction.color }}>
            <img src={require(`../images/symbols/${props.faction.iconFileName}`)} alt={`faction ${props.faction.name} logo`} />
            <p style={{ fontFamily: props.faction.style.fontFamily || "Arial" }}>{props.faction.name}</p>
        </div>
    );
};

export default FactionBanner;
