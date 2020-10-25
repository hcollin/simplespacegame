import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { plusEconomy, plusWelfare, plusIndustry, plusDefense, buildUnit } from "../services/commands/SystemCommands";

import BuildIcon from "@material-ui/icons/Build";
import SecurityIcon from "@material-ui/icons/Security";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import useMyCommands from "../hooks/useMyCommands";
import { BuildUnitCommand, Command, CommandType, FleetCommand, SystemPlusCommand } from "../models/Commands";
import useUnitsInSelectedSystem from "../hooks/useUnitsInSelectedSystem";
import { Ship, UnitModel } from "../models/Models";
import UnitInfo from "./UnitInfo";
import useUnitSelection from "../hooks/useUnitSelection";
import { inSameLocation } from "../utils/locationUtils";
import { moveUnits } from "../services/commands/UnitCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getFactionShips } from "../services/helpers/FactionHelpers";
import useUserIsReady from "../services/hooks/useUserIsReady";
import DATASHIPS from "../data/dataShips";
import ShipInfo from "./ShipInfo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "1rem",
        },
        value: {
            width: "15rem",

            padding: "0.5rem 0.5rem 0.5rem 0.5rem",
            fontSize: "1.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            // "border": "solid 1px black",
            // "borderRadius": "1rem",
            fontWeight: "bold",
            "& > button": {
                fontSize: "1.4rem",
                padding: 0,
            },
            "& > p": {
                margin: 0,
                padding: 0,
                fontSize: "1rem",
            },
        },
    })
);

const SystemInfo: FC = () => {
    const classes = useStyles();
    const [star] = useSelectedSystem();
    const comms = useMyCommands();
    const units = useUnitsInSelectedSystem();
    const [user] = useCurrentUser();
    const faction = useCurrentFaction();
    const userIsReady = useUserIsReady();
    const [selectedUnits, setSelectedUnits] = useState<UnitModel[]>([]);
    const [fleet, fleetActions] = useUnitSelection();

    if (star === null || !user) return null;

    function selectUnit(unit: UnitModel) {
        console.log(unit.id, faction);
        if (unit && faction && unit.factionId === faction.id) {
            const isSelected = selectedUnits.find((um: UnitModel) => um.id === unit.id) !== undefined;
            console.log("Select Unit", unit, isSelected);
            if (isSelected) {
                setSelectedUnits((prev: UnitModel[]) => prev.filter((um: UnitModel) => um.id !== unit.id));
            } else {
                setSelectedUnits((prev: UnitModel[]) => {
                    const n = [...prev];
                    n.push(unit);
                    return n;
                })
            }
        }
    }

    function setFleet() {
        fleetActions.set([...selectedUnits]);
        setSelectedUnits([]);
    }

    function cancelFleet() {
        fleetActions.clr();
    }

    function moveFleet() {
        if (star && fleet.length > 0) {
            moveUnits(fleet, star.location);
            fleetActions.clr();
        }
    }

    
    const comPlusInd = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemIndustry && cs.targetSystem === star.id;
    }).length;
    const comPlusEco = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemEconomy && cs.targetSystem === star.id;
    }).length;
    const comPlusWlf = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemWelfare && cs.targetSystem === star.id;
    }).length;
    const comPlusDef = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemDefense && cs.targetSystem === star.id;
    }).length;

    const isMine = faction && faction.id === star.ownerFactionId;

    const shipsUnderConstruction: Ship[] = comms.reduce((ships: Ship[], command: Command) => {

        if(command.type === CommandType.SystemBuild){
            const cmd = command as BuildUnitCommand;
            if(inSameLocation(cmd.target, star.location)) {
                const ship = DATASHIPS.find((s: Ship) => s.name === cmd.shipName);
                if(ship) {
                    ships.push(ship);
                }
            }
        }

        return ships;
    }, []);


    const unitsInFleet = comms.reduce((unitIds: string[], command: Command) => {

        if(command.type === CommandType.FleetMove) {
            const cmd = command as FleetCommand;
            unitIds = [...unitIds, ...cmd.unitIds];
        }

        return unitIds;
    }, [])

    return (
        <div className={classes.root}>
            <h1>{star.name}</h1>

            <div className={classes.value}>
                <BuildIcon />
                {star.industry}
                {isMine && !userIsReady && <Button variant="contained" color="primary" onClick={() => plusIndustry(star.id)}>
                    +
                </Button>}
                {comPlusInd > 0 && <p>+{comPlusInd}</p>}
            </div>
            <div className={classes.value}>
                <MonetizationOnIcon /> {star.economy}
                {isMine && !userIsReady && <Button variant="contained" color="primary" onClick={() => plusEconomy(star.id)}>
                    +
                </Button>}
                {comPlusEco > 0 && <p>+{comPlusEco}</p>}
            </div>
            <div className={classes.value}>
                <SecurityIcon /> {star.defense}
                {isMine && !userIsReady && star.defense < star.industry && <Button variant="contained" color="primary" onClick={() => plusDefense(star.id)}>
                    +
                </Button>}
                {comPlusDef > 0 && <p>+{comPlusDef}</p>}
            </div>
            <div className={classes.value}>
                <PeopleAltIcon /> {star.welfare}
                {isMine && !userIsReady && <Button variant="contained" color="primary" onClick={() => plusWelfare(star.id)}>
                    +
                </Button>}
                {comPlusWlf > 0 && <p>+{comPlusWlf}</p>}
            </div>

            <h2>Units</h2>

            {units.map((u: UnitModel) => {
                const isSelected = selectedUnits.find((um: UnitModel) => um.id === u.id);
                
                if(unitsInFleet.includes(u.id)) {
                    return null;
                }
                return (
                    <UnitInfo key={u.id} unit={u} onClick={selectUnit} selected={isSelected !== undefined} />
                );
            })}

            {shipsUnderConstruction.map((s: Ship, ind: number) => {
                return (
                    <div key={`ship-${ind}`} className="shipUnderConstruction">
                        Buidling: <ShipInfo ship={s} key={`ship${ind}`} />
                    </div>
                )
            })}





            {selectedUnits.length > 0 && fleet.length === 0 && !userIsReady && <Button variant="contained" color="primary" onClick={setFleet}>Move Selected Units</Button>}
            {fleet.length > 0 && inSameLocation(fleet[0].location, star.location) && !userIsReady && <Button variant="contained" color="secondary" onClick={cancelFleet}>Cancel Fleet</Button>}
            {fleet.length > 0 && !inSameLocation(fleet[0].location, star.location) && !userIsReady && <Button variant="contained" color="primary" onClick={moveFleet}>Move Fleet Here</Button>}


            <h3>Build Ships</h3>

            {faction && getFactionShips(faction.id).map((ship: Ship) => {


                const canAfford = faction.money >= ship.cost;
                const enoughIndustry = star.industry >= ship.minIndustry;                
                const canBuild = canAfford && enoughIndustry && isMine && !userIsReady;

                return (
                    <Button key={`ship-${ship.name}`} variant="contained" color="primary" disabled={!canBuild} onClick={() => buildUnit(ship, star.location)}>{ship.name}</Button>
                )


            })}

        </div>
    );
};

export default SystemInfo;
