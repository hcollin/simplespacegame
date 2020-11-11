import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { FactionModel } from "../models/Models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        faction: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            "& > div.block": {
                width: "2rem",
                height: "2rem",
                marginRight: "1rem",
                boxShadow: "inset 0 0 0.5rem 0.1rem #0008",
                padding: "0.25rem",
            },
            "& > h3": {
                fontSize: "1.8rem",
                fontWeight: "normal",
            },
            "&.lg": {
                "& > div.block": {
                    width: "4rem",
                    height: "4rem",
                    padding: "0.5rem",
                    boxShadow: "inset 0 0 1rem 0.3rem #0008",
                },
                "& > h3": {
                    fontSize: "3.5rem",
                },

            },
            "&.sm": {
                "& > div.block": {
                    width: "1.5rem",
                    height: "1.5rem",
                    padding: "0.1rem",
                    boxShadow: "inset 0 0 0.25rem 1px #0008",
                },
                "& > h3": {
                    fontSize: "1rem",
                },

            }
        },
    })
);

interface Props {
    faction: FactionModel;
    size?: "sm"|"md"|"lg";
}

const FactionBlock: FC<Props> = (props) => {
    const classes = useStyles();

    const size = props.size || "md";
    return (
        <div className={`${classes.faction} ${size}`}>
            <div className="block" style={{ backgroundColor: props.faction.color }}>
                <img src={require(`../images/symbols/${props.faction.iconFileName}`)} alt={props.faction.name} />
            </div>
            <h3 style={{ fontFamily: props.faction.style.fontFamily || "Arial" }}>{props.faction.name}</h3>
        </div>
    );
};

export default FactionBlock;
