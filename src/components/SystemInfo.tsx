import { makeStyles, Theme, createStyles, Button, Tab, Tabs, AppBar } from "@material-ui/core";
import React, { FC, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { plusEconomy, plusWelfare, plusIndustry, plusDefense, buildUnit, removeCommand } from "../services/commands/SystemCommands";

import BuildIcon from "@material-ui/icons/Build";
import SecurityIcon from "@material-ui/icons/Security";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";

import TimerIcon from '@material-ui/icons/Timer';

import useMyCommands from "../hooks/useMyCommands";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { Report, OldShip } from "../models/Models";
import { inSameLocation } from "../utils/locationUtils";
import useCurrentUser from "../services/hooks/useCurrentUser";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getFactionShips } from "../services/helpers/FactionHelpers";
import useUserIsReady from "../services/hooks/useUserIsReady";
import DATASHIPS from "../data/dataShips";
import ShipInfo from "./ShipInfo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            zIndex: 100,
            top: "100px",
            right: "29rem",
            minWidth: "30rem",
            padding: "3rem 1rem 1rem 1rem",
            // background: "#FFFD",
            background: "repeating-linear-gradient(0deg, #FFF 0, #FFFD 5px, #DDDF 10px, #FFF 15px)",
            "& > button.close": {
                position: "absolute",
                top: "-0.5rem",
                right: "-0.5rem",
                width: "2rem",
                height: "2rem",
                zIndex: "1200",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                boxShadow: "0 0 0.5rem 0.1rem #0008",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "#F88",
                }
            }
        },
        tabs: {
            "& > nav": {
                height: "2rem",
            },
            "& > div.tab": {},
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
        report: {
            "& >p": {
                margin: 0,
                padding: 0,
            },
        },

        units: {
            "& > div": {
                marginBottom: "0.5rem",

                "&.notbuildable": {
                    background: "#333",
                },

                "&.underConstruction": {
                    background: "#666",
                    opacity: 0.8,
                    filter: "grayscale(0.7)",
                    position: "relative",

                    "&:hover": {
                        background: "#666",
                        opacity: 1,
                        filter: "none",
                        
                        "&:after": {
                            content: '"CANCEL"',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            fontSize: "3rem",
                            letterSpacing: "6px",
                            color: "#F00C",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#000C",
                            border: "solid 6px #F00C",
                            borderRadius: "0.5rem",
                            fontWeight: "bold",


                        }
                    }
                }

            }
        },

        unitList: {
            "& > div.selectable": {
                background: "#0002",
                cursor: "pointer",
                padding: "0.25rem",
                marginBottom: "3px",
                "&:hover": {
                    background: "#0802",
                },
                "& > h3": {
                    margin: 0,
                }
            }

        }
    })
);

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            aria-labelledby={`simple-tab-${index}`}
            id={`simple-tabpanel-${index}`}
            hidden={index !== value}
            {...other}
        >
            {children}
        </div>
    );
}

const SystemInfo: FC = () => {
    const classes = useStyles();
    const [star, setStar] = useSelectedSystem();
    const comms = useMyCommands();
    // const units = useUnitsInSelectedSystem();
    const [user] = useCurrentUser();
    const faction = useCurrentFaction();
    const userIsReady = useUserIsReady();
    // const [selectedUnits, setSelectedUnits] = useState<UnitModel[]>([]);
    // const [fleet, fleetActions] = useUnitSelection();

    const [tab, setTab] = useState<number>(0);

    if (star === null || !user) return null;

    function changeTab(event: React.ChangeEvent<{}>, newValue: number) {
        setTab(newValue);
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

    const shipsUnderConstruction: OldShip[] = comms.reduce((ships: OldShip[], command: Command) => {
        if (command.type === CommandType.SystemBuild) {
            const cmd = command as BuildUnitCommand;
            if (inSameLocation(cmd.target, star.location)) {
                const ship = DATASHIPS.find((s: OldShip) => s.name === cmd.shipName);
                if (ship) {
                    ships.push(ship);
                }
            }
        }

        return ships;
    }, []);

    function cancelConstruction(ship: OldShip) {
        const cmd = comms.find((command: Command) => {
            if (command.type === CommandType.SystemBuild && star) {
                const cmd = command as BuildUnitCommand;
                if (inSameLocation(cmd.target, star.location) && cmd.shipName === ship.name) {
                    return true;
                }
            }
            return false;
        });
        if (cmd) {
            removeCommand(cmd.id);
        }
    }

    return (
        <div className={classes.root}>
            <button className="close" onClick={() => setStar(null)}>X</button>

            <AppBar position="absolute">
                <Tabs value={tab} onChange={changeTab} aria-label="simple tabs example">
                    <Tab label="System" {...a11yProps(0)} />
                    <Tab label="Units" {...a11yProps(1)} />
                    <Tab label="Reports" {...a11yProps(2)} />
                </Tabs>
            </AppBar>

            <h1>{star.name}</h1>

            <TabPanel value={tab} index={0}>
                <h2>System Infrastructure</h2>

                <div className={classes.value}>
                    <BuildIcon />
                    {star.industry}
                    {isMine && !userIsReady && (
                        <Button variant="contained" color="primary" onClick={() => plusIndustry(star.id)}>
                            +
                        </Button>
                    )}
                    {comPlusInd > 0 && <p>+{comPlusInd}</p>}
                </div>
                <div className={classes.value}>
                    <MonetizationOnIcon /> {star.economy}
                    {isMine && !userIsReady && (
                        <Button variant="contained" color="primary" onClick={() => plusEconomy(star.id)}>
                            +
                        </Button>
                    )}
                    {comPlusEco > 0 && <p>+{comPlusEco}</p>}
                </div>
                <div className={classes.value}>
                    <SecurityIcon /> {star.defense}
                    {isMine && !userIsReady && star.defense < star.industry && (
                        <Button variant="contained" color="primary" onClick={() => plusDefense(star.id)}>
                            +
                        </Button>
                    )}
                    {comPlusDef > 0 && <p>+{comPlusDef}</p>}
                </div>
                <div className={classes.value}>
                    <PeopleAltIcon /> {star.welfare}
                    {isMine && !userIsReady && (
                        <Button variant="contained" color="primary" onClick={() => plusWelfare(star.id)}>
                            +
                        </Button>
                    )}
                    {comPlusWlf > 0 && <p>+{comPlusWlf}</p>}
                </div>
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <h2>Units</h2>

                <h3>Units under construction</h3>
                <div className={classes.units}>
                    {shipsUnderConstruction.map((s: OldShip, ind: number) => {
                        return (

                            <ShipInfo ship={s} key={`ship${ind}`} className="underConstruction" onClick={() => cancelConstruction(s)} />


                        );
                    })}
                </div>

                <h3>Build Ships</h3>


                <div className={classes.units}>
                    {faction &&
                        getFactionShips(faction.id).map((ship: OldShip) => {
                            const canAfford = faction.money >= ship.cost;
                            const enoughIndustry = star.industry >= ship.minIndustry;
                            const canBuild = canAfford && enoughIndustry && isMine && !userIsReady;

                            return (
                                <ShipInfo ship={ship} onClick={(s: OldShip) => buildUnit(s, star.location)} key={ship.name} className={!canBuild ? "notbuildable" : ""} />
                            );
                        })}
                </div>
            </TabPanel>

            <TabPanel value={tab} index={2}>
                <h2>Report</h2>

                {star.reports.length === 0 && <p>No reports in the system</p>}
                {star.reports.map((r: Report, ind: number) => {
                    return (
                        <div key={`${star.id}-rep-${ind}`} className={classes.report}>
                            <h3>{r.type}</h3>

                            {r.text.map((s: string, i: number) => {
                                return <p key={`${star.id}-${ind}-s-${i}`}>{s}</p>;
                            })}
                        </div>
                    );
                })}
            </TabPanel>
        </div>
    );
};

export default SystemInfo;
