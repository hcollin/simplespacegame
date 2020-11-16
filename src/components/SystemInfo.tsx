import { makeStyles, Theme, createStyles, Button, Tab, Tabs, Grid } from "@material-ui/core";
import React, { FC, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import {
    plusEconomy,
    plusWelfare,
    plusIndustry,
    plusDefense,
    buildUnit,
    doRemoveCommand,
} from "../services/commands/SystemCommands";

import useMyCommands from "../hooks/useMyCommands";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { GameModel, Report, SystemModel } from "../models/Models";
import { inSameLocation } from "../utils/locationUtils";
import useCurrentUser from "../services/hooks/useCurrentUser";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getFactionFromArrayById, getFactionShips } from "../services/helpers/FactionHelpers";
import useUserIsReady from "../services/hooks/useUserIsReady";
import DATASHIPS from "../data/dataShips";
import ShipInfo from "./ShipInfo";
import { ShipDesign } from "../models/Units";
import { IconCredit, IconDefense, IconEconomy, IconIndustry, IconResearchPoint, IconUnderConstruction, IconWelfare } from "./Icons";
import { getSystemEconomy } from "../utils/systemUtils";
import { SERVICEID } from "../services/services";
import { useService } from "jokits-react";
import { DATABUILDINGS } from "../data/dataBuildings";
import { BuildingDesign } from "../models/Buildings";
import BuildingDesignSlot from "./BuildingDesignSlot";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            zIndex: 100,
            top: "100px",
            right: "20rem",
            minWidth: "35rem",
            minHeight: "25rem",
            padding: "3rem 1rem 1rem 1rem",
            // background: "#FFFD",
            background:
                // "repeating-linear-gradient(to bottom, #1118 0, #333E 5px, #444E 54px, #777E 67px, #555E 76px, #1118 80px)",
                "repeating-linear-gradient(to bottom, #000C 0, #111E 3px, #222E 6px, #111E 15px, #111E 65px, #123E 70px, #111E 75px, #000C 80px)",
            color: "#FFFD",
            boxShadow: "inset 0 0 2rem 0.5rem #000",
            border: "ridge 3px #FFF5",

            "& h1, & h2, & h3, & h4": {
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
            },
            "& label.info": {
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                textTransform: "uppercase",
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#BDFA",
                fontStyle: "italic",
            },
            "& > div.title": {
                top: "0",
                left: "-5.0rem",
                width: "5rem",
                height: "100%",
                position: "absolute",
                background: "linear-gradient(to right, #555D 0, #99A 90%, #446 100%)",
                borderBottomLeftRadius: "5rem 10rem",
                borderTopLeftRadius: "1rem",
                boxShadow: "inset 0 0 2rem 0.5rem #0008",
                borderRight: "ridge 3px #FFF4",
                "& > h1": {
                    margin: "0",
                    padding: "0",
                    transform: "rotate(-90deg)",
                    width: "25rem",
                    height: "5rem",
                    transformOrigin: "top left",
                    textAlign: "right",
                    lineHeight: "5rem",
                    position: "absolute",
                    top: "25rem",
                    paddingRight: "1rem",
                },
            },
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
                "&:hover": {
                    backgroundColor: "#630C",
                    color: "#FFFD",
                },
            },
            "& >header": {
                background: "linear-gradient(to bottom, #000 0, #333A 0.5rem, #113D 3.5rem, #000 3rem)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3rem",
                borderBottom: "ridge 3px #0008",
                "& button.systemTab": {
                    minWidth: "auto",
                }

            },
        },
        tabs: {
            "& > nav": {
                height: "2rem",
            },
            "& > div.tab": {},
        },
        value: {
            width: "100%",
            padding: "0.5rem 0.5rem 0.5rem 0.5rem",
            fontSize: "1.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.25rem",

            border: "ridge 5px #DEF8",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            background: "linear-gradient(to bottom, #000 0, #0008 5%, #2228 75%, #444 80%, #000A 95%, #000 100%)",
            "& > h3": {
                padding: 0,
                margin: 0,
                display: "flex",
                alignItems: "center",
                "& > span": {
                    margin: 0,
                    padding: 0,
                    fontSize: "1.4rem",
                    marginLeft: "0.5rem",
                    lineHeight: "1.8rem",
                    color: "#8F8",
                },
                "& > small": {
                    fontSize: "1.2rem",
                    color: "#CCCC",
                    marginLeft: "0.5rem"
                }
            },
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
        footer: {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            background: "linear-gradient(180deg, #0008, #111D 10%, #111E 80%, #0008 100%)",
            margin: "1rem -1rem -1rem -1rem",
            "& > div": {
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                flex: "1 1 auto",
                boxShadow: "inset 0 0 0.5rem 6px #0004",
                padding: "0.5rem",

                "& > h3": {
                    margin: "0 0.5rem",
                    color: "#FFFE",
                    "& > small": {
                        fontSize: "1rem",
                        fontWeight: "normal",
                        color: "#CCCA",
                    }
                }
            },
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(180deg, #000E, #1118 10%, #1110 50%, #111A 80%, #000E 100%)",
                zIndex: 1,
            }
        },

        units: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#345E",
            padding: "1rem 0",
            boxShadow: "inset 0 0 3rem 1rem #000D",
            border: "ridge 3px #CDE8",
            borderRadius: "0.5rem",
            "& > div": {
                boxShadow: "0 0 0.5rem 0.15rem #000",
                marginBottom: "0.5rem",
                border: "solid 2px #000",
                borderRadius: "0.5rem",
                position: "relative",

                "& > img": {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: "-3rem",
                    marginTop: "-3rem",
                    zIndex: 100,
                    background: "radial-gradient(#042, #000A)",
                    border: "ridge 3px #FFF8",
                    borderRadius: "50%",
                    "&.constructionLogo": {
                        width: "6rem",
                        height: "6rem",
                    }
                },
                "& > div": {
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
                                zIndex: 100,
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
                            },
                        },
                    },
                },
            },
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
                },
            },
        },

        buildingGrid: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
            maxWidth: "48rem",
            "& > div": {
                margin: "0.5rem",

            }
        }
    })
);

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
        className: "systemTab",
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
    const [user] = useCurrentUser();
    const [game] = useService<GameModel>(SERVICEID.GameService);
    const faction = useCurrentFaction();
    const userIsReady = useUserIsReady();

    const [tab, setTab] = useState<number>(0);

    if (star === null || !user || !faction || !game) return null;

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

    const shipsUnderConstruction: ShipDesign[] = comms.reduce((ships: ShipDesign[], command: Command) => {
        if (command.type === CommandType.SystemBuildUnit) {
            const cmd = command as BuildUnitCommand;
            if (inSameLocation(cmd.target, star.location)) {
                const ship = DATASHIPS.find((s: ShipDesign) => s.name === cmd.shipName);
                if (ship) {
                    ships.push(ship);
                }
            }
        }

        return ships;
    }, []);

    function cancelConstruction(ship: ShipDesign) {
        const cmd = comms.find((command: Command) => {
            if (command.type === CommandType.SystemBuildUnit && star) {
                const cmd = command as BuildUnitCommand;
                if (inSameLocation(cmd.target, star.location) && cmd.shipName === ship.name) {
                    return true;
                }
            }
            return false;
        });
        if (cmd) {
            doRemoveCommand(cmd.id);
        }
    }


    const sysEco = getSystemEconomy(star, game);

    const starFaction = getFactionFromArrayById(game.factions, star.ownerFactionId);

    return (
        <div className={classes.root}>
            <button className="close" onClick={() => setStar(null)}>
                X
            </button>

            <header>
                <Tabs value={tab} onChange={changeTab} aria-label="tabs">
                    <Tab label="System" {...a11yProps(0)} />
                    <Tab label="Units" {...a11yProps(1)} />
                    <Tab label="Buildings" {...a11yProps(2)} />
                    <Tab label="Reports" {...a11yProps(3)} />
                </Tabs>
            </header>


            <div className="title">
                <h1>{star.name}</h1>
            </div>

            <TabPanel value={tab} index={0}>
                <h2>System Infrastructure</h2>
                <Grid container spacing={1}>
                    <Grid item lg={7}>
                        <div className={classes.value}>
                            <IconIndustry size="xl" wrapper="light" />
                            <h3>
                                {star.industry} <small>/ {sysEco.industryMax}</small> {comPlusInd > 0 && <span>+{comPlusInd}</span>}
                            </h3>

                            {isMine && !userIsReady && (
                                <Button variant="contained" color="primary" onClick={() => plusIndustry(star.id)} disabled={star.industry + comPlusInd >= sysEco.industryMax}>
                                    +
                                </Button>
                            )}
                        </div>
                        <div className={classes.value}>
                            <IconEconomy size="xl" wrapper="light" />

                            <h3>
                                {star.economy} <small>/ {sysEco.economyMax}</small>
                                {comPlusEco > 0 && <span>+{comPlusEco}</span>}
                            </h3>

                            {isMine && !userIsReady && (
                                <Button variant="contained" color="primary" onClick={() => plusEconomy(star.id)} disabled={star.economy + comPlusEco >= sysEco.economyMax}>
                                    +
                                </Button>
                            )}
                        </div>
                        <div className={classes.value}>
                            <IconDefense size="xl" wrapper="light" />
                            <h3>
                                {star.defense} <small>/ {sysEco.defenseMax}</small>
                                {comPlusDef > 0 && <span>+{comPlusDef}</span>}
                            </h3>
                            {isMine && !userIsReady && star.defense < star.industry && (
                                <Button variant="contained" color="primary" onClick={() => plusDefense(star.id)} disabled={star.defense + comPlusDef >= sysEco.defenseMax}>
                                    +
                                </Button>
                            )}
                        </div>
                        <div className={classes.value}>
                            <IconWelfare size="xl" wrapper="light" />
                            <h3>
                                {star.welfare} <small>/ {sysEco.welfareMax}</small>
                                {comPlusWlf > 0 && <span>+{comPlusWlf}</span>}
                            </h3>
                            {isMine && !userIsReady && (
                                <Button variant="contained" color="primary" onClick={() => plusWelfare(star.id)} disabled={star.welfare + comPlusWlf >= sysEco.welfareMax}>
                                    +
                                </Button>
                            )}
                        </div>
                    </Grid>

                    <Grid item lg={5}>
                            <label className="info">Keywords</label>
                            <h3>{star.keywords.join(", ")}</h3>
                            
                    </Grid>
                </Grid>

            </TabPanel>

            <TabPanel value={tab} index={1}>
                <h2>Units</h2>

                <h3>Units under construction</h3>
                <div className={classes.units}>
                    {shipsUnderConstruction.map((s: ShipDesign, ind: number) => {
                        return (
                            <div key={`ship${ind}`}>
                                <IconUnderConstruction className="constructionLogo" />
                                <ShipInfo
                                    ship={s}
                                    key={`ship${ind}`}
                                    className="underConstruction"
                                    onClick={() => cancelConstruction(s)}
                                />
                            </div>
                        );
                    })}
                </div>

                <h3>Build Ships</h3>

                <div className={classes.units}>
                    {faction &&
                        getFactionShips(faction.id).map((ship: ShipDesign) => {
                            const canAfford = faction.money >= ship.cost;
                            const enoughIndustry = star.industry >= ship.minIndustry;
                            const canBuild = canAfford && enoughIndustry && isMine && !userIsReady;

                            if (!canBuild) {
                                return (
                                    <div key={ship.name}>
                                        <ShipInfo ship={ship} className="notbuildable" />
                                    </div>
                                );
                            }

                            return (
                                <div key={ship.name}>
                                    <ShipInfo ship={ship} onClick={(s: ShipDesign) => buildUnit(s, star.location)} />
                                </div>
                            );
                        })}
                </div>
            </TabPanel>

            <TabPanel value={tab} index={2}>
                        <BuildingsTab star={star} game={game}/>


                
            </TabPanel>

            <TabPanel value={tab} index={3}>
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

            <footer className={classes.footer} style={{background: starFaction ? starFaction.color : "#888"}}>
                <div>
                    <IconCredit wrapper="dark" size="lg" /> <h3>{sysEco.profit} <small> / turn</small></h3>
                </div>

                <div>
                    <IconResearchPoint wrapper="dark" size="lg"/><h3> {sysEco.research} <small> / turn</small></h3>
                </div>

                
            </footer>
        </div>
    );
};

interface TabProps {
    star: SystemModel,
    game: GameModel,
}

const BuildingsTab: FC<TabProps> = () => {
    const classes = useStyles();
    const designs = DATABUILDINGS;

    return (
        <>
        <h2>Buildings</h2>



        <h3>Designs to build</h3>

        <div className={classes.buildingGrid}>
        {designs.map((bd: BuildingDesign) => {

            return <BuildingDesignSlot building={bd} key={bd.name} />
        })}
        </div>
        

        </>
    )
}

export default SystemInfo;
