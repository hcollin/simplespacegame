import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { ShipUnit } from "../models/Units";
import { getFactionById } from "../utils/factionUtils";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: "0.5rem 0",
            fontWeight: "normal",
            userSelect: "none",
            "&.selected": {
                fontWeight: "bold",
                color: "green",
            }
        }
    }));

interface UnitInfoProps {
    unit: ShipUnit;
    onClick?: (unit: ShipUnit) => void;
    selected?: boolean;
    className?: string;
}


const UnitInfo: FC<UnitInfoProps> = (props: UnitInfoProps) => {
    const classes = useStyles();
    const faction = getFactionById(props.unit.factionId);

    function click() {
        if (props.onClick) {
            props.onClick(props.unit);
        }
    }

    return (
        <div onClick={click} className={`${classes.root}${props.selected ? " selected": ""} ${props.className || ""}`}>
            <h3>
                {props.unit.name} <small>({faction.name})</small>
            </h3>
        </div>
    );
};

export default UnitInfo;
