import { Button, ButtonGroup, createStyles, makeStyles, Theme } from "@material-ui/core";
import { ViewList, ViewComfy } from "@material-ui/icons";
import { useService } from "jokits-react";
import React, { FC, useState } from "react";
import CancelCommandButton from "../../components/buttons/CancelCommandButton";
import DataTable, { ColumnProps } from "../../components/DataTable";
import { IconCredit } from "../../components/Icons";
import MiniUnitInfo from "../../components/MiniUnitInfo";
import useMyCommands from "../../hooks/useMyCommands";
import { CommandType, FleetCommand, UnitScrapCommand } from "../../models/Commands";
import { GameModel } from "../../models/Models";
import { ShipUnit } from "../../models/Units";
import { doDisbandUnit, doRecycleUnit } from "../../services/commands/UnitCommands";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { SERVICEID } from "../../services/services";
import { getSystemByCoordinates } from "../../utils/systemUtils";
import { getShipMaintenance, unitIsAlreadyInCommand, getFleetInfo, getRecycleProfit } from "../../utils/unitUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        unitList: {
            display: "flex",
            // flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",

            "& > div": {
                flex: "0 0 auto",
                // width: "45rem",
                margin: "0.5rem",
            },
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                "& > div": {
                    width: "auto",
                },
            },
            [theme.breakpoints.up("md")]: {
                flexDirection: "row",
                "& > div": {
                    width: "45rem",
                },
            },
        },
        subHeader: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
    })
);

const ShipsView: FC = () => {
    const classes = useStyles();
    const [game] = useService<GameModel>(SERVICEID.GameService);
    const faction = useCurrentFaction();
    const [comms] = useMyCommands();
    const [viewStyle, setViewStyle] = useState<"LIST" | "GRID">("LIST");

    if (!game || !faction) return null;

    const myUnits = game.units.filter((u: ShipUnit) => u.factionId === faction.id);

    const columns: ColumnProps[] = [
        {
            key: "name",
            header: "Name",
            size: "auto",
        },
        {
            key: "typeClassName",
            header: "Ship Class",
            size: 200,
        },
        {
            key: "hull",
            header: "Hull",
            size: 120,
            className: "center",
            fn: (s: ShipUnit) => {
                return `${s.damage} / ${s.hull}`;
            },
        },
        {
            key: "armor",
            header: "Armor",
            size: 40,
            className: "center",
        },
        {
            key: "shields",
            header: "Shields",
            size: 60,
            className: "center",
            fn: (s: ShipUnit) => {
                return `${s.shields} (+${s.shieldRegeneration})`;
            },
        },
        {
            key: "cost",
            header: "Upkeep",
            size: 70,
            className: "center",
            fn: (s: ShipUnit) => {
                return (
                    <span>
                        <IconCredit /> {getShipMaintenance(s, faction)}
                    </span>
                );
            },
        },
        {
            key: "troops",
            header: "Troops",
            size: 40,
            className: "center",
        },
        {
            key: "fighters",
            header: "Fighters",
            size: 80,
            className: "center",
            fn: (s: ShipUnit) => {
                return `${s.fighters} /  ${s.fightersMax}`;
            },
        },
        {
            key: "location",
            header: "Location",
            size: 120,
            fn: (s: ShipUnit) => {
                const system = getSystemByCoordinates(game, s.location);
                if (system) {
                    return system.name;
                }
                return `${s.location.x}, ${s.location.y}`;
            },
        },
        {
            key: "id",
            header: "Command",
            size: "auto",
            fn: (s: ShipUnit) => {
                const inCommand = unitIsAlreadyInCommand(s, comms);
                if (inCommand) {
                    switch (inCommand.type) {
                        case CommandType.FleetMove:
                            const mvCmd = inCommand as FleetCommand;
                            const targetSystem = getSystemByCoordinates(game, mvCmd.target);
                            if (targetSystem) {
                                const units = game.units.filter((u: ShipUnit) => mvCmd.unitIds.includes(u.id));
                                const fleetInfo = getFleetInfo(game, units, targetSystem);
                                if (mvCmd.turn === game.turn) {
                                    return (
                                        <span>
                                            Moving to {targetSystem.name} (eta {fleetInfo.turns} turns).{" "}
                                            <CancelCommandButton command={inCommand} />
                                        </span>
                                    );
                                }
                                return (
                                    <span>
                                        Moving to {targetSystem.name} (eta {fleetInfo.turns} turns).
                                    </span>
                                );
                            }
                            return "Moving to unknown location";
                        case CommandType.UnitScrap:
                            const scrCmd = inCommand as UnitScrapCommand;
                            if (scrCmd.recycle) {
                                return (
                                    <span>
                                        Unit will be recycled for <IconCredit />
                                        {getRecycleProfit(s)}. <CancelCommandButton command={inCommand} />{" "}
                                    </span>
                                );
                            }
                            return (
                                <span>
                                    Unit will be disbanded. <CancelCommandButton command={inCommand} />
                                </span>
                            );
                        default:
                            return "Unknown command";
                    }
                }
                const system = getSystemByCoordinates(game, s.location);
                const recyclable = system !== undefined ? system.ownerFactionId === s.factionId : false;
                return (
                    <span>
                        <Button variant="contained" color="secondary" onClick={() => doDisbandUnit(s.id)}>
                            Disband
                        </Button>
                        {recyclable && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => doRecycleUnit(s.id)}
                                style={{ marginLeft: "0.5rem" }}
                            >
                                Recycle for <IconCredit /> {getRecycleProfit(s)}
                            </Button>
                        )}
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <header className={classes.subHeader}>
                <h2>Ships</h2>
                <ButtonGroup>
                    <Button
                        variant="contained"
                        color={viewStyle === "LIST" ? "primary" : "default"}
                        onClick={() => setViewStyle("LIST")}
                    >
                        <ViewList />
                    </Button>
                    <Button
                        variant="contained"
                        color={viewStyle === "GRID" ? "primary" : "default"}
                        onClick={() => setViewStyle("GRID")}
                    >
                        <ViewComfy />
                    </Button>
                </ButtonGroup>
            </header>

            {viewStyle === "GRID" && (
                <div className={classes.unitList}>
                    {myUnits.map((ship: ShipUnit) => {
                        return <MiniUnitInfo unit={ship} key={ship.id} />;
                    })}
                </div>
            )}
            {viewStyle === "LIST" && <DataTable columns={columns} rows={myUnits} />}
        </div>
    );
};

export default ShipsView;
