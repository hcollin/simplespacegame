import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";

import React, { FC, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import useUnitSelection from "../hooks/useUnitSelection";
import useUnitsInSelectedSystem from "../hooks/useUnitsInSelectedSystem";
import { SystemModel, UnitModel } from "../models/Models";
import { moveUnits } from "../services/commands/UnitCommands";
import { unitIsMoving } from "../services/helpers/UnitHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { inSameLocation } from "../utils/locationUtils";
import UnitInfo from "./UnitInfo";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: "6rem",
            left: "1rem",
            background: "#FFFD",
            border: "solid 2px #0008",

            color: "black",

            "& h4": {
                padding: "1rem 1rem 0 1rem",
                margin: 0,
            },
            "& h2": {
                padding: "0 1rem",
                margin: 0,
            },

            "& div.units": {
                margin: "0.5rem 0",
                "& > div": {
                    padding: "3px 1rem",
                    borderBottom: "solid 1px #0003",
                    borderTop: "solid 1px #0001",
                    backgroundColor: "#4441",
                    "& h3": {
                        padding: 0,
                        margin: 0,
                    },
                    "&:nth-child(odd)": {
                        backgroundColor: "#6661",
                    },
                    "&.selected": {
                        backgroundColor: "#4842",
                    },

                    "&.removable": {
                        position: "relative",
                        "&:hover": {
                            cursor: "pointer",
                            background: "#8442",
                            "&:after": {
                                content: '"REMOVE FROM FLEET"',
                                color: "red",
                                fontSize: "1.4rem",
                                fontWeight: "bold",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textShadow: "2px 2px 1px #000, -2px 2px 1px #000, -2px -2px 1px #000, 2px -2px 1px #000",
                            }
                        }
                    }
                }
            },

            "& div.actions": {
                background: "#0004",
                borderTop: "solid 2px #0008",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "1rem",
            },
        }
    }));

const FleetView: FC = () => {
    const classes = useStyles();

    const faction = useCurrentFaction();
    const [fleet, fleetActions] = useUnitSelection();
    const units = useUnitsInSelectedSystem();
    const [star, setStar] = useSelectedSystem();

    // If the fleet is not the current factions fleet, clear it
    // useEffect(() => {
    //     if (faction && fleet.length > 0) {
    //         if (fleet[0].factionId !== faction.id) {
    //             fleetActions.clr();
    //         }
    //     }
    // }, [faction, fleet, fleetActions]);


    // const canMove = star && fleet.length > 0 && !inSameLocation(fleet[0].location, star.location);
    const filteredUnits = units.filter((u: UnitModel) => !unitIsMoving(u));
    const canCreateFleet = faction && star && fleet.length === 0 && filteredUnits.length > 0 && filteredUnits[0].factionId === faction.id;

    if (fleet.length === 0 && !canCreateFleet) return null;

    let viewMode = "VIEW";
    if (fleet.length > 0 && faction && fleet[0].factionId === faction.id && !unitIsMoving(fleet[0])) viewMode = "MOVE";
    if (canCreateFleet) viewMode = "CREATE";



    function close() {
        fleetActions.clr();
        setStar(null);
    }

    console.log("VIEWMODE", viewMode);

    return (
        <div className={classes.root}>
            {viewMode === "CREATE" && <CreateFleetContent units={units} system={star} close={close} />}
            {viewMode === "MOVE" && <MoveFleetContent units={fleet} system={star} close={close} />}
            {viewMode === "VIEW" && <ViewFleetContent units={fleet} system={null} close={close} />}
            {/* {canCreateFleet && <h2>Create fleet</h2>}
            {!canCreateFleet && <h2>Move fleet</h2>}
            
            
            {fleet.map((unit: UnitModel) => {
                return <UnitInfo unit={unit} key={unit.id} />
            })}

            {fleet.length === 0 && canCreateFleet && units.map((unit: UnitModel) => {
                return <UnitInfo unit={unit} key={unit.id} />
            })}

            {canMove && star && <p>Moving to {star.name}</p>}
            
            {fleet.length > 0 && <>
                <Button variant="contained" color="secondary" onClick={() => fleetActions.clr()}>Cancel fleet</Button>
                {canMove && <Button variant="contained" color="primary">Move fleet</Button>}
            </>}

            {canCreateFleet && <>
                <Button variant="contained" color="primary" onClick={() => fleetActions.clr()}>Create fleet</Button>
            </>} */}

        </div>
    )
}

interface ContentProps {
    units: UnitModel[];
    system: SystemModel | null;
    close: () => void;

}

const ViewFleetContent: FC<ContentProps> = (props) => {


    return (
        <>
            <h4>Fleet</h4>

            <div className="units">
                {props.units.map((unit: UnitModel) => {

                    const moving = unitIsMoving(unit);
                    if (moving) {
                        return null;
                    }

                    return <UnitInfo unit={unit} key={unit.id} />
                })}
            </div>

            <div className="actions">
                <Button variant="contained" color="primary" onClick={() => props.close()}>Close</Button>
            </div>
        </>
    )

}

const CreateFleetContent: FC<ContentProps> = (props) => {

    const [funits, setFunits] = useState<Set<UnitModel>>(new Set<UnitModel>());
    const fl = useUnitSelection();

    const fleetActions = fl[1];

    function toggleUnit(u: UnitModel) {
        if (funits.has(u)) {
            setFunits((prev: Set<UnitModel>) => {
                prev.delete(u);
                return new Set(prev);
            })
        } else {
            setFunits((prev: Set<UnitModel>) => {
                prev.add(u);
                return new Set(prev);
            })
        }
    }

    function createFleet() {

        if (funits.size > 0) {
            fleetActions.set(Array.from(funits));
        } else {
            fleetActions.set(props.units);
        }

    }

    return (
        <>
            <h4>Create fleet</h4>
            {props.system && <h2>{props.system.name}</h2>}

            <div className="units">
                {props.units.map((unit: UnitModel) => {

                    const moving = unitIsMoving(unit);
                    if (moving) {
                        return null;
                    }

                    return <UnitInfo unit={unit} key={unit.id} onClick={() => toggleUnit(unit)} selected={funits.has(unit)} />
                })}
            </div>

            <div className="actions">
                <Button variant="contained" color="primary" onClick={createFleet}>Create</Button>
            </div>
        </>
    )

}


const MoveFleetContent: FC<ContentProps> = (props) => {

    const [fleet, fleetActions] = useUnitSelection();

    if (fleet.length === 0) return null;

    function removeUnit(unit: UnitModel) {
        fleetActions.rem(unit.id);
    }

    const canMove = props.system && fleet.length > 0 && !inSameLocation(props.system.location, fleet[0].location);

    function moveFleet() {
        if (props.system && canMove) {
            moveUnits(fleet, props.system.location);
            props.close();
        }
    }



    return (
        <>
            <h2>Move fleet</h2>
            {props.system && <h4>{props.system.name}</h4>}

            <div className="units">
                {fleet.map((unit: UnitModel) => {
                    return (<UnitInfo unit={unit} key={unit.id} onClick={removeUnit} className="removable" />);
                })}
            </div>



            <div className="actions">
                <Button variant="outlined" color="secondary" onClick={() => fleetActions.clr()}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={moveFleet} disabled={!canMove}>Move</Button>
            </div>
        </>
    )

}



export default FleetView;