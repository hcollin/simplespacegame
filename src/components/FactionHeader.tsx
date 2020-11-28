import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { useService } from "jokits-react";
import { GameModel, Report, SystemModel } from "../models/Models";
import { IconReport } from "./Icons";
import { CombatReport, DetailReport, DetailReportType, InvasionReport, SystemReport } from "../models/Report";
import { apiLoadReport } from "../api/apiReport";
import CombatViewer from "./CombatViewer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 100,
            // height: "5rem",
            // width: "calc(100% - 18rem)",
            // width: "50%",
            // minWidth: "30rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // borderBottomRightRadius: "15rem 5rem",
            // background: "linear-gradient(170deg, #222 0, red 10%,  white 50%, white 80%, gray 100%)`}}",
            // background: "linear-gradient(0deg, white 0, black 0)",
            // borderBottom: "solid 2px #0008",
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: "-4px",
                zIndex: -1,
                userSelect: "none",
                pointerEvents: "none",
                background: "linear-gradient(to bottom, #222 0, #444E 5%, #555D 80%, #777C 90%, #444E 95%, #222 100%)",
                borderBottom: "solid 4px #0008",
                borderBottomRightRadius: "15rem 5rem",
            },

            "& >  div": {
                // marginRight: "1rem",
                // padding: "0 0.5rem",
                borderLeft: "groove 5px #0008",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // minWidth: "8rem",
                background: "linear-gradient(to bottom, #222 0, #444E 5%, #555D 80%, #777C 90%, #444E 95%, #222 100%)",
                boxShadow: "inset 0 0 1rem 0.5rem #4448",

                // background: "linear-gradient(to right, #0008 0, transparent 25%, #FFF6 50%, #0000 100%)",

                "&.title": {
                    background:
                        "linear-gradient(to bottom, #000 5%, #333 10%, #444E 80%, #666D 85%, #333 90%, #000 95%)",
                    boxShadow: "inset 0 0 1rem 0.5rem #0008",
                    "& > h1": {
                        color: "white",
                        // fontSize: "1.8rem",
                        fontWeight: "normal",
                        textShadow: "2px 2px 0 black, -2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black",
                        margin: "0 1rem",
                        "& > span": {
                            padding: 0,
                            margin: 0,
                            display: "block",
                            fontSize: "1rem",
                        },
                    },
                },

                "&.rest": {
                    flex: "1 1 auto",
                    // borderBottomRightRadius: "15rem 5rem",
                    position: "relative",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    "&:after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // borderBottomRightRadius: "15rem 5rem",
                        background:
                            "linear-gradient(45deg, transparent 25%, #0001 40%, #FFF3 50%, #0002 60%, #000D 100%)",
                        pointerEvents: "none",
                        userSelect: "none",
                    },
                    "& > .reportIcon": {
                        position: "relative",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "5rem",
                        justifyContent: "center",
                        height: "100%",
                        padding: "0 1rem",
                        "& > p": {
                            fontSize: "2rem",
                            margin: "0 0 0 0.5rem",
                            padding: 0,
                            color: "#FFFD",
                            fontWeight: "bold",
                            textShadow: "2px 2px 0 black, -2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black",
                        },
                        "& > div.list": {
                            display: "none",
                            // top: "5rem",
                            // left: "0",
                            color: "#BDFA",
                            zIndex: "1000",
                            position: "absolute",
                            backgroundColor: "#000A",
                            // width: "20rem",
                            height: "auto",
                            borderRadius: "0.25rem",
                            padding: "0.5rem 0",
                            border: "ridge 3px #BDF8",
                            "& > div": {
                                // padding: "0.5rem 1rem",
                                borderBottom: "solid 2px #0004",
                            },
                        },
                        "&:hover": {
                            "& > div.list": {
                                display: "block",
                            },
                        },
                    },
                },

                "& > img": {
                    height: "80%",
                },

                "& > div.mainView, & > div.singleView": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 1rem",
                    "& > div.wrapper": {
                        marginRight: "0.5rem",
                    },
                    "& > b": {
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#FFFD",
                        textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                        // padding: "0.5rem",
                    },
                    "& >span": {
                        fontSize: "1rem",
                        fontWeight: "normal",
                        color: "#FFFD",
                        textShadow: "1px 1px 1px #000, -1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000",
                        marginLeft: "0.25rem",
                    },
                },
                "& > div.hoverView": {
                    display: "none",
                },
                "&:hover": {
                    "& > div.mainView": {
                        display: "none",
                    },
                    "& > div.hoverView": {
                        display: "block",
                    },
                },
            },
            [theme.breakpoints.down("md")]: {
                right: 0,
                height: "3rem",
                width: "auto",
                minWidth: 0,
                borderBottomRightRadius: 0,
                "& > div": {
                    minWidth: "4rem",
                    "&.logo": {
                        width: "4rem",
                        minWidth: "auto",
                    },
                    "&.title": {
                        flex: "0 0 auto",
                        width: "12rem",
                        "& > h1": {
                            fontSize: "1rem",
                        },
                    },
                    "&.rest": {
                        borderBottomRightRadius: 0,
                        "&:after": { 
                            borderBottomRightRadius: 0,
                        },
                        "& > .reportIcon": {
                            width: "2.5rem",
                            height: "100%",
                            padding: "0 0.25rem",
                            "& > div.list": {
                                top: "3rem",
                                right: "2rem",
                                left: "auto",
                                width: "15rem",
                                "& > div": {
                                    padding: "0.25rem 0.5rem",
                                }
                            },
                        },
                    },
                },
               
            },
            [theme.breakpoints.up("lg")]: {
                height: "5rem",
                right: "auto",
                width: "50%",
                minWidth: "30rem",
                borderBottomRightRadius: "15rem 5rem",
                "& > div": {
                    minWidth: "8rem",
                    "&.logo": {
                        width: "8rem",
                        minWidth: 0,
                    },
                    "&.title": {
                        flex: "1 1 auto",
                        width: "auto",
                        "& > h1": {
                            fontSize: "1.8rem",
                        },
                    },
                    "&.rest": {
                        borderBottomRightRadius: "15rem 5rem",
                        "&:after": { 
                            borderBottomRightRadius: "15rem 5rem",
                        },
                        "& > .reportIcon": {
                            width: "5rem",
                            height: "100%",
                            padding: "0 1rem",
                            "& > div.list": {
                                top: "5rem",
                                left: 0,
                                width: "20rem",
                                "& > div": {
                                    padding: "0.5rem 1rem",
                                }
                            },
                        },

                    },
                },
                
            },
        },
        sheet: {
            padding: 0,
            margin: 0,
            fontSize: "1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "8rem",
            alignItems: "center",
            "& > label": {
                fontSize: "0.7rem",
                fontWeight: "bold",
            },

            "&.res": {
                fontWeight: "bold",
                borderTop: "double 3px black",
            },
        },
        reportContainer: {
            position: "fixed",
            top: "10rem",
            left: "10%",
            right: "10%",
            bottom: "5rem",
            color: "#FFF",
            zIndex: 2000,
            background: "repeating-linear-gradient(20deg, #222 0, #333 0.5rem, #444 2rem, #333 11.5rem, #222 12rem)",
            minHeight: "5rem",
            borderRadius: "2rem",
            border: "ridge 4px #A448",
            borderTop: "none",
            borderBottom: "none",
            boxShadow: "0 0 2rem 1rem #000",
            overflow: "hidden",
            "& > header": {
                height: "7rem",
                display: "flex",
                padding: "0 2rem",
                background: "linear-gradient(180deg, #000, #666 1rem, #444 6em, #000 100%)",
                alignItems: "center",
                borderBottom: "ridge 3px #FFF8",
                flexDirection: "row",
                justifyContent: "space-between",

                userSelect: "none",
                "& > * ": {
                    margin: 0,
                    padding: 0,
                },
                "& > h1": {
                    color: "#FFFA",
                    textShadow: "2px 2px 2px #000A, -2px 2px 2px #000A, -2px -2px 2px #000A, 2px -2px 2px #000A",
                    "& > small": {
                        display: "block",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        fontStyle: "italic",
                        color: "#CDEA",
                    },
                },
                "& > h2": {
                    color: "#FFFA",
                    textShadow: "2px 2px 2px #000A, -2px 2px 2px #000A, -2px -2px 2px #000A, 2px -2px 2px #000A",
                },
                "& > button.close": {
                    top: "0",
                    right: "3rem",
                    width: "3rem",
                    height: "2rem",
                    position: "absolute",
                    background: "linear-gradient(180deg, #A22 0rem, #8448 1rem, #666 2rem)",
                    border: "ridge 4px #A448",
                    color: "#FFF8",
                    fontWeight: "bold",
                    borderTopLeftRadius: "0.7rem",
                    borderTopRightRadius: "0.7rem",
                    borderBottom: "none",
                    fontSize: "1.5rem",
                    "&:hover, &:active": {
                        cursor: "pointer",
                        background: "linear-gradient(180deg, #F00 0rem, #A228 1rem, #666 2rem)",
                        color: "#FFFA",
                        outline: "none",
                    },
                },
            },
            "& > footer": {
                left: "0",
                right: "0",
                bottom: "0",
                display: "flex",
                padding: "1rem",
                position: "absolute",
                background: "linear-gradient(180deg, #333, #444 1rem, #444 90%, #0008 100%)",
                borderTop: "ridge 3px #A448",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
            },
            "& > div.main": {
                padding: "0 1rem",
                overflowY: "auto",
                position: "absolute",
                top: "7rem",
                bottom: "4.5rem",
                left: 0,
                right: 0,
                color: "#FFFA",

                "& ul": {
                    listStyle: "upper-roman",
                    "& >li": {
                        padding: "0.5rem 0",
                        borderBottom: "ridge 3px #0004",
                        fontSize: "1.2rem",
                        "&:last-child": {
                            borderBottom: "none",
                        },
                    },
                },
            },
        },
    })
);

const FactionHeader: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();

    const [activeReportId, setActiveReportId] = useState<string>("");
    const [report, setReport] = useState<DetailReport | null>(null);

    useEffect(() => {
        console.log("load report id", activeReportId);
        if (activeReportId !== "") {
            apiLoadReport(activeReportId)
                .then((rep: DetailReport | null) => {
                    setReport(rep);
                })
                .catch(() => {
                    console.warn("Could not load report", activeReportId);
                    setActiveReportId("");
                });
        } else {
            setReport(null);
        }
    }, [activeReportId]);

    useEffect(() => {
        if (report && faction && !report.factionIds.includes(faction.id)) {
            setActiveReportId("");
        }
    }, [faction, report]);

    if (!faction || !game) return null;

    const factionTitleStyle = {
        fontFamily: faction.style.fontFamily ? faction.style.fontFamily : "Arial",
    };

    const reports = game.systems.reduce((reps: Report[], sm: SystemModel) => {
        sm.reports.forEach((rep: Report) => {
            if (rep.factions.includes(faction.id)) {
                reps.push(rep);
            }
        });

        return reps;
    }, []);

    function openReport(repId?: string) {
        if (reports.length > 0) {
            console.log("LOAD REPORT", repId);
            if (repId) {
                setActiveReportId(repId);
            } else {
                setActiveReportId(reports[0].reportId);
            }
        }
    }

    function closeReport() {
        setActiveReportId("");
    }

    return (
        <>
            <div
                className={`${classes.root}`}
                style={{
                    background: `linear-gradient(190deg, #222 0, ${faction.color} 10%,  white 50%, white 80%, gray 100%)`,
                }}
            >
                <div className="logo" style={{ background: faction.color }}>
                    <img
                        src={require(`../images/symbols/${faction.iconFileName}`)}
                        alt={`faction ${faction.name} logo`}
                    />
                </div>
                <div className="title" style={{ borderBottom: `ridge 3px ${faction.color}` }}>
                    <h1 style={factionTitleStyle}>{faction.name}</h1>
                </div>

                <div className="rest" style={{ background: faction.color }}>
                    {reports.length > 0 && (
                        <div className="reportIcon">
                            <IconReport size="lg" />
                            <p>{reports.length}</p>

                            <div className="list">
                                {reports.map((r: Report) => {
                                    console.log(r.type, r.reportId, r.turn);
                                    return (
                                        <div key={r.reportId} onClick={() => openReport(r.reportId)}>
                                            {r.type}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {activeReportId !== "" && (
                <div>
                    {report === null && (
                        <div className={classes.reportContainer}>
                            <p>Loading Report...</p>
                        </div>
                    )}
                    {report && report.type === DetailReportType.System && (
                        <SystemReportView report={report as SystemReport} close={closeReport} />
                    )}
                    {report && report.type === DetailReportType.Combat && (
                        <CombatViewer combatReport={report as CombatReport} close={closeReport} />
                    )}
                    {report && report.type === DetailReportType.Invasion && (
                        <InvasionReportView report={report as InvasionReport} close={closeReport} />
                    )}
                </div>
            )}
        </>
    );
};

interface SystemReportProps {
    report: SystemReport;
    close: () => void;
}

const SystemReportView: FC<SystemReportProps> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.reportContainer}>
            <header>
                <h1>System report</h1>
                <button onClick={props.close} className="close">
                    X
                </button>
            </header>

            <div className="main">
                <h2>{props.report.title}</h2>
                <p>{props.report.text}</p>
            </div>
        </div>
    );
};

interface InvasionReportProps {
    report: InvasionReport;
    close: () => void;
}

const InvasionReportView: FC<InvasionReportProps> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.reportContainer}>
            <header>
                <h1>System report</h1>
                <button onClick={props.close} className="close">
                    X
                </button>
            </header>

            <div className="main">
                <h2>{props.report.title}</h2>
                <ul>
                    {props.report.texts.map((t: string, ind: number) => (
                        <li key={`t-${ind}`}>{t}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default FactionHeader;
