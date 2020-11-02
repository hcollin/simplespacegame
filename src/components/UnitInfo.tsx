import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import { ShipUnit } from "../models/Units";
import { getFactionById } from "../utils/factionUtils";
import { IconHull, IconShields } from "./Icons";


import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            padding: 0,
            border: "solid 2px #0008",
            // background: "#0004",

            background: "#666",
            borderRadius: "0.5rem",
            width: "30rem",
            boxShadow: "inset 0 0 1rem 0.25rem #0044",

            "& h1, & h2, & h3, & h4": {
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",

            },

            "& > header": {
                margin: 0,
                background: "#0004",
                borderBottom: "solid 2px #0008",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "3rem",
                width: "100%",

                "& > div.logo": {
                    flex: "0 0 auto",
                    width: "3.5rem",
                    boxShadow: "inset 0 0 0.5rem 0.25rem #0008",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: "0.5rem",
                    height: "2.9rem",
                    "& > img": {
                        height: "2.5rem",
                        width: "2.5rem",
                    }
                },

                "& > h1": {
                    flex: "1 1 auto",
                    color: "#FFFD",
                    fontSize: "1.2rem",
                    padding: "0 0.5rem",
                    background: "linear-gradient(160deg, #0014 0, transparent 5rem )",
                    height: "3rem",
                    lineHeight: "3rem",

                },

                "& > div.class": {
                    fontSize: "0.9rem",
                    textAlign: "right",
                    padding: "0 0.5rem",
                    "& > label": {
                        margin: "-0.25rem 0 0 0",
                        padding: "0",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "#FFFB"
                    },

                    "& > h3": {
                        padding: 0,
                        margin: 0,
                    }
                }

            },

            "& > div.data": {
                background: "repeating-linear-gradient(#444D 3px, #222D 8px, #444D 10px)",
                color: "#FFFE",
                position: "relative",
                padding: "0.5rem",
                boxShadow: "inset 0 0 2rem 0.5rem #0008",
            },

            "& > div.condition": {
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                fontSize: "1.2rem",
                borderTop: "solid 1px #000",

                "& > div": {
                    flex: "1 1 auto",
                    padding: "0.5rem",
                    // borderRight: "groove 5px #0008",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    "&.infoButton": {
                        background: "#0009",
                        boxShadow: "inset 0 0 2rem 0.5rem #0008",
                        flex: "0 0 auto",
                        width: "3rem",
                        borderRight: "solid 2px #0008",
                        borderLeft: "solid 2px #0008",
                        padding: 0,

                        "& > button": {
                            padding: 0,
                            margin: 0,
                            height: "100%",
                            width: "100%",
                        }
                    },

                    "& > img": {
                        marginRight :"0.5rem",
                    }


                }
            },

            "&.selected": {
                fontWeight: "bold",
                color: "green",
            }
        }
    }));

interface UnitInfoProps {
    unit: ShipUnit;
    onClick?: (unit: ShipUnit) => void;
    selected?: boolean;
    className?: string;
}


const UnitInfo: FC<UnitInfoProps> = (props: UnitInfoProps) => {
    const classes = useStyles();
    const faction = getFactionById(props.unit.factionId);

    const [dataOpen , setDataOpen] = useState<boolean>(false);

    function click() {
        if (props.onClick) {
            props.onClick(props.unit);
        }
    }

    return (
        <div onClick={click} className={`${classes.root} ${props.selected ? " selected" : ""} ${props.className || ""}`}>
            <header style={{ borderBottom: `solid 2px ${faction.color}` }}>
                <div className="logo" style={{ backgroundColor: faction.color }}>
                    <img src={require(`../images/symbols/${faction.iconFileName}`)} alt={faction.name} />
                </div>
                <h1>{props.unit.name}</h1>
                <div className="class">
                    <label>class</label>
                    <h3>{props.unit.type}</h3>
                </div>
            </header>



            {dataOpen && <div className="data">
                Data
            </div>}


            <div className="condition" >
                <div style={{ borderTop: `solid 2px ${faction.color}` }}>
                    <IconHull size="lg" />{props.unit.hull - props.unit.damage} / {props.unit.hull} 
                </div>

                <div className="infoButton">
    <Button onClick={(e: React.MouseEvent) => {e.stopPropagation(); setDataOpen((prev: boolean) => !prev);}}>{dataOpen ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}</Button>
                </div>

                <div style={{ borderTop: `solid 2px ${faction.color}` }}>
                    <IconShields size="lg" />{props.unit.shields}
                </div>





            </div>

        </div>
    );
};

export default UnitInfo;
