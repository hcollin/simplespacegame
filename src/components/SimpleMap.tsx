import React, { FC, useState } from "react";
import { FactionModel, SystemModel, UnitModel } from "../models/Models";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { getFactionById } from "../services/helpers/FactionHelpers";
import { plusDefense, plusEconomy, plusIndustry, plusWelfare } from "../services/commands/SystemCommands";
import { inSameLocation } from "../utils/locationUtils";

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
                top: "5%",
                left: "5%",
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
    })
);

interface SimpleMapProps {
    systems: SystemModel[];
    factions: FactionModel[];
    units: UnitModel[];
}

const SimpleMap: FC<SimpleMapProps> = (props: SimpleMapProps) => {
    const classes = useStyles();

    const [selectedSystem, setSelectedSystem] = useState<null | SystemModel>(null);

    function select(star: SystemModel) {
        setSelectedSystem((prev: SystemModel | null) => {
            if (prev && prev.id === star.id) return null;
            return star;
        });
    }

    return (
        <div className={classes.root}>
            {props.systems.map((star: SystemModel) => {
                const ownerFaction = getFactionById(props.factions, star.ownerFactionId);
                const style = {
                    top: `${star.location.y}%`,
                    left: `${star.location.x}%`,
                    backgroundColor: ownerFaction ? ownerFaction.color : star.color,
                    width: ownerFaction ? "1%" : "0.5%",
                    height: ownerFaction ? "1%" : "0.5%",
                };
                
                const units = props.units.filter((u: UnitModel) => inSameLocation(u.location, star.location) );

                return (
                    <div
                        className={`star${selectedSystem && selectedSystem.id === star.id ? " selected" : ""}`}
                        style={style}
                        onClick={() => select(star)}
                        key={star.id}
                    >
                        {units.length > 0 && <div className="fleet">
                                F
                            </div>}

                    </div>
                );
            })}

            {selectedSystem && (
                <div className="info">
                    <h2>{selectedSystem.name}</h2>
                    <p>Industry: {selectedSystem.industry}</p>
                    <p>Economy: {selectedSystem.economy}</p>
                    <p>Defense: {selectedSystem.defense}</p>
                    <p>Welfare: {selectedSystem.welfare}</p>

                    <div className="buttons">
                        <Button variant="contained" color="primary" onClick={() => plusEconomy(selectedSystem.id)}>
                            Economy +
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => plusWelfare(selectedSystem.id)}>
                            Welfare +
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => plusIndustry(selectedSystem.id)}>
                            Industry +
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => plusDefense(selectedSystem.id)}>
                            Defense +
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleMap;
