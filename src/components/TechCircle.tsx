import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { DATATECHNOLOGY } from "../data/dataTechnology";
import { Technology } from "../models/Models";

const itemSize = 8;
const itemSize1 = 7;
const itemSize2 = 6;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            width: "1000px",
            height: "1000px",
            border: "ridge 5px #0008",
            boxShadow: "inset 0 0 2rem 1rem #000",
            margin: "3rem auto",
            borderRadius: "50%",
            "& > .ring": {
                position: "absolute",
                zIndex: 5,
                backgroundColor: "#FFF1",
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                // border: "solid 2px #0008",
                boxShadow: "inset 0 0 2rem 1rem #FFF2",
                "&.level-0": {
                    width: `${itemSize * 3}rem`,
                    height: `${itemSize * 3}rem`,
                    margin: `-${itemSize * 1.5}rem`,
                },
                "&.level-1": {
                    width: `${itemSize * 5.1}rem`,
                    height: `${itemSize * 5.1}rem`,
                    margin: `-${itemSize * 2.55}rem`,
                },
                "&.level-2": {
                    display: "none",
                    width: `${itemSize * 3}rem`,
                    height: `${itemSize * 3}rem`,
                    margin: `-${itemSize * 1.5}rem`,
                },
            },
            "& > .tech": {
                display: "flex",
                borderRadius: "50%",
                border: "ridge 3px #0008",

                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                boxShadow: "inset 0 0 1rem 0.5rem #000",
                zIndex: 10,
                "&.level-0": {
                    fontSize: "0.8rem",
                    width: `${itemSize}rem`,
                    height: `${itemSize}rem`,
                    margin: `-${itemSize / 2}rem`,
                    padding: `${itemSize / 8}rem`,
                    background: "#0008",
                },
                "&.level-1": {
                    fontSize: "0.7rem",
                    width: `${itemSize1}rem`,
                    height: `${itemSize1}rem`,
                    margin: `-${itemSize1 / 2}rem`,
                    padding: `${itemSize1 / 8}rem`,
                    background: "#0006",
                },
                "&.level-2": {
                    fontSize: "0.6rem",
                    width: `${itemSize2}rem`,
                    height: `${itemSize2}rem`,
                    margin: `-${itemSize2 / 2}rem`,
                    padding: `${itemSize2 / 8}rem`,
                    background: "#0004",
                },
            },
            "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderTop: "solid 500px #0803",
                borderBottom: "solid 500px #00C3",
                borderRight: "solid 500px #8003",
                borderLeft: "solid 500px #8803",
                borderRadius: "50%",
            },
        },
    })
);

const TechCircle: FC = () => {
    const classes = useStyles();

    const level0Tech = DATATECHNOLOGY.filter((t: Technology) => t.level === 0);
    const level1Tech = DATATECHNOLOGY.filter((t: Technology) => t.level === 1);
    const level2Tech = DATATECHNOLOGY.filter((t: Technology) => t.level === 2);

    return (
        <div className={classes.root}>
            <div className="ring level-0" />
            <div className="ring level-1" />
            <div className="ring level-2" />
            {level0Tech.map((t: Technology, i: number, arr: Technology[]) => {
                const angle = (360 / arr.length) * i;
                const css: React.CSSProperties = {
                    transform: `rotate(${angle}deg) translate(${itemSize - 1}rem) rotate(-${angle}deg)`,
                };
                return (
                    <div className={`tech level-0`} key={t.id} style={css}>
                        {t.name}
                    </div>
                );
            })}
            {level1Tech.map((t: Technology, i: number, arr: Technology[]) => {
                const angle = (360 / arr.length) * i + (360 - 360 / arr.length);
                const css: React.CSSProperties = {
                    transform: `rotate(${angle}deg) translate(${itemSize * 2}rem) rotate(-${angle}deg)`,
                };
                return (
                    <div className={`tech level-1`} key={t.id} style={css}>
                        {t.name}
                    </div>
                );
            })}
            {level2Tech.map((t: Technology, i: number, arr: Technology[]) => {
                const angle = (360 / arr.length) * i + (360 - (360 / arr.length) * 2.5);
                const css: React.CSSProperties = {
                    transform: `rotate(${angle}deg) translate(${itemSize * 3}rem) rotate(-${angle}deg)`,
                };
                return (
                    <div className={`tech level-2`} key={t.id} style={css}>
                        {t.name}
                    </div>
                );
            })}
        </div>
    );
};

export default TechCircle;
