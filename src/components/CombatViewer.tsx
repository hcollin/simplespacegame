import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useState } from "react";
import { FactionModel, GameModel } from "../models/Models";
import { CombatReport, CombatRoundAttackReport, DetailReport } from "../models/Report";
import { ShipUnit } from "../models/Units";
import { getSystemById } from "../services/helpers/SystemHelpers";
import { SERVICEID } from "../services/services";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: "5rem",
            left: "10%",
            width: "80%",
            bottom: "5rem",
            minHeight: "5rem",
            zIndex: 2000,
            background: "#FFF",
            overflow: "hidden",

            "& > header": {
                padding: "1rem",
                borderBottom: "solid 1px black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                background: "#EEE",
                height: "7rem",
                "& > * ": {
                    margin: 0,
                    padding: 0,
                },
            },
            "& > footer": {
                padding: "1rem",
                borderTop: "solid 1px black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#EEE",
            },
            "& > div.main": {
                padding: "1rem",
                overflowY: "auto",
                position: "absolute",
                top: "7rem",
                bottom: "5rem",
                left: 0,
                right: 0,
            },
        },
        factionsInSummary: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            "& > div.faction": {
                padding: "1rem",
                flex: "1 1 auto",

                "& > div.unit": {
                    background: "#0001",
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    "& > h3": {
                        margin: 0,
                        padding: 0,
                    },
                    "& > h4": {
                        margin: 0,
                        padding: 0,
                    },
                },
            },
        },

        attackReport: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-around",
            marginBottom: "0.5rem",
            "& > .attacker": {
                width: "20rem",
                border: "solid 1px black",
                height: "4.5rem",
                padding: "0.5rem 1rem",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "5rem 0.75rem",
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "5rem 0.75rem",
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
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "13rem",
            },
            "& > .hitroll": {
                border: "ridge 4px #0008",
                background: "#DDDE",
                boxShadow: "inset 0 0 1rem 0.5rem #0008",
                width: "4.5rem",
                height: "4.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                margin: "0 1rem",
                position: "relative",
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
            },

            "& > .damage": {
                color: "white",
                width: "4rem",
                border: "ridge 3px #0008",
                height: "4rem",
                padding: "0.5rem 1rem",
                fontSize: "1.5rem",
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
                height: "4.5rem",
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

    return (
        <div className={classes.root}>
            <header>
                <h1>
                    <small>Conflict in</small>
                    <br />
                    {star.name}
                </h1>
                <h2>
                    Round {round} / {props.combatReport.rounds.length}
                </h2>
            </header>

            {round === 0 && (
                <div className="main">
                    <h1>Conflict Summary</h1>

                    <div className={classes.factionsInSummary}>
                        {factions.map((fm: FactionModel) => {
                            const units = props.combatReport.units.filter((u: ShipUnit) => u.factionId === fm.id);
                            return (
                                <div key={fm.id} className="faction">
                                    <h2>{fm.name}</h2>

                                    {units.map((u: ShipUnit) => {
                                        return (
                                            <div key={u.id} className="unit">
                                                <h3>{u.name}</h3>
                                                <h4>{u.type}</h4>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {round > 0 && roundLog && (
                <div className="main">
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
                    })}

                    {roundLog.messages.map((msg: string, ind: number) => {
                        return <p key={`id-${round}-${ind}`}>{msg}</p>;
                    })}
                </div>
            )}

            <footer>
                <Button variant="contained" onClick={() => setRound((prev: number) => prev - 1)} disabled={round <= 0}>
                    Prev Round
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setRound((prev: number) => prev + 1)}
                    disabled={round >= props.combatReport.rounds.length}
                >
                    Next Round
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
    const attacker = props.report.units.find((u: ShipUnit) => u.id === props.attack.attacker);
    const target = props.report.units.find((u: ShipUnit) => u.id === props.attack.target);
    if (!attacker || !target) return null;

    const attackFaction = props.factions.find((fm: FactionModel) => fm.id === attacker.factionId);
    const targetFaction = props.factions.find((fm: FactionModel) => fm.id === target.factionId);

    if (!attackFaction || !targetFaction) return null;

    return (
        <div className={classes.attackReport}>
            <div className="attacker" style={{ background: attackFaction.color }}>
                <h3>
                    <small>{attacker.type}</small>
                    {attacker.name}
                </h3>
                <p style={{ fontFamily: attackFaction.style.fontFamily || "Arial" }}>{attackFaction.name}</p>
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
                <p style={{ fontFamily: targetFaction.style.fontFamily || "Arial" }}>{targetFaction.name}</p>
            </div>
        </div>
    );
};

export default CombatViewer;
