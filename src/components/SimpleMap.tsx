import React, { FC } from "react";
import { FactionModel } from "../models/Models";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
// import { inSameLocation } from "../utils/locationUtils";
import useSelectedSystem from "../hooks/useSelectedSystem";
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import { ShipUnit } from "../models/Units";
import { SystemModel } from "../models/StarSystem";

const size = window.innerHeight - 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "#000",
            position: "relative",
            margin: "1rem",
            "& > div.star": {
                position: "absolute",
                width: "0.5%",
                height: "0.5%",
                backgroundColor: "#FF0",
                borderRadius: "50%",
                "& > div.fleet": {
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "white",
                    position: "absolute",
                    top: "-0.3rem",
                    right: "-0.3rem",
                },
                "&.selected": {
                    border: "solid 1px white",
                    "&:before": {
                        content: '""',
                        position: "absolute",
                        width: "250%",
                        height: "250%",
                        top: "-100%",
                        left: "-100%",
                        border: "solid 2px white",
                        borderRadius: "50%",
                    },
                },
            },
            "& > div.info": {
                position: "absolute",
                top: 0,
                right: "-20rem",
                width: "20rem",
                height: "auto",
                backgroundColor: "#FFFD",
                padding: "1rem",
                "& >div.buttons": {
                    display: "flex",
                    flexDirection: "column",
                    "& > button": {
                        margin: "0.5rem",
                        padding: "0.25rem 0.5rem"
                    }
                }

            },
        },
        unit: {
            position: "absolute",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
            marginTop: "-0.75rem",
            padding: 0,

        }
    })
);

interface SimpleMapProps {
    systems: SystemModel[];
    factions: FactionModel[];
    units: ShipUnit[];
}

const SimpleMap: FC<SimpleMapProps> = (props: SimpleMapProps) => {
    const classes = useStyles();

    // const [selectedSystem, setSelectedSystem] = useState<null | SystemModel>(null);

    const [selectedSystem, setSelectedSystem] = useSelectedSystem();

    function select(star: SystemModel) {
        setSelectedSystem(star.id)
    }
    function deselect() {
        setSelectedSystem(null);
    }

    return (
        <div className={classes.root}>

            {props.units.map((um: ShipUnit) => {
                const style = {
                    top: `${um.location.y}%`,
                    left: `${um.location.x}%`,
                    // backgroundColor: ownerFaction ? ownerFaction.color : star.color,
                    // width: ownerFaction ? "1%" : "0.5%",
                    // height: ownerFaction ? "1%" : "0.5%",
                };
                return (
                    <div className={`${classes.unit}`} style={style} key={um.id}>
                        <AirplanemodeActiveIcon />
                    </div>
                )

            })}

            {props.systems.map((star: SystemModel) => {
                const ownerFaction = getFactionFromArrayById(props.factions, star.ownerFactionId);
                const style = {
                    top: `${star.location.y}%`,
                    left: `${star.location.x}%`,
                    backgroundColor: ownerFaction ? ownerFaction.color : star.color,
                    width: ownerFaction ? "1.25%" : "0.75%",
                    height: ownerFaction ? "1.25%" : "0.75%",
                };

                // const units = props.units.filter((u: ShipUnit) => inSameLocation(u.location, star.location));
                const isSelected = selectedSystem && selectedSystem.id === star.id;
                return (
                    <div
                        className={`star${isSelected ? " selected" : ""}`}
                        style={style}
                        onClick={() => isSelected ? deselect() : select(star)}
                        key={star.id}
                    >
                    </div>
                );
            })}




        </div>
    );
};

export default SimpleMap;
