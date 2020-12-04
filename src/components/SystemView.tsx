import React, { FC, useState } from "react";
import { makeStyles, Theme, createStyles, Button, Grid } from "@material-ui/core";
import { useService } from "jokits-react";

import useMyCommands from "../hooks/useMyCommands";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { GameModel } from "../models/Models";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { SERVICEID } from "../services/services";
import { getSystemEconomy, simulateCommandsEffectsForSystem } from "../utils/systemUtils";
import { IconCredit, IconDefense, IconEconomy, IconIndustry, IconResearchPoint, IconScore, IconWelfare } from "./Icons";
import {
    doBuildBuilding,
    doBuildUnit,
    doRemoveCommand,
    plusDefense,
    plusEconomy,
    plusIndustry,
    plusWelfare,
} from "../services/commands/SystemCommands";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { Building, BuildingDesign } from "../models/Buildings";
import BuildingDesignSlot from "./BuildingDesignSlot";
import { DATABUILDINGS } from "../data/dataBuildings";
import { buildingCanBeBuiltOnSystem, getBuildingUnderConstruction } from "../utils/buildingUtils";

import SpaceStationJpeg from "../images/art/SpaceStation.jpg";
import DATASHIPS from "../data/dataShips";
import { ShipDesign, ShipUnderConstruction } from "../models/Units";
import ShipInfo from "./ShipInfo";
import { shipCanBeBuiltOnSystemByFaction } from "../utils/unitUtils";
import useUnitSelection from "../hooks/useUnitSelection";
import FactionBanner from "./FactionBanner";
import BuildingSlot from "./BuildingSlot";
import { Planet, SystemModel } from "../models/StarSystem";
import { planetStyle } from "../utils/planetUtils";
import PlanetDiv from "./Planet";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: "1rem",
            right: "20rem",
            bottom: "1rem",
            width: "51rem",
            background:
                "linear-gradient(90deg, #000 0,#333 20px, #666 40px, #222 60px,#181820 calc(100% - 20px), #111 calc(100% - 10px), #000 100%)",
            zIndex: 1000,
            color: "#FFFA",
            boxShadow: "inset 0 0 8rem 2rem #000",
            borderRadius: "1rem",
            border: "groove 5px #FFF4",

            "&:after": {
                content: '""',
                userSelect: "none",
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: -1,
                background:
                    "repeating-linear-gradient(200deg, #000 0, #3338 5px, transparent 10px, #BDF1 120px, transparent 150px, #4448 155px, #000 160px)",
                borderRadius: "1rem",
            },
            "& > header": {
                position: "relative",
                // borderBottom: "solid 3px #0008",
                // padding: "0.5rem 1rem",
                // background: "linear-gradient(180deg, #000 0, #222D 5%, #333E 15%, #222 69%, #700A 71%, #222 73%, #222 78%, #800A 80%, #222 82%, #222 87%, #700A 89%, #222, 91%, #222D 95%, #000 100%)",

                "&:after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "linear-gradient(180deg, #000 0, #222 5%, #333 15%, #222 69%, #0009 71%, #222 73%, #222 78%, #0008 80%, #222 82%, #222 87%, #0009 89%, #222, 91%, #222 95%, #000 100%)",
                    zIndex: 0,
                },
                "& > * ": {
                    zIndex: 10,
                },
                "& > h1": {
                    margin: 0,
                    padding: "0.5rem 0",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },

                [theme.breakpoints.down("md")]: {
                    padding: "0.5rem 1rem 4rem 1rem",
                    "& > div.ofbanner": {
                        position: "absolute",
                        top: "4rem",
                        right: "auto",
                        left: "1rem",
                    },
                    "& > h1": {
                        fontSize: "1.1rem",
                    },
                },
                [theme.breakpoints.up("lg")]: {
                    padding: "0.5rem 1rem",
                    "& > div.ofbanner": {
                        position: "absolute",
                        top: "1.5rem",
                        right: "6rem",
                    },
                    "& > h1": {
                        fontSize: "2rem",
                    },
                },
            },
            [theme.breakpoints.down("md")]: {
                top: "4rem",
                left: "1rem",
                right: "4rem",
                bottom: "5rem",
                zIndex: "80",
                width: "auto",
            },
        },
        mainContent: {
            overflowY: "auto",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,

            [theme.breakpoints.down("md")]: {
                top: "7rem",
            },
            [theme.breakpoints.up("lg")]: {
                top: "5rem",
            },
        },
        flexRow: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        contentArea: {
            padding: "0.5rem",

            // background: "#0003",
            // boxShadow: "inset 0 0 2rem 1rem #0008",

            "& p": {
                "&.description": {
                    fontStyle: "italic",
                    textAlign: "center",
                    fontSize: "0.9rem",
                },
                "&.keywords": {
                    fontSize: "1.1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    background: "#0138",
                    padding: "0.5rem",
                    boxShadow: "inset 0 0 1rem 0.5rem #0008",
                },
            },

            "& div.inforow": {
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                background: "#1256",
                boxShadow: "inset 0 0 0.5rem 0.25rem #0008",
                border: "ridge 3px #FFF4",
                borderRadius: "0.5rem",
                "&> div": {
                    fontWeight: "bold",
                    borderRight: "solid 2px #0008",
                    padding: "0.5rem",
                    flex: "1 1 auto",
                    textAlign: "center",
                    borderLeft: "solid 1px #FFF2",
                    "&:last-child": {
                        borderRight: "none",
                    },
                    "&:first-child": {
                        borderLeft: "none",
                    },
                },
            },

            "& div.infra": {
                width: "17rem",
                border: "groove 3px #FFF3",
                display: "flex",
                padding: "0.5rem 1rem",
                background:
                    "linear-gradient(90deg, #0000, #666 0.5rem, #666 3.5rem, #DEF8 3.6rem, #013D 3.7rem, #0138 98%, #000 100%)",
                boxShadow: "inset 0 0 1rem 0.5rem #0008",
                alignItems: "center",
                borderRadius: "1rem",
                marginBottom: "0.5rem",
                flexDirection: "row",
                justifyContent: "space-between",
                "& > div.value": {
                    // fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#FFFA",
                    "& > span.plus": {
                        // fontSize: "1.4rem",
                        color: "#8F8A",
                    },
                    "& > small.maxValue": {
                        // fontSize: "1.2rem",
                        color: "#AAAA",
                        // marginLeft: "0.5rem",
                    },
                },
                "& > button": {
                    // fontSize: "2rem",
                    color: "#FFFA",
                    padding: 0,
                    margin: 0,
                },

                [theme.breakpoints.down("md")]: {
                    width: "auto",
                    "& > div.value": {
                        fontSize: "1.4rem",
                        "& > span.plus": {
                            fontSize: "1rem",
                        },
                        "& > small.maxValue": {
                            fontSize: "0.9rem",
                            marginLeft: "0.25rem",
                        },
                    },
                    "& > button": {
                        fontSize: "1.4rem",
                    },
                    "& > img": {
                        marginRight: "0.5rem",
                    },
                },
                [theme.breakpoints.up("lg")]: {
                    width: "17rem",
                    "& > div.value": {
                        fontSize: "2rem",
                        "& > span.plus": {
                            fontSize: "1.4rem",
                        },
                        "& > small.maxValue": {
                            fontSize: "1.2rem",
                            marginLeft: "0.5rem",
                        },
                    },
                    "& > button": {
                        fontSize: "2rem",
                    },
                    "& > img": {
                        marginRight: "1rem",
                    },
                },
            },
        },
        buildingSlot: {
            position: "relative",
            width: "15rem",
            height: "15rem",
            border: "ridge 3px #FFF4",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 1rem 0.5rem #000",
            background: "#0138",
            "& > button.fullSizeButton": {
                width: "100%",
                height: "100%",
                margin: 0,
                fontSize: "3rem",
                color: "#FFFA",
            },
            "& > p": {
                color: "#CDE8",
                fontSize: "0.8rem",
                textAlign: "center",
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: "bold",
            },
        },
        slots: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            "& > div": {
                margin: "0.5rem",
            },
        },
        shipDockSlot: {
            position: "relative",
            // width: "20rem",

            // height: "10rem",
            border: "ridge 3px #FFF4",
            // borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 1rem 0.5rem #000",
            background: `url(${SpaceStationJpeg})`,
            backgroundPosition: "50% 0%",
            backgroundSize: "cover",
            marginBottom: "0.75rem",
            flexDirection: "column",
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: "#0138",
            },
            "& > *": {
                zIndex: 10,
            },

            "& > button.fullSizeButton": {
                width: "100%",
                height: "100%",
                margin: 0,
                fontSize: "3rem",
                color: "#FFFA",
            },

            "&.building": {
                "& > p": {
                    color: "#CDE8",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    margin: 0,
                    "&.ready": {
                        color: "#FFFA",
                        fontSize: "0.7rem",
                    },
                },
                "& > h2": {
                    color: "#FFFC",
                    margin: "0.5rem 0",
                    padding: "0.25rem",
                    background: "#FFF4",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "inset 0 0 1rem 0.1rem #0138",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },
                "& > label": {
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    color: "#FFF8",
                    fontWeight: "bold",
                    margin: "0",
                    padding: "0",
                },

                "&.cancellable:hover": {
                    border: "ridge 3px #F888",
                    "&:after": {
                        content: '"CANCEL"',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 20,
                        background: "#800A",
                        color: "white",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    },
                },
            },
            [theme.breakpoints.down("md")]: {
                width: "auto",
                height: "auto",
                borderRadius: "0.5rem",
            },
            [theme.breakpoints.up("lg")]: {
                width: "20rem",
                height: "10rem",
                borderRadius: "0.5rem",
            },
        },
        rows: {
            display: "flex",
            flexDirection: "column",
            "& > div": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "ridge 3px #000A",
                borderTop: "solid 2px #4448",
                padding: "0.5rem 0",
                boxShadow: "inset 0 0 2.5rem 0.5rem #0008",
                "& div.notBuildable": {
                    filter: "grayscale(0.8)",
                    opacity: 0.5,
                },
            },
        },
        planets: {
            height: "8rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

            "& > div.planet-container": {
                position: "relative",
                margin: "0 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                "& > label": {
                    fontSize: "0.8rem",
                    textAlign: "center",
                    marginTop: "0.5rem",
                },
            },
        },
    })
);

const SystemView: FC = () => {
    const classes = useStyles();

    const [star, setStar] = useSelectedSystem();
    const [comms] = useMyCommands();
    // const [user] = useCurrentUser();
    const [game] = useService<GameModel>(SERVICEID.GameService);
    const faction = useCurrentFaction();
    const [fleet] = useUnitSelection();
    // const userIsReady = useUserIsReady();

    const [buildingView, setBuildingView] = useState<string>("");

    if (!star || !game || !faction) {
        return null;
    }

    // If there is an open fleet, do not open System View
    if (fleet.length > 0) return null;

    function close() {
        if (buildingView === "") {
            setStar(null);
        } else {
            setBuildingView("");
        }
    }

    function buildBuilding(buildingDesign: BuildingDesign) {
        if (star && faction) {
            if (buildingCanBeBuiltOnSystem(buildingDesign, star, faction)) {
                doBuildBuilding(star.id, buildingDesign.type);

                setBuildingView("");
            }
        }
    }

    // function cancelBuildBuildingCommand(building: BuildingUnderConstruction) {}

    function buildUnit(shipD: ShipDesign, system: SystemModel) {
        doBuildUnit(shipD, system.id);
        setBuildingView("");
    }

    function cancelConstruction(ship: ShipDesign) {
        const cmd = comms.find((command: Command) => {
            if (command.type === CommandType.SystemBuildUnit && star) {
                const cmd = command as BuildUnitCommand;
                if (cmd.targetSystem === star.id && cmd.shipName === ship.name) {
                    return true;
                }
            }
            return false;
        });
        if (cmd) {
            doRemoveCommand(cmd.id);
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

    const sysEco = getSystemEconomy(star, game);

    const ownerFaction = getFactionFromArrayById(game.factions, star.ownerFactionId);
    const bgColor = ownerFaction ? ownerFaction.color : star.color;

    const mySystem = star.ownerFactionId === faction.id;

    const bSlots: (Building | null)[] = [...star.buildings];

    const buildingUnderConstruction = getBuildingUnderConstruction(comms || [], star, game);

    if (buildingUnderConstruction === null) {
        while (bSlots.length < sysEco.buildingSlots) {
            bSlots.push(null);
        }
    }

    const shipsUnderConstruction: ShipUnderConstruction[] = comms.reduce(
        (ships: ShipUnderConstruction[], command: Command) => {
            if (command.type === CommandType.SystemBuildUnit) {
                const cmd = command as BuildUnitCommand;
                if (cmd.targetSystem === star.id) {
                    const ship = DATASHIPS.find((s: ShipDesign) => s.name === cmd.shipName);
                    if (ship) {
                        const shipUC: ShipUnderConstruction = {
                            ...ship,
                            timeLeft: cmd.turnsLeft,
                            cmdId: cmd.id,
                            cancellable: cmd.turn === game.turn,
                        };
                        ships.push(shipUC);
                    }
                }
            }

            return ships;
        },
        []
    );

    const freeShipYardSlots = sysEco.shipyards - shipsUnderConstruction.length;
    const nextTurnStar = simulateCommandsEffectsForSystem(game, faction.id, star, comms);

    return (
        <div className={classes.root}>
            <header className={`${classes.flexRow}`} style={{ background: `${bgColor}` }}>
                {ownerFaction && <FactionBanner faction={ownerFaction} className="ofbanner" size="sm" />}
                <h1 style={{ color: bgColor }}>{star.name}</h1>
                <Button variant="contained" color="secondary" onClick={close}>
                    X{" "}
                </Button>
            </header>

            {buildingView === "" && (
                <div className={classes.mainContent}>
                    <Grid container>
                        <Grid item lg={12} className={classes.contentArea}>
                            <p className="description">{star.description}</p>
                            <Planets star={star} />
                            {star.keywords.length > 0 && <p className="keywords">{star.keywords.join(", ")}</p>}
                        </Grid>

                        <Grid item sm={12} lg={6} className={classes.contentArea}>
                            <h4>Current Values</h4>
                            <div className="inforow">
                                <div>
                                    <IconCredit /> {sysEco.profit} = {sysEco.income} - {sysEco.expenses}
                                </div>
                                <div>
                                    <IconResearchPoint /> {sysEco.research}
                                </div>
                                <div>
                                    <IconScore /> {sysEco.vps}
                                </div>
                                <div>
                                    <IconDefense /> {sysEco.totalDefense}
                                </div>
                            </div>
                        </Grid>

                        <Grid item sm={12} lg={6} className={classes.contentArea}>
                            <h4>Estimate for future</h4>
                            <div className="inforow">
                                <div>
                                    <IconCredit /> {nextTurnStar.profit} = {nextTurnStar.income} -{" "}
                                    {nextTurnStar.expenses}
                                </div>
                                <div>
                                    <IconResearchPoint /> {nextTurnStar.research}
                                </div>
                                <div>
                                    <IconScore /> {nextTurnStar.vps}
                                </div>
                                <div>
                                    <IconDefense /> {nextTurnStar.totalDefense}
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12} lg={5} className={classes.contentArea}>
                            <h2>Infrastructure</h2>

                            <div className="infra">
                                <IconIndustry size="lg" />

                                <div className="value">
                                    {star.industry}
                                    {comPlusInd > 0 && <span className="plus">+{comPlusInd}</span>}
                                    <small className="maxValue"> / {sysEco.industryMax}</small>
                                </div>

                                {mySystem && (
                                    <Button
                                        // variant="contained"
                                        // color="primary"
                                        onClick={() => plusIndustry(star)}
                                        disabled={star.industry + comPlusInd >= sysEco.industryMax}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>

                            <div className="infra">
                                <IconEconomy size="lg" />

                                <div className="value">
                                    {star.economy}
                                    {comPlusEco > 0 && <span className="plus">+{comPlusEco}</span>}
                                    <small className="maxValue"> / {sysEco.economyMax}</small>
                                </div>

                                {mySystem && (
                                    <Button
                                        // variant="contained"
                                        // color="primary"
                                        onClick={() => plusEconomy(star)}
                                        disabled={star.economy + comPlusEco >= sysEco.economyMax}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>

                            <div className="infra">
                                <IconDefense size="lg" />

                                <div className="value">
                                    {star.defense}
                                    {comPlusDef > 0 && <span className="plus">+{comPlusDef}</span>}
                                    <small className="maxValue"> / {sysEco.defenseMax}</small>
                                </div>

                                {mySystem && (
                                    <Button
                                        // variant="contained"
                                        // color="primary"
                                        onClick={() => plusDefense(star)}
                                        disabled={star.defense + comPlusDef >= sysEco.defenseMax}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>

                            <div className="infra">
                                <IconWelfare size="lg" />

                                <div className="value">
                                    {star.welfare}
                                    {comPlusWlf > 0 && <span className="plus">+{comPlusWlf}</span>}
                                    <small className="maxValue"> / {sysEco.welfareMax}</small>
                                </div>

                                {mySystem && (
                                    <Button
                                        // variant="outlined"
                                        // color="primary"
                                        onClick={() => plusWelfare(star)}
                                        disabled={star.welfare + comPlusWlf >= sysEco.welfareMax}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={12} lg={7} className={classes.contentArea}>
                            <h2>Ship Dock</h2>

                            {mySystem &&
                                shipsUnderConstruction.map((ship: ShipUnderConstruction, ind: number) => {
                                    if (ship.cancellable === false) {
                                        return (
                                            <div className={`${classes.shipDockSlot} building`}>
                                                <label>building</label>
                                                <h2>{ship.type}</h2>
                                                <p className="ready">Ready in {ship.timeLeft} turn(s)</p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            className={`${classes.shipDockSlot} building cancellable`}
                                            onClick={() => cancelConstruction(ship)}
                                        >
                                            <label>building</label>
                                            <h2>{ship.type}</h2>
                                            <p className="ready">Ready in {ship.timeLeft} turn(s)</p>
                                        </div>
                                    );
                                })}
                            {mySystem && freeShipYardSlots > 0 && (
                                <div className={classes.shipDockSlot}>
                                    <Button className="fullSizeButton" onClick={() => setBuildingView("ships")}>
                                        +
                                    </Button>
                                </div>
                            )}
                            {mySystem && freeShipYardSlots > 1 && (
                                <div className={classes.shipDockSlot}>
                                    <Button className="fullSizeButton" onClick={() => setBuildingView("ships")}>
                                        +
                                    </Button>
                                </div>
                            )}
                            {!mySystem && (
                                <div className={classes.shipDockSlot}>
                                    <p>Shipyard slot</p>
                                </div>
                            )}
                        </Grid>

                        <Grid item xs={12} lg={12} className={classes.contentArea}>
                            <h2>Buildings</h2>

                            <div className={classes.slots}>
                                {buildingUnderConstruction && buildingUnderConstruction.cancellable && (
                                    <BuildingDesignSlot
                                        building={buildingUnderConstruction}
                                        underConstruction={buildingUnderConstruction.buildTime}
                                        onClick={() => doRemoveCommand(buildingUnderConstruction.cmdId)}
                                    />
                                )}
                                {buildingUnderConstruction && !buildingUnderConstruction.cancellable && (
                                    <BuildingDesignSlot
                                        building={buildingUnderConstruction}
                                        underConstruction={buildingUnderConstruction.turnsLeft}
                                    />
                                )}
                                {bSlots.map((slot: Building | null, index: number) => {
                                    if (slot === null) {
                                        return (
                                            <div className={classes.buildingSlot} key={`bslot-${index}`}>
                                                {!mySystem && <p>Building slot</p>}
                                                {mySystem && (
                                                    <Button
                                                        className="fullSizeButton"
                                                        onClick={() => setBuildingView("building")}
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    }

                                    return <BuildingDesignSlot building={slot} />;
                                })}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )}

            {buildingView === "building" && (
                <div className={classes.mainContent}>
                    <Grid container>
                        <Grid xs={12} className={classes.contentArea}>
                            <h2>Select building</h2>

                            <div className={classes.slots}>
                                {DATABUILDINGS.map((bd: BuildingDesign, ind: number) => {
                                    const buildable = buildingCanBeBuiltOnSystem(bd, star, faction);

                                    return (
                                        <BuildingDesignSlot
                                            building={bd}
                                            key={`bd-${ind}`}
                                            onClick={() => buildBuilding(bd)}
                                            disabled={!buildable}
                                        />
                                    );
                                })}
                            </div>
                        </Grid>

                        <Grid lg={12} className={classes.contentArea}>
                            <Button variant="contained" color="secondary" onClick={() => setBuildingView("")}>
                                Cancel building
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )}

            {buildingView === "ships" && (
                <div className={classes.mainContent}>
                    <Grid container>
                        <Grid xs={12} className={classes.contentArea}>
                            <h2>Select Ship</h2>
                        </Grid>

                        <Grid xs={12} className={classes.contentArea}>
                            <div className={classes.rows}>
                                {DATASHIPS.map((ship: ShipDesign) => {
                                    const buildable = shipCanBeBuiltOnSystemByFaction(ship, faction, star);

                                    if (!buildable) {
                                        return (
                                            <div key={ship.typeClassName}>
                                                <ShipInfo ship={ship} className="notBuildable" />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={ship.typeClassName}>
                                            <ShipInfo ship={ship} onClick={(s: ShipDesign) => buildUnit(ship, star)} />
                                        </div>
                                    );
                                })}
                            </div>
                        </Grid>

                        <Grid xs={12} className={classes.contentArea}>
                            <Button variant="contained" color="secondary" onClick={() => setBuildingView("")}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

interface PlanetsProps {
    star: SystemModel;
}

const Planets: FC<PlanetsProps> = (props) => {
    const classes = useStyles();
    const planets = props.star.info ? [...props.star.info.planets] : [];
    planets.sort((a: Planet, b: Planet) => {
        return a.distanceFromStar - b.distanceFromStar;
    });

    return (
        <div className={classes.planets}>
            {planets.map((p: Planet) => {
                const [style, addClasses] = planetStyle(p);
                return (
                    <div className="planet-container">
                        <PlanetDiv star={props.star} planet={p} />

                        <label>
                            {p.name}
                            <br />
                            {p.type}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default SystemView;
