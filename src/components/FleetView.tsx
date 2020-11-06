import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";

import React, { FC, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import useUnitSelection from "../hooks/useUnitSelection";
import useUnitsInSelectedSystem from "../hooks/useUnitsInSelectedSystem";
import { SystemModel } from "../models/Models";
import { ShipUnit } from "../models/Units";
import { moveUnits } from "../services/commands/UnitCommands";
import { unitIsMoving } from "../services/helpers/UnitHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { inSameLocation } from "../utils/locationUtils";
import UnitInfo from "./UnitInfo";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: "100px",
            left: "1rem",
            background:
                "repeating-linear-gradient(to bottom, #1118 0, #333E 5px, #444E 54px, #777E 67px, #555E 76px, #1118 80px)",
            color: "#FFFD",
            boxShadow: "inset 0 0 2rem 0.5rem #000",
            border: "ridge 3px #FFF5",
            "& > button.close": {
                top: "-1rem",
                right: "-1.75rem",
                width: "3rem",
                cursor: "pointer",
                height: "3rem",
                zIndex: "1200",
                position: "absolute",
                boxShadow: "0 0 0.5rem 0.1rem #0008, inset 0 0 0.5rem 0.25rem #FFF3",
                fontWeight: "bold",
                borderRadius: "1.5rem",
                background: "#210C",
                border: "ridge 3px #FFF8",
                fontSize: "1.6rem",
                color: "#FFFA",
                transition: "all 0.2s ease",
                padding: 0,
                margin: 0,
                "&:hover": {
                    backgroundColor: "#630C",
                    color: "#FFFD",
                },
            },
            "& h1, & h2, & h3, & h4": {
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
            },

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
                padding: "0 0.5rem",
               
                // "& > div": {
                //     padding: "3px 1rem",
                //     borderBottom: "solid 1px #0003",
                //     borderTop: "solid 1px #0001",
                //     backgroundColor: "#4441",
                //     "& h3": {
                //         padding: 0,
                //         margin: 0,
                //     },
                //     "&:nth-child(odd)": {
                //         backgroundColor: "#6661",
                //     },
                //     "&.selected": {
                //         backgroundColor: "#4842",
                //     },

                //     "&.removable": {
                //         position: "relative",
                //         "&:hover": {
                //             cursor: "pointer",
                //             background: "#8442",
                //             "&:after": {
                //                 content: '"REMOVE FROM FLEET"',
                //                 color: "red",
                //                 fontSize: "1.4rem",
                //                 fontWeight: "bold",
                //                 position: "absolute",
                //                 top: 0,
                //                 left: 0,
                //                 right: 0,
                //                 bottom: 0,
                //                 display: "flex",
                //                 alignItems: "center",
                //                 justifyContent: "center",
                //                 textShadow: "2px 2px 1px #000, -2px 2px 1px #000, -2px -2px 1px #000, 2px -2px 1px #000",
                //             }
                //         }
                //     }
                // }
            },

            "& div.actions": {
                // background: "linear-gradient(to bottom, #222 0, #444 10%, #666 20%, #444 25%, #555 80%, #3458 85%, #555 90%, #888 100%)",
                background: "linear-gradient(to bottom, #222 0, #444 10%, #666 20%, #444 25%, #555 80%,  #666 100%)",
                borderTop: "solid 2px #0008",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "2rem 1rem 1rem 1rem",
                boxShadow: "inset 0 0 1rem 0.5rem #0008",
                height: "6rem",
                marginTop: "1rem",
                
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
    const filteredUnits = units.filter((u: ShipUnit) => !unitIsMoving(u));
    const canCreateFleet = faction && star && fleet.length === 0 && filteredUnits.length > 0 && filteredUnits[0].factionId === faction.id;

    if (fleet.length === 0 && !canCreateFleet) return null;

    let viewMode = "VIEW";
    if (fleet.length > 0 && faction && fleet[0].factionId === faction.id && !unitIsMoving(fleet[0])) viewMode = "MOVE";
    if (canCreateFleet) viewMode = "CREATE";

    function close() {
        fleetActions.clr();
        setStar(null);
    }

    return (
        <div className={classes.root}>
            <button className="close" onClick={close}>X</button>
            

            {viewMode === "CREATE" && <CreateFleetContent units={units} system={star} close={close} />}
            {viewMode === "MOVE" && <MoveFleetContent units={fleet} system={star} close={close} />}
            {viewMode === "VIEW" && <ViewFleetContent units={fleet} system={null} close={close} />}
            {/* {canCreateFleet && <h2>Create fleet</h2>}
            {!canCreateFleet && <h2>Move fleet</h2>}
            
            
            {fleet.map((unit: ShipUnit) => {
                return <UnitInfo unit={unit} key={unit.id} />
            })}

            {fleet.length === 0 && canCreateFleet && units.map((unit: ShipUnit) => {
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
    units: ShipUnit[];
    system: SystemModel | null;
    close: () => void;

}

const ViewFleetContent: FC<ContentProps> = (props) => {


    return (
        <>
            <h4>Fleet</h4>

            <div className="units">
                {props.units.map((unit: ShipUnit) => {

                    const moving = unitIsMoving(unit);
                    if (moving) {
                        return null;
                    }

                    return <UnitInfo unit={unit} key={unit.id} />
                })}
            </div>

            {/* <div className="actions">
                <Button variant="contained" color="primary" onClick={() => props.close()}>Close</Button>
            </div> */}
        </>
    )

}

const CreateFleetContent: FC<ContentProps> = (props) => {

    const [funits, setFunits] = useState<Set<ShipUnit>>(new Set<ShipUnit>());
    const fl = useUnitSelection();

    const fleetActions = fl[1];

    function toggleUnit(u: ShipUnit) {
        if (funits.has(u)) {
            setFunits((prev: Set<ShipUnit>) => {
                prev.delete(u);
                return new Set(prev);
            })
        } else {
            setFunits((prev: Set<ShipUnit>) => {
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
                {props.units.map((unit: ShipUnit) => {

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

    function removeUnit(unit: ShipUnit) {
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
                {fleet.map((unit: ShipUnit) => {
                    return (<UnitInfo unit={unit} key={unit.id} onClick={removeUnit} className="removable" />);
                })}
            </div>



            <div className="actions">
                {/* <Button variant="outlined" color="secondary" onClick={() => fleetActions.clr()}>Cancel</Button> */}
                <Button variant="contained" color="primary" onClick={moveFleet} disabled={!canMove}>Move</Button>
            </div>
        </>
    )

}



export default FleetView;