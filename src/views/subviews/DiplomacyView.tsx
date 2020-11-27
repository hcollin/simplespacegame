import { makeStyles, Theme, createStyles, TextField, Slider, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import ChatView from "../../components/ChatView";
import { Trade } from "../../models/Communication";
import { FactionModel, GameModel } from "../../models/Models";
import { doTradeAgreement } from "../../services/commands/GameCommands";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { IconCredit } from "../../components/Icons";
import { GLOBALMESSAGEKEY } from "../../services/ChatService";
import { getFactionById } from "../../utils/factionJokiUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #302 4px, #201 16px)",
            // padding: "2rem",
            overflowY: "auto",

            "& > div.page": {
                marginTop: "4rem",

                background:
                    "linear-gradient(180deg, #000 0, #555 1.5rem, #999 3rem, #555 4.5rem, #444 94%, #555 96%, #444 98%, #000 100%)",
                color: "#FFFE",

                // width: "calc(100% - 18rem)",
                // border: "ridge 5px #FDF4",
                "& div.columns": {
                    display: "flex",
                    position: "relative",
                    paddingLeft: "6rem",
                },

                "& h3": {
                    borderTop: "solid 2px #0004",
                    padding: "0.5rem 0 0.25rem 0",
                    margin: "1rem 0 0 0",
                },
            },

            [theme.breakpoints.down("md")]: {
                padding: 0,
                paddingBottom: "4rem",
                right: "3rem",
                width: "auto",
                "& > div.page": {
                    border: "none",
                    width: "100%",
                    padding: "1rem",
                    borderRadius: 0,
                    "& div.columns": {
                        flexDirection: "column",
                    },
                },
            },
            [theme.breakpoints.up("lg")]: {
                padding: "2rem",
                "& > div.page": {
                    width: "calc(100% - 18rem)",
                    border: "ridge 5px #FDF4",
                    padding: "1rem",
                    borderRadius: "1rem",
                    "& div.columns": {
                        flexDirection: "row",
                    },
                },
            },
        },
        factions: {
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "6rem",
            borderRight: "ridge 4px #0008",
            borderTop: "ridge 4px #0008",
            top: 0,
            left: "-1rem",
            bottom: "-1rem",
            borderTopRightRadius: "0.5rem",
            background: "#1252",
            boxShadow: "inset 0 0 1rem 0.5rem #0004, 0 0.2rem 0.2rem 2px #0008",

            "& > div.faction": {
                width: "4rem",
                margin: "0.5rem 0",
                padding: "0.5rem",
                borderRadius: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid 2px #0008",
                boxShadow: "inset 0 0 1rem 0.25rem #0008, 0 0 1rem 0.5rem #0004",
                "& > img": {
                    width: "3rem",
                },
                "&.active": {
                    marginTop: "0.75rem",
                    border: "solid 2px #FFF8",
                    boxShadow:
                        "inset 0 0 1rem 0.25rem #0008, inset 0 0 2rem 0.5rem #FFF4, 0 0.1rem 0.5rem 0.25rem #0008",

                    // boxShadow: "0 0 1rem 0.25rem #0008",
                },
            },
        },
        factionChat: {
            flex: "1 1 auto",
            padding: "0 1rem",

            "& div.largemessages": {
                "& > .messages": {
                    height: "auto",
                    maxHeight: "60vh",
                    minHeight: "10vh",
                    boxShadow: "inset 0 0 2rem 0.5rem #0008",
                    background: "#0004",
                    border: "groove 3px #0004",
                },
            },
        },
        trade: {
            flex: "1 1 auto",
            // padding: "0 1rem",
            // borderRight: "ridge 4px #0004",
            "& .tradeItem": {
                border: "solid 2px #0008",
                borderRadius: "1rem",
                boxShadow: "inset 0 0 0.75rem 0.5px #0008",
                background: "#0002",

                "& > header": {
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "0.25rem 1rem",

                    "& > span.goods": {
                        display: "flex",
                        flexDirection: "row",

                        alignItems: "center",
                        justifyContent: "center",

                        fontSize: "2rem",
                        fontWeight: "bold",
                    },

                    "& > span.transaction": {
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",

                        alignItems: "center",
                        justifyContent: "center",

                        fontSize: "1.4rem",

                        "& > svg": {
                            margin: "0 1rem",
                        },
                    },

                    "& > span.turn": {
                        fontSize: "2rem",
                        "& > span": {
                            fontSize: "1rem",
                        },
                    },
                },
                "& > p": {
                    padding: "0 1rem",
                },
            },
            [theme.breakpoints.down("md")]: {
                padding: "1rem 0rem",
                borderBottom: "ridge 4px #0004",
            },
            [theme.breakpoints.up("lg")]: {
                padding: "0 1rem",
                borderRight: "ridge 4px #0004",
            },
        },
        tradeCreator: {
            "& > div.part": {
                "& > p": {
                    margin: "1rem 0 0 0",
                    fontStyle: "italic",
                },
                "& > div.inputWrapper": {
                    padding: "0 3rem",
                    "& .MuiSlider-markLabel": {
                        fontSize: "0.7rem",
                    },
                },
            },
        },
    })
);

const DiplomacyView: FC = () => {
    const classes = useStyles();
    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();

    const [targetFaction, setTargetFaction] = useState<FactionModel | null>(null);

    useEffect(() => {
        setTargetFaction((prev: FactionModel | null) => {
            if (prev === null) return prev;
            if (faction === null) return null;
            if (prev.id === faction.id) return null;
            return prev;
        });
    }, [faction]);

    if (!game || !faction) return null;

    function switchFaction(fm: FactionModel) {
        setTargetFaction((prev: FactionModel | null) => {
            if (prev === null) return fm;
            if (prev.id === fm.id) return null;
            return fm;
        });
    }

    const activeTrades = game.trades.filter(
        (t: Trade) =>
            targetFaction &&
            ((t.from === targetFaction.id && t.to === faction.id) ||
                (t.from === faction.id && t.to === targetFaction.id))
    );

    const totalTradeValue = activeTrades.reduce((sum: number, t: Trade) => {
        if (t.to === faction.id) {
            return sum + t.money;
        }
        if (t.from === faction.id) {
            return sum - t.money;
        }
        return sum;
    }, 0);

    return (
        <div className={classes.root}>
            <div className="page">
                <h1>Diplomacy</h1>

                <div className="columns">
                    <div className={classes.factions}>
                        {game.factions.map((fm: FactionModel) => {
                            if (fm.id === faction.id) return null;
                            return (
                                <div
                                    className={`faction ${targetFaction && targetFaction.id === fm.id ? "active" : ""}`}
                                    style={{ backgroundColor: fm.color }}
                                    onClick={() => switchFaction(fm)}
                                >
                                    <img
                                        src={require(`../../images/symbols/${fm.iconFileName}`)}
                                        alt={`faction ${fm.name} logo`}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {targetFaction !== null && (
                        <div className={classes.trade}>
                            <h2>{targetFaction.name}</h2>

                            <h3>Active Trades</h3>

                            {activeTrades.length === 0 && <p>No active trades with {targetFaction.name}</p>}
                            {activeTrades.map((trade: Trade) => {
                                const incoming = trade.to === faction.id;
                                const money = incoming ? trade.money : trade.money * -1;
                                const otherFaction = getFactionById(incoming ? trade.from : trade.to);
                                return (
                                    <div className={`tradeItem ${incoming ? "incoming" : "outgoing"}`} key={trade.id}>
                                        <header>
                                            <span className="goods">
                                                <IconCredit size="lg" /> {money}
                                            </span>
                                            {incoming && (
                                                <span className="transaction">
                                                    {otherFaction.name} <ArrowForwardIcon /> ME
                                                </span>
                                            )}
                                            {!incoming && (
                                                <span className="transaction">
                                                    ME <ArrowForwardIcon /> {otherFaction.name}
                                                </span>
                                            )}
                                            <span className="turn">
                                                {trade.length}
                                                <span> turns left</span>
                                            </span>
                                        </header>

                                        <p className="description">{trade.message}</p>
                                    </div>
                                );
                            })}

                            <p>Total trade value {totalTradeValue}.</p>

                            <h3>Create trade</h3>

                            <TradeCreator targetFaction={targetFaction} />
                        </div>
                    )}

                    <div className={classes.factionChat}>
                        {targetFaction === null && <h2>Global Discussion</h2>}
                        {targetFaction !== null && <h2>Private Discussion</h2>}

                        <ChatView
                            other={targetFaction ? targetFaction.id : GLOBALMESSAGEKEY}
                            className="largemessages"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface TradeCreatorProps {
    targetFaction: FactionModel;
}

const TradeCreator: FC<TradeCreatorProps> = (props) => {
    const classes = useStyles();

    const faction = useCurrentFaction();

    const [money, setMoney] = useState<number>(0);
    const [turns, setTurns] = useState<number>(1);

    if (faction === null) return null;

    const handleChangeMoney = (event: React.ChangeEvent<HTMLInputElement>) => {
        const n: number = Number.parseInt(event.target.value);
        setMoney(n);
    };

    const handleChangeTurns = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setTurns(Array.isArray(value) ? value[0] : value);
    };

    function createTrade() {
        if (faction) {
            const t: Trade = {
                id: "",
                from: faction.id,
                to: props.targetFaction.id,
                length: turns,
                money: money,
                researchPoints: 0,
                message: "Greetings partner!",
            };

            doTradeAgreement(t);
        }
    }

    return (
        <div className={classes.tradeCreator}>
            <div className="part">
                <p>How much money are you sending?</p>
                <div className="inputWrapper">
                    <TextField
                        value={money}
                        onChange={handleChangeMoney}
                        type="number"
                        variant="filled"
                        label="Money"
                        color="primary"
                    />
                </div>
            </div>
            <div className="part">
                <p>How many turns is this trade valid?</p>
                <div className="inputWrapper">
                    <Slider
                        value={turns}
                        min={1}
                        max={10}
                        step={1}
                        valueLabelDisplay="auto"
                        marks={[
                            { value: 1, label: "1 turn" },
                            { value: 5, label: "5 turns" },
                            { value: 10, label: "10 turns" },
                        ]}
                        aria-label="Turns"
                        onChange={handleChangeTurns}
                    />
                </div>
            </div>
            <Button variant="contained" color="primary" onClick={createTrade}>
                Create
            </Button>
        </div>
    );
};

export default DiplomacyView;
