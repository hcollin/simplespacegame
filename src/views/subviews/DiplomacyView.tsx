import { makeStyles, Theme, createStyles, TextField, Slider, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import ChatView from "../../components/ChatView";
import { Trade } from "../../models/Communication";
import { FactionModel, GameModel } from "../../models/Models";
import { doTradeAgreement } from "../../services/commands/GameCommands";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            width: "100%",
            height: "100vh",
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #302 4px, #201 16px)",
            minHeight: "100vh",
            padding: "2rem",
            "& > div.page": {
                marginTop: "4rem",
                padding: "1rem",
                background: "#444D",
                color: "#FFFE",
                borderRadius: "1rem",
                width: "calc(100% - 28rem)",
                "& div.columns": {
                    display: "flex",
                    flexDirection: "row"
                }
            },

        },
        factions: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "6rem",
            borderRight: "ridge 4px #0008",

            "& > div.faction": {
                width: "4rem",
                margin: "0.5rem 0",
                padding: "0.5rem",
                borderRadius: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid 2px #0008",
                boxShadow: "inset 0 0 1rem 0.25rem #0008",
                "& > img": {
                    width: "3rem",

                },
                "&.active": {
                    border: "solid 2px white",
                    // boxShadow: "0 0 1rem 0.25rem #0008",
                }

            }
        },
        factionChat: {
            flex: "1 1 auto",
            padding: "0 1rem",

            "& div.largemessages": {
                "& > .messages": {
                    height: "60vh",
                }

            }
        },
        trade: {
            flex: "1 1 auto",
            padding: "0 1rem",
            borderRight: "ridge 4px #0004",
        }
    }));


const DiplomacyView: FC = () => {
    const classes = useStyles();
    const [game] = useService<GameModel>("GameService")
    const faction = useCurrentFaction();


    


    const [targetFaction, setTargetFaction] = useState<FactionModel | null>(null);

    useEffect(() => {


        setTargetFaction((prev: FactionModel|null) => {
            if(prev === null) return prev;
            if(faction === null) return null;
            if(prev.id === faction.id) return null;
            return prev;
        })

    }, [faction])

    if (!game || !faction) return null;

    function switchFaction(fm: FactionModel) {
        setTargetFaction((prev: FactionModel | null) => {
            if (prev === null) return fm;
            if (prev.id === fm.id) return null;
            return fm;
        });
    }

    const activeTrades = game.trades.filter((t: Trade) => targetFaction && ((t.from === targetFaction.id && t.to === faction.id) || (t.from === faction.id && t.to === targetFaction.id)));

    const totalTradeValue = activeTrades.reduce((sum: number, t: Trade) => {
        if(t.to === faction.id) {
            return sum + t.money;
        }
        if(t.from === faction.id) {
            return sum - t.money;
        }
        return sum;
    }, 0)

    return (
        <div className={classes.root}>
            <div className="page">
                <h1>Diplomacy</h1>

                <div className="columns">
                    <div className={classes.factions}>
                        {game.factions.map((fm: FactionModel) => {
                            if (fm.id === faction.id) return null;
                            return (<div className={`faction ${targetFaction && targetFaction.id === fm.id ? "active" : ""}`} style={{ backgroundColor: fm.color }} onClick={() => switchFaction(fm)}>
                                <img src={require(`../../images/symbols/${fm.iconFileName}`)} alt={`faction ${fm.name} logo`} />
                            </div>)
                        })}
                    </div>

                    {targetFaction !== null && <div className={classes.trade}>
                        <h2>{targetFaction.name}</h2>

                        <h3>Active Trades</h3>

                        {activeTrades.length === 0 && <p>No active trades with {targetFaction.name}</p>}
                        {activeTrades.map((trade: Trade) => {
                            return (
                                <div className="trade" key={trade.id}>
                                    <p>From: {trade.from}</p>
                                    <p>To: {trade.to}</p>
                                    <p>Money: {trade.money}</p>
                                    <p>Turns left: {trade.length}</p>
                                </div>
                            )
                        })}

                        <p>Total trade value {totalTradeValue}.</p>

                        <h3>Create trade</h3>

                        <TradeCreator targetFaction={targetFaction} />


                    </div>}

                    <div className={classes.factionChat}>
                        {targetFaction === null && <h2>Global Discussion</h2>}
                        {targetFaction !== null && <h2>Private Discussion</h2>}

                        <ChatView other={targetFaction ? targetFaction.id : "_GLOBAL"} className="largemessages" />
                    </div>


                </div>
            </div>
        </div>
    )
}

interface TradeCreatorProps {
    targetFaction: FactionModel;
}


const TradeCreator: FC<TradeCreatorProps> = (props) => {


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
                message: "Greetings partner!"
            };

            doTradeAgreement(t);


        }

    }

    return <div>
        <p>How much money are you sending?</p>
        <TextField value={money} onChange={handleChangeMoney} type="number" variant="filled" label="Money" color="primary" />

        <p>How many turns is this trade valid?</p>
        <Slider value={turns} min={1} max={10} step={1} valueLabelDisplay="auto" marks={[{ value: 1, label: "1 turn" }, { value: 5, label: "5 turns" }, { value: 10, label: "10 turns" }]} aria-label="Turns" onChange={handleChangeTurns} />

        <Button variant="contained" color="primary" onClick={createTrade}>Create</Button>
    </div>
}

export default DiplomacyView;