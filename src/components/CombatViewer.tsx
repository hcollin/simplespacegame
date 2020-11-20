import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useState } from "react";
import { FactionModel, GameModel } from "../models/Models";
import {
    CombatReport,
    CombatRoundAttackReport,
    CombatRoundReport,
    CombatRoundStatus,
    DetailReport,
} from "../models/Report";
import { ShipUnit, ShipWeapon } from "../models/Units";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import { getSystemById } from "../services/helpers/SystemHelpers";
import { SERVICEID } from "../services/services";
import Dots from "./Dots";
import { IconHull, IconShields } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            top: "5rem",
            left: "10%",
            width: "80%",
            bottom: "5rem",
            zIndex: 2000,
            overflow: "hidden",
            position: "fixed",
            background: "repeating-linear-gradient(20deg, #222 0, #333 0.5rem, #444 2rem, #333 11.5rem, #222 12rem)",
            minHeight: "5rem",
            borderRadius: "2rem",
            border: "ridge 4px #A448",
            borderTop: "none",
            borderBottom: "none",
            boxShadow: "0 0 2rem 1rem #000",

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
                "&> div.factions": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    background: "#0008",
                    height: "7rem",
                    padding: "0 4rem",
                    borderRadius: "3.5rem",
                    borderLeft: "groove 5px #0008",
                    borderRight: "groove 5px #0008",
                    boxShadow: "inset 0 0 1rem 0.2rem #000",
                    "& > div.faction": {
                        margin: "0 0.5rem",
                        padding: "0.5rem",
                        borderRadius: "1rem",
                        border: "groove 3px #FFF4",
                        boxShadow: "inset 0 0 1rem 0.5rem #0008",
                        position: "relative",
                        "& > img": {
                            height: "3.5rem",
                        },
                        "& > div.versus": {
                            top: "0.8rem",
                            color: "#EEE",
                            right: "-1.5rem",
                            width: "2rem",
                            zIndex: "100",
                            position: "absolute",
                            fontSize: "2.5rem",
                            transform: "rotate(-30deg)",
                            fontFamily: "Piedra",
                            textShadow:
                                "2px 2px 2px #000A, -2px 2px 2px #000A, -2px -2px 2px #000A, 2px -2px 2px #000A",
                            opacity: "0.9",
                        },
                        "&:last-child": {
                            "& > div.versus": {
                                display: "none",
                            },
                        },
                    },
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
            },
        },
        factionsInSummary: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-around",
            width: "100%",
            "& > div.faction": {
                padding: "1rem",
                flex: "1 1 auto",
                "& > header": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    "& > div.logo": {
                        height: "4rem",
                        width: "4rem",
                        marginRight: "1rem",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        boxShadow: "inset 0 0 0.5rem 0.25rem #0008",
                    },
                    "& > h2": {
                        color: "#EEE",
                        fontSize: "1.6rem",
                        fontWeight: "normal",
                        textShadow: "1px 1px 1px #000A, -1px 1px 1px #000A, -1px -1px 1px #000A, 1px -1px 1px #000A",
                    },
                    "& > div.fleetSize": {
                        flex: "1 1 auto",
                        textAlign: "right",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    },
                },

                "& > div.unit": {
                    display: "flex",
                    padding: "0.5rem",
                    background: "#0003",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius: "0.5rem",
                    borderTopRightRadius: "50% 0.5rem",
                    borderBottomRightRadius: "50% 0.5rem",
                    "& > div.shipName": {
                        "& > h3": {
                            margin: 0,
                            padding: 0,
                        },
                        "& > h4": {
                            margin: 0,
                            padding: 0,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            color: "#AAAA",
                        },
                    },
                    "& > h2.destroyed": {
                        color: "#F42D",
                        margin: 0,
                    },
                    "& > h2.nodamage": {
                        color: "#2F4D",
                        margin: 0,
                    },
                    "& > div.damage": {
                        fontSize: "1.1rem",

                        "& > span.dmg": {
                            color: "#F42D",
                            fontWeight: "bold",
                            fontSize: "1.4rem",
                        },
                    },
                },
            },
        },
        attacks: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },
        attackReport: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-around",
            marginBottom: "0.5rem",
            color: "#000A",
            width: "auto",
            flex: "1 1 auto",
            "& > .attacker": {
                width: "20rem",
                border: "solid 1px black",
                height: "3rem",
                padding: "0.5rem 1rem",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "5rem 0.5rem",
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "5rem 0.5rem",
                "& > *": {
                    margin: 0,
                    paddig: 0,
                },
                "& > h3": {
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    margin: 0,
                    padding: 0,
                    "& > small": {
                        display: "block",
                        fontSize: "0.7rem",
                        fontStyle: "italic",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        marginBottom: "-0.4rem",
                        color: "#000C",
                    },
                },
                "& > p": {
                    fontSize: "0.9rem",
                    margin: 0,
                    padding: 0,
                },
            },

            "& > .weapon": {
                color: "#FFF",
                border: "solid 1px black",
                padding: "0.5rem 5rem 0.5rem 1.25rem",
                fontSize: "0.8rem",
                background:
                    "linear-gradient(90deg, #000E, #444 0.5rem, #888 0.6rem, #444 0.65rem, #888 0.7rem, #444 0.75rem, #888 0.8rem, #444 0.85rem, #444 1rem, #444 calc(100% - 5rem), #000E 100%)",
                borderTopRightRadius: "5rem 50%",
                borderBottomRightRadius: "5rem 50%",
                fontWeight: "bold",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "13rem",
            },
            "& > .hitroll": {
                border: "ridge 4px #0008",
                background: "#AFA",
                boxShadow: "inset 0 0 1rem 0.5rem #0008",
                width: "6rem",
                height: "3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                margin: "0 1rem",
                position: "relative",
                paddingRight: "1.5rem",
                "& > span": {
                    fontSize: "1.6rem",
                    fontWeight: "bold",
                    color: "#000C",
                },
                "& > small": {
                    right: "0",
                    width: "2rem",
                    bottom: "0",
                    position: "absolute",
                    fontSize: "0.7rem",
                    background: "#0008",
                    color: "white",
                    textAlign: "center",
                    padding: "1px 6px",
                    height: "1.1rem",
                    borderTopLeftRadius: "0.5rem",
                    borderTop: "ridge 2px #FFF5",
                    borderLeft: "ridge 2px #FFF5",
                    fontWeight: "bold",
                },
                "&.miss": {
                    background: "#F88",
                },
            },
            "& > div.reload": {
                height: "3rem",
                border: "ridge 3px #FFF8",
                background: "repeating-linear-gradient(180deg, #000, #333 3px, #333 17px, #000 20px)",
                color: "#FFFD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.25rem 2rem",
                width: "15rem",
                margin: "0 1rem",
                borderRadius: "1rem",
                boxShadow: "inset 0 0 1rem 0.5rem #000",
                fontWeight: "bold",
                fontSize: "0.9rem",
            },

            "& > .damage": {
                color: "white",
                width: "3rem",
                border: "ridge 3px #0008",
                height: "3rem",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                background: "#A00",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontStyle: "italic",
                boxShadow: "inset 0 0 1rem 0.75rem #FF08",
                margin: "0 1rem",
            },

            "& > .target": {
                border: "solid 1px black",
                padding: "0.5rem 1rem",
                height: "3rem",
                "& > *": {
                    margin: 0,
                    padding: 0,
                },
                "& > h3": {
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    margin: 0,
                    padding: 0,
                    "& > small": {
                        display: "block",
                        fontSize: "0.7rem",
                        fontStyle: "italic",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        marginBottom: "-0.4rem",
                        color: "#000C",
                    },
                },
                "& > p": {
                    fontSize: "0.9rem",
                    margin: 0,
                    padding: 0,
                },
            },
        },
        roundStatus: {
            display: "flex",
            flexWrap: "wrap",
            // background: "repeating-linear-gradient(20deg, #222 0, #333 0.5rem, #444 2rem, #333 11.5rem, #222 12rem)",
            background: "#0008",
            alignItems: "center",
            borderBottom: "solid 1px black",
            flexDirection: "row",
            justifyContent: "space-around",
            margin: "0 -1rem 1rem -1rem",
            padding: "0.5rem",
            boxShadow: "inset 0 0 3rem 1rem #0008",
            "& > div.ship": {
                padding: "0.5rem 1rem",
                boxShadow: "inset 0 0 1rem 0.5rem #0006",
                borderRadius: "0.5rem",
                margin: "0.5rem",
                position: "relative",
                height: "6rem",
                minWidth: "14rem",
                color: "#000E",
                "& > h4": {
                    margin: 0,
                    padding: 0,
                    fontSize: "1rem",
                    "& > small": {
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        display: "block",
                        color: "#000A",
                    },
                },
                "& > p": {
                    margin: 0,
                    padding: 0,
                    fontSize: "0.8rem",
                },
                "& > .damage": {
                    left: "0",
                    width: "50%",
                    bottom: "0",
                    height: "2rem",
                    display: "flex",
                    position: "absolute",
                    fontSize: "0.8rem",
                    background: "linear-gradient(90deg, #F008, #FFF8 1.75rem, #0005 2rem, #0005 95%, #000A 100%)",
                    borderTop: "ridge 3px #0004",
                    alignItems: "center",
                    fontWeight: "bold",
                    paddingLeft: "1.75rem",
                    paddingBottom: "0.3rem",
                    justifyContent: "center",
                    borderTopRightRadius: "0.5rem",
                    borderBottomLeftRadius: "0.5rem",
                    color: "#444A",
                    textShadow: "1px 1px 1px #FFFA, -1px 1px 1px #FFFA, -1px -1px 1px #FFFA, 1px -1px 1px #FFFA",
                    "& > img": {
                        position: "absolute",
                        top: "0.25rem",
                        left: "0.5rem",
                        height: "1rem",
                    },
                    "& > span.dmg": {
                        color: "#F00",
                        fontSize: "0.9rem",
                        marginRight: "0.25rem",
                    },
                    "& > span.hull": {
                        color: "#222",
                        marginLeft: "0.25rem",
                        fontSize: "0.75rem",
                    },
                },
                "& > .shields": {
                    right: "0",
                    width: "50%",
                    bottom: "0",
                    height: "2rem",
                    position: "absolute",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    background: "linear-gradient(-90deg, #00F8, #0008 1.75rem, #0005 2rem, #0005 95%, #000A 100%)",
                    color: "#FFFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "0.3rem",
                    paddingRight: "1.75rem",
                    borderTopLeftRadius: "0.5rem",
                    borderBottomRightRadius: "0.5rem",
                    borderTop: "ridge 3px #0004",
                    textShadow: "1px 1px 1px #FFFA, -1px 1px 1px #FFFA, -1px -1px 1px #FFFA, 1px -1px 1px #FFFA",
                    "& > img": {
                        position: "absolute",
                        top: "0.25rem",
                        right: "0.5rem",
                        height: "1rem",
                    },
                    "& > span.shd": {
                        color: "#00F",
                        fontSize: "1rem",
                        marginRight: "0.25rem",
                    },
                    "& > span.max": {
                        color: "#222",
                        marginLeft: "0.25rem",
                        fontSize: "0.75rem",
                    },
                },
                "&.destroyed": {
                    boxShadow: "inset 0 0 1rem 0.5rem #F008",
                    "&:after": {
                        color: "red",
                        content: '"X"',
                        zIndex: "100",
                        position: "absolute",
                        fontSize: "6rem",
                        fontWeight: "bold",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                        opacity: "0.8",
                        transform: "rotate(-20deg)",
                    },
                },
            },
        },
        combatStats: {
            color: "#FFFA",
            "& div.ship": {
                width: "auto",
                marginBottom: "0.5rem",
                padding: "0.25rem",
                borderTop: "solid 1px #0008",
                "& div.total": {
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    borderBottom: "solid 1px #0004",
                    padding: "0.25rem 0",
                },
                "& div.header": {
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "uppercase"

                },
                "& div.weapons": {
                    fontWeigth: "bold",
                    fontSize: "1rem",
                    "& > div.weapon:nth-child(odd)": {
                        background: "#0003",
                    },
                    "& > div.weapon:nth-child(even)": {
                        background: "#FFF1",
                    }
                },
                "& div.row": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    "& > div": {
                        margin: "0 0.5rem",

                        "&.name": {
                            flex: "1 1 auto",
                        },
                        "&.dmg": {
                            flex: "0 0 auto",
                            width: "5rem",
                        },
                        "&.hits": {
                            flex: "0 0 auto",
                            width: "5rem",
                        },
                        "&.shots": {
                            flex: "0 0 auto",
                            width: "5rem",
                        },
                        "&.faction": {
                            flex: "0 0 auto",
                            width: "25rem",
                        },
                        "&.shipclass": {
                            flex: "0 0 auto",
                            width: "15rem",
                        },
                    },
                },
            },
        },
    })
);

interface Props {
    combatReport: CombatReport;
}

const CombatViewer: FC<Props> = (props) => {
    const classes = useStyles();
    const [round, setRound] = useState<number>(0);
    const [game] = useService<GameModel>(SERVICEID.GameService);

    if (!game) return null;

    const star = getSystemById(game, props.combatReport.systemId);

    if (!star) return null;

    const factions = game.factions.filter((fm: FactionModel) => {
        return props.combatReport.factionIds.includes(fm.id);
    });

    const roundLog = props.combatReport.rounds[round - 1];

    const showStats = round === props.combatReport.rounds.length + 1;

    const lastRoundStatus = props.combatReport.rounds[props.combatReport.rounds.length - 1].status;

    return (
        <div className={classes.root}>
            <header>
                <h1>
                    <small>Conflict in</small>
                    {star.name}
                </h1>
                <div className="factions">
                    {factions.map((fm: FactionModel) => {
                        return (
                            <div className="faction" key={fm.id} style={{ background: fm.color }}>
                                <img src={require(`../images/symbols/${fm.iconFileName}`)} />
                                <div className="versus">vs.</div>
                            </div>
                        );
                    })}
                </div>
                <h2>
                    {round > 0 && !showStats && (
                        <>
                            Round {round} / {props.combatReport.rounds.length}
                        </>
                    )}
                    {showStats && <>Statistics</>}
                    {round === 0 && <>{props.combatReport.rounds.length} rounds</>}
                </h2>
            </header>

            {round === 0 && (
                <div className="main">
                    <h1>Conflict Summary</h1>

                    <div className={classes.factionsInSummary}>
                        {factions.map((fm: FactionModel) => {
                            const units = props.combatReport.origUnits.filter((u: ShipUnit) => u.factionId === fm.id);
                            const totalFleetSize = units.reduce((tot: number, u: ShipUnit) => tot + u.sizeIndicator, 0);
                            return (
                                <div key={fm.id} className="faction">
                                    <header>
                                        <div className="logo" style={{ background: fm.color }}>
                                            <img src={require(`../images/symbols/${fm.iconFileName}`)} />
                                        </div>
                                        <h2 style={{ fontFamily: fm.style.fontFamily || "Arial" }}>{fm.name}</h2>
                                        <div className="fleetSize">{totalFleetSize}</div>
                                    </header>

                                    {units.map((u: ShipUnit) => {
                                        const status = lastRoundStatus.find(
                                            (st: CombatRoundStatus) => st.unitId === u.id
                                        );
                                        const destroyed = status === undefined || status.damage >= u.hull;
                                        return (
                                            <div key={u.id} className="unit">
                                                <div className="shipName">
                                                    <h4>{u.typeClassName}</h4>
                                                    <h3>{u.name}</h3>
                                                </div>

                                                <div>{u.sizeIndicator}</div>

                                                {status !== undefined && status.damage > 0 && !destroyed && (
                                                    <div className="damage">
                                                        <span className="dmg">{status.damage}</span> /{" "}
                                                        <span className="hull">{status.hull}</span>
                                                    </div>
                                                )}
                                                {status !== undefined && status.damage === 0 && (
                                                    <h2 className="nodamage">No damage</h2>
                                                )}
                                                {destroyed && <h2 className="destroyed">Destroyed</h2>}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {round > 0 && !showStats && roundLog && (
                <div className="main">
                    <div className={classes.roundStatus}>
                        {roundLog.status.map((status: CombatRoundStatus) => {
                            const unit = props.combatReport.origUnits.find((u: ShipUnit) => u.id === status.unitId);
                            if (!unit) return null;
                            const faction = factions.find((f: FactionModel) => f.id === unit.factionId);
                            if (!faction) return null;

                            return (
                                <div
                                    className={`ship${status.destroyed ? " destroyed" : ""}`}
                                    key={`unit-status-${status.unitId}`}
                                    style={{ background: faction.color }}
                                >
                                    <h4>
                                        <small>{unit.typeClassName}</small>
                                        {unit.name}
                                    </h4>

                                    <Dots
                                        max={10}
                                        dots={unit.sizeIndicator}
                                        size="sm"
                                        style={{
                                            width: "8rem",
                                            position: "absolute",
                                            top: "0.25rem",
                                            right: "0.25rem",
                                        }}
                                    />

                                    <p style={{ fontFamily: faction.style.fontFamily || "Arial" }}>{faction.name}</p>
                                    <div className="damage">
                                        <IconHull />
                                        <span className="dmg">{status.damage}</span> /{" "}
                                        <span className="hull">{unit.hull}</span>
                                    </div>
                                    <div className="shields">
                                        <IconShields />
                                        <span className="shd">{status.shields}</span> /{" "}
                                        <span className="max">{unit.shieldsMax}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={classes.attacks}>
                        {roundLog.attacks.map((attack: CombatRoundAttackReport, ind: number) => {
                            if (attack.result === "HIT") {
                                return (
                                    <AttackReport
                                        attack={attack}
                                        game={game}
                                        report={props.combatReport}
                                        factions={factions}
                                    />
                                );
                            }
                            if (attack.result === "MISS") {
                                return (
                                    <MissReport
                                        attack={attack}
                                        game={game}
                                        report={props.combatReport}
                                        factions={factions}
                                    />
                                );
                            }
                            if (attack.result === "RELOAD") {
                                return (
                                    <ReloadReport
                                        attack={attack}
                                        game={game}
                                        report={props.combatReport}
                                        factions={factions}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            )}
            {showStats && <CombatStatistics game={game} factions={factions} report={props.combatReport} />}

            <footer>
                <Button variant="contained" onClick={() => setRound((prev: number) => prev - 1)} disabled={round <= 0}>
                    {round > 1 ? "Prev round" : "Summary"}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setRound((prev: number) => prev + 1)}
                    disabled={round > props.combatReport.rounds.length}
                >
                    {round === 0
                        ? "Show First round"
                        : round === props.combatReport.rounds.length
                        ? "Statistics"
                        : "Next Round"}
                </Button>
            </footer>
        </div>
    );
};

interface AttackProps {
    report: CombatReport;
    attack: CombatRoundAttackReport;
    game: GameModel;
    factions: FactionModel[];
}
const AttackReport: FC<AttackProps> = (props) => {
    const classes = useStyles();
    const attacker = props.report.origUnits.find((u: ShipUnit) => u.id === props.attack.attacker);
    const target = props.report.origUnits.find((u: ShipUnit) => u.id === props.attack.target);
    if (!attacker || !target) return null;

    const attackFaction = props.factions.find((fm: FactionModel) => fm.id === attacker.factionId);
    const targetFaction = props.factions.find((fm: FactionModel) => fm.id === target.factionId);

    if (!attackFaction || !targetFaction) return null;

    return (
        <div className={classes.attackReport}>
            <div className="attacker" style={{ background: attackFaction.color }}>
                <h3>
                    <small>{attacker.typeClassName}</small>
                    {attacker.name}
                </h3>
                {/* <p style={{ fontFamily: attackFaction.style.fontFamily || "Arial" }}>{attackFaction.name}</p> */}
            </div>

            <div className="weapon">{props.attack.weapon}</div>

            <div className="hitroll">
                <span>{props.attack.hitRoll} </span>
                <small>{props.attack.hitTarget}</small>
            </div>

            <div className="damage">{props.attack.damage}</div>

            <div className="target" style={{ background: targetFaction.color }}>
                <h3>
                    <small>{target.type}</small>
                    {target.name}
                </h3>
                {/* <p style={{ fontFamily: targetFaction.style.fontFamily || "Arial" }}>{targetFaction.name}</p> */}
            </div>
        </div>
    );
};

const MissReport: FC<AttackProps> = (props) => {
    const classes = useStyles();
    const attacker = props.report.origUnits.find((u: ShipUnit) => u.id === props.attack.attacker);
    const target = props.report.origUnits.find((u: ShipUnit) => u.id === props.attack.target);
    if (!attacker || !target) return null;

    const attackFaction = props.factions.find((fm: FactionModel) => fm.id === attacker.factionId);
    const targetFaction = props.factions.find((fm: FactionModel) => fm.id === target.factionId);

    if (!attackFaction || !targetFaction) return null;

    return (
        <div className={classes.attackReport}>
            <div className="attacker" style={{ background: attackFaction.color }}>
                <h3>
                    <small>{attacker.typeClassName}</small>
                    {attacker.name}
                </h3>
                {/* <p style={{ fontFamily: attackFaction.style.fontFamily || "Arial" }}>{attackFaction.name}</p> */}
            </div>

            <div className="weapon">{props.attack.weapon}</div>

            <div className="hitroll miss">
                <span>{props.attack.hitRoll} </span>
                <small>{props.attack.hitTarget}</small>
            </div>

            <div className="damage">MISS</div>

            <div className="target" style={{ background: targetFaction.color }}>
                <h3>
                    <small>{target.type}</small>
                    {target.name}
                </h3>
                {/* <p style={{ fontFamily: targetFaction.style.fontFamily || "Arial" }}>{targetFaction.name}</p> */}
            </div>
        </div>
    );
};

const ReloadReport: FC<AttackProps> = (props) => {
    const classes = useStyles();
    const attacker = props.report.origUnits.find((u: ShipUnit) => u.id === props.attack.attacker);
    // const target = props.report.units.find((u: ShipUnit) => u.id === props.attack.target);
    if (!attacker) return null;

    const attackFaction = props.factions.find((fm: FactionModel) => fm.id === attacker.factionId);
    // const targetFaction = props.factions.find((fm: FactionModel) => fm.id === target.factionId);

    if (!attackFaction) return null;

    return (
        <div className={classes.attackReport}>
            <div className="attacker" style={{ background: attackFaction.color }}>
                <h3>
                    <small>{attacker.typeClassName}</small>
                    {attacker.name}
                </h3>
                {/* <p style={{ fontFamily: attackFaction.style.fontFamily || "Arial" }}>{attackFaction.name}</p> */}
            </div>

            <div className="weapon">{props.attack.weapon}</div>

            <div className="reload">
                RELOAD! {props.attack.hitRoll} turn{props.attack.hitRoll > 1 ? "s" : ""}
            </div>
        </div>
    );
};

interface StatProps {
    report: CombatReport;
    game: GameModel;
    factions: FactionModel[];
}

const CombatStatistics: FC<StatProps> = (props) => {
    const classes = useStyles();

    let shipDamage = new Map<string, number>();
    let shipHits = new Map<string, number>();
    let shipShots = new Map<string, number>();
    let weaponDamage = new Map<string, number>();
    let weaponShots = new Map<string, number>();
    let weaponHits = new Map<string, number>();

    function addValToMap(m: Map<string, number>, key: string, val: number): Map<string, number> {
        if (!m.has(key)) {
            m.set(key, 0);
        }
        const cur = m.get(key);
        if (cur !== undefined) {
            m.set(key, cur + val);
        }
        return new Map(m);
    }

    props.report.rounds.forEach((r: CombatRoundReport) => {
        r.attacks.forEach((ra: CombatRoundAttackReport) => {
            shipShots = addValToMap(shipShots, ra.attacker, 1);
            weaponShots = addValToMap(weaponShots, ra.weaponId, 1);
            if (ra.result === "HIT") {
                shipDamage = addValToMap(shipDamage, ra.attacker, ra.damage);
                shipHits = addValToMap(shipHits, ra.attacker, 1);
                weaponDamage = addValToMap(weaponDamage, ra.weaponId, ra.damage);
                weaponHits = addValToMap(weaponHits, ra.weaponId, 1);
            }
        });
    });

    // const dataSet

    return (
        <div className="main">
            <div className={classes.combatStats}>
                <h2>Statistics</h2>

                <div className="ship">
                    <div className="header row">
                        <div className="name">Name</div>
                        <div className="shipclass">Class</div>
                        <div className="faction">Faction</div>
                        <div className="dmg">Damage</div>
                        <div className="shots">Shots</div>
                        <div className="hits">Hits</div>
                    </div>
                </div>

                {props.report.origUnits.map((ship: ShipUnit) => {
                    const dmg = shipDamage.get(ship.id) || 0;
                    const shots = shipShots.get(ship.id) || 0;
                    const hits = shipHits.get(ship.id) || 0;
                    const faction = getFactionFromArrayById(props.factions, ship.factionId);
                    if (!faction) return null;
                    return (
                        <div key={ship.id} className="ship">
                            <div className="total row" style={{background: faction.color}}>
                                <div className="name">{ship.name}</div>
                                <div className="shipclass">{ship.typeClassName}</div>
                                <div className="faction" style={{fontFamily: faction.style.fontFamily}}>{faction.name}</div>
                                <div className="dmg">{dmg}</div>
                                <div className="shots">{shots}</div>
                                <div className="hits">{hits}</div>
                            </div>
                            <div className="weapons ">
                                {ship.weapons.map((w: ShipWeapon) => {
                                    const wdmg = weaponDamage.get(w.id) || 0;
                                    const whits = weaponHits.get(w.id) || 0;
                                    const wshots = weaponShots.get(w.id) || 0;

                                    return (
                                        <div className="weapon row">
                                            <div className="name">{w.name}</div>
                                            <div className="dmg">{wdmg}</div>
                                            <div className="shots">{wshots}</div>
                                            <div className="hits">{whits}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CombatViewer;
