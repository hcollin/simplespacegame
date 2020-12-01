import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import { ShipUnit, ShipWeapon } from "../models/Units";
import { getFactionById } from "../utils/factionJokiUtils";
import { getFactionAdjustedUnit, getRecycleProfit, unitIsAlreadyInCommand, unitIsBeingScrapped } from "../utils/unitUtils";
import {
    IconAccuracy,
    IconCooldown,
    IconCredit,
    IconDamage,
    IconFighter,
    IconHull,
    IconRecycle,
    IconShields,
    IconSpeed,
    IconTroops,
} from "./Icons";

import InfoIcon from "@material-ui/icons/Info";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import Repeat from "./Repeat";
import { unitIsMoving } from "../services/helpers/UnitHelpers";
import { doDisbandUnit, doRecycleUnit } from "../services/commands/UnitCommands";
import useMyCommands from "../hooks/useMyCommands";
import useCurrentFaction from "../services/hooks/useCurrentFaction";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: "0.5rem",
            border: "ridge 3px #FFF4",
            background: "linear-gradient(180deg, #000, #333 1rem, #333 calc(100% - 1rem), #000 100%)",
            overflow: "hidden",

            "& > header": {
                color: "white",
                textShadow: "2px 2px 2px #000,-2px 2px 2px #000,-2px -2px 2px #000,2px -2px 2px #000",
                display: "flex",
                // flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                // height: "3rem",
                position: "relative",
                paddingRight: "3rem",
                background: "linear-gradient(180deg, #000, #333 1rem, #333 calc(100% - 1rem), #000 100%)",

                "& h1": {
                    fontSize: "1rem",
                    margin: 0,
                    padding: 0,
                    [theme.breakpoints.down("md")]: {},
                    [theme.breakpoints.up("lg")]: {},
                },
                "& h2": {
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    margin: 0,
                    padding: 0,
                },
                "& > div": {
                    "&.name": {
                        borderBottomRightRadius: "2rem",
                        padding: "0.25rem 0.5rem 0.25rem 3rem",
                        position: "relative",
                        boxShadow: "inset 0 0 0.5rem 3px #0008",
                        "& > img": {
                            textAlign: "center",
                            marginRight: "0.5rem",
                            height: "2rem",
                            width: "2rem",
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                        },
                    },
                    "&.state": {
                        textAlign: "right",
                        paddingRight: "0.5rem",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        height: "100%",

                        "& > span": {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderLeft: "solid 1px #000",
                            height: "100%",
                            "& > img": {
                                marginRight: "0.5rem",
                            },
                            [theme.breakpoints.down("md")]: {
                                fontSize: "0.7rem",
                                padding: "0 0.25rem",
                                "&.troops": { display: "none" },
                            },
                            [theme.breakpoints.up("lg")]: {
                                fontSize: "1rem",
                                padding: "0 0.5rem",
                                "&.troops": { display: "flex" },
                            },
                        },
                    },
                },

                "& > button": {
                    padding: "0.4rem",
                    height: "100%",
                    margin: 0,
                    minWidth: "auto",
                    borderTopLeftRadius: "50% 100%",
                    borderBottomLeftRadius: "50% 100%",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    position: "absolute",
                    right: 0,
                    top: 0,
                    borderLeft: "ridge 2px #FFF4",
                    background: "#24A4",
                },
                [theme.breakpoints.down("sm")]: {
                    flexDirection: "column",
                    height: "6rem",
                    "& > div": {
                        "&.name": {
                            width: "100%",
                        },
                        "&.state": {
                            width: "100%",
                        },
                    },
                },
                [theme.breakpoints.up("md")]: {
                    flexDirection: "row",
                    height: "3rem",
                    "& > div": {
                        "&.name": {
                            width: "20rem",
                        },
                        "&.state": {
                            width: "auto",
                        },
                    },
                },
            },

            "& > div.info": {
                padding: "0.5rem",

                "& div.row": {
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",

                    "& > div": {
                        flex: "1 1 auto",

                        "& h4": {
                            padding: 0,
                            margin: "0 0 0.5rem 0",
                        },
                    },
                },

                "& p.description": {
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                },

                "& div.iconMeter": {
                    display: "flex",
                    flexDirection: "row",
                    height: "3rem",
                    "& img": {
                        height: "2.5rem",
                        width: "2.5rem",

                        // "&.fighter": {
                        // 	marginRight: "-1rem",
                        // 	height: "3rem",
                        // 	width: "3rem",
                        // },
                        "&.slot": {
                            filter: "grayscale(1)",
                        },
                    },
                },

                "& div.weapon": {
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                    borderBottom: "solid 1px #0008",
                    paddingBottom: "0.25rem",

                    "& > div.name": {
                        flex: "0 0 auto",
                        width: "10rem",
                    },
                    "& > div.sml": {
                        flex: "0 0 auto",
                        width: "5rem",
                    },
                    "& > div.med": {
                        flex: "0 0 auto",
                        width: "8rem",
                    },
                    "& > div.auto": {
                        flex: "1 1 auto",
                    },
                },
                "& > div.unitActions": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                },
                [theme.breakpoints.down("sm")]: {
                    "& div.row": {
                        flexDirection: "column",
                        alignItems: "flex-start",
                    },
                    "& div.weapon": {
                        flexWrap: "wrap",
                    },
                },
                [theme.breakpoints.up("md")]: {
                    "& div.row": {
                        flexDirection: "row",
                        alignItems: "center",
                    },
                    "& div.weapon": {
                        flexWrap: "nowrap",
                    },
                },
            },
            [theme.breakpoints.down("sm")]: {
                width: "auto",
            },
            [theme.breakpoints.up("md")]: {
                width: "100%",
            },
        },
        mini: {
            height: "2rem",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "2rem",
            position: "relative",
            boxShadow: "inset 0 0 0.5rem 0.25rem #0008",
            "& > h1": {
                fontSize: "0.8rem",
                margin: 0,
                padding: 0,
            },
            "& > h2": {
                fontSize: "0.6rem",
                margin: 0,
                padding: 0,
            },
            "& > img": {
                height: "1.6rem",
                position: "absolute",
                top: "0.2rem",
                left: "0.2rem",
            },
        },
    })
);

interface MiniUnitInfoProps {
    unit: ShipUnit;
    onClick?: (unit: ShipUnit) => void;
    selected?: boolean;
    className?: string;
    recyclable?: boolean;
}

const MiniUnitInfo: FC<MiniUnitInfoProps> = (props) => {
    const classes = useStyles();
	const [comms, apsUsed, apsPool] = useMyCommands();
	const myFaction = useCurrentFaction();
    const faction = getFactionById(props.unit.factionId);

    const [infoState, setInfoState] = useState<boolean>(false);

	if(!myFaction) return null;

    function click() {
        if (props.onClick) {
            props.onClick(props.unit);
        }
    }

    const ship = getFactionAdjustedUnit(faction, props.unit);

    function toggleInfo(e: React.MouseEvent) {
        e.stopPropagation();
        setInfoState((prev: boolean) => !prev);
    }

    function recycle(e: React.MouseEvent) {
        e.stopPropagation();
        doRecycleUnit(props.unit.id);
    }

    function disband(e: React.MouseEvent) {
        e.stopPropagation();
        doDisbandUnit(props.unit.id);
    }

    const alreadyBeingScrapped = unitIsAlreadyInCommand(props.unit, comms);

    return (
        <div className={`${classes.root} ${props.className || ""}`} onClick={click}>
            <header>
                <div className="name" style={{ background: faction.color }}>
                    <img src={require(`../images/symbols/${faction.iconFileName}`)} alt={faction.name} />
                    <h2>{ship.typeClassName}</h2>
                    <h1>{ship.name}</h1>
                </div>

                <div className="state">
                    <span>
                        <IconHull /> {ship.hull - ship.damage} / {ship.hull}
                    </span>

                    <span>
                        <IconShields /> {ship.shields} / {ship.shieldsMax}
                    </span>

                    <span>
                        <IconSpeed /> {ship.speed}
                    </span>

                    <span className="troops">
                        <IconTroops /> {ship.troops}
                    </span>
                </div>
                <Button onClick={toggleInfo} color="default">
                    {infoState ? <CancelIcon /> : <InfoIcon />}
                </Button>
            </header>

            {infoState && (
                <div className="info">
                    <div className="row">
                        {ship.fightersMax > 0 && (
                            <div>
                                <h4>
                                    Fighters{" "}
                                    <small>
                                        {ship.fighters} / {ship.fightersMax}
                                    </small>
                                </h4>
                                <div className="iconMeter">
                                    <Repeat repeats={ship.fighters}>
                                        <IconFighter className="fighter" />
                                    </Repeat>
                                    <Repeat repeats={ship.fightersMax - ship.fighters}>
                                        <IconFighter className="fighter slot" />
                                    </Repeat>
                                </div>
                            </div>
                        )}
                        {ship.troops > 0 && (
                            <div>
                                <h4>
                                    Troops <small>{ship.troops}</small>
                                </h4>
                                <div className="iconMeter">
                                    <Repeat repeats={ship.troops}>
                                        <IconTroops />
                                    </Repeat>
                                </div>
                            </div>
                        )}
                    </div>

                    {ship.weapons.map((w: ShipWeapon) => {
                        const dmg = Array.isArray(w.damage) ? `${w.damage[0]} - ${w.damage[1]}` : w.damage;
                        return (
                            <div className="weapon">
                                <div className="name">{w.name}</div>
                                <div className="sml">
                                    <IconDamage /> {dmg}
                                </div>
                                <div className="sml">
                                    <IconAccuracy /> {w.accuracy}
                                </div>
                                <div className="sml">
                                    <IconCooldown /> {w.cooldownTime}
                                </div>
                                <div className="med">{w.type}</div>
                                <div className="auto">{w.special.join(", ")}</div>
                            </div>
                        );
                    })}

                    <p className="description">{ship.description}</p>

                    {myFaction.id === ship.factionId && <div className="unitActions">
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteForeverIcon />}
                            onClick={disband}
                            disabled={alreadyBeingScrapped !== undefined}
                        >
                            Disband
                        </Button>
                        {props.recyclable === true && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<IconRecycle />}
                                onClick={recycle}
                                disabled={alreadyBeingScrapped !== undefined || apsUsed >= apsPool}
                            >
                                {" "}
                                Recycle for {getRecycleProfit(props.unit)}
                                <IconCredit />
                            </Button>
                        )}
                    </div>}
                </div>
            )}
        </div>
    );
};

export default MiniUnitInfo;
