import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { DATATECHNOLOGY } from "../data/dataTechnology";
import { FactionModel, Technology, TechnologyField } from "../models/Models";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { canAffordTech, missingResearchPoints, techPrerequisitesFulfilled } from "../utils/techUtils";
import { TechFieldIcon } from "../views/subviews/ScienceView";

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
                textShadow: "2px 2px 2px black, -2px 2px 2px black, 2px -2px 2px black, -2px -2px 2px black",
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
                "&.canAfford": {
                    background: "#0808",
                    boxShadow: "inset 0 0 1rem 0.5rem #040",
                },
                "&.researched": {
                    background: "#0088",
                    boxShadow: "inset 0 0 1rem 0.5rem #004",
                },
                "& > .tech-req": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "2.25rem",
                    height: "1.5rem",
                    fontSize: "0.8rem",
                    position: "absolute",
                    padding: "0.25rem",
                    background: "#0004",
                    border: "solid 1px black",
                    borderRadius: "0.25rem",

                    "& > img": {
                        position: "relative",
                        width: "60%",
                    },
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

interface Props {
    onClick: (tech: Technology) => void;
}

const techAng = 50;

const TechCircle: FC<Props> = (props) => {
    const classes = useStyles();

    const faction = useCurrentFaction();

    if (!faction) return null;

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
                return (
                    <TechCircleItem
                        tech={t}
                        faction={faction}
                        angle={angle}
                        onClick={props.onClick}
                        level={0}
                        itemSize={itemSize - 1}
                        key={t.id}
                    />
                );
            })}
            {level1Tech.map((t: Technology, i: number, arr: Technology[]) => {
                const angle = (360 / arr.length) * i + (360 - 360 / arr.length);
                return (
                    <TechCircleItem
                        tech={t}
                        faction={faction}
                        angle={angle}
                        onClick={props.onClick}
                        level={1}
                        itemSize={itemSize * 2.05}
                        key={t.id}
                    />
                );
            })}
            {level2Tech.map((t: Technology, i: number, arr: Technology[]) => {
                const angle = (360 / arr.length) * i + (360 - (360 / arr.length) * 2.5);
                return (
                    <TechCircleItem
                        tech={t}
                        faction={faction}
                        angle={angle}
                        onClick={props.onClick}
                        level={2}
                        itemSize={itemSize * 3.1}
                        key={t.id}
                    />
                );
            })}
        </div>
    );
};

interface TechCircleItemProps {
    tech: Technology;
    faction: FactionModel;
    level: number;
    angle: number;
    itemSize: number;
    onClick: (tech: Technology) => void;
}

const TechCircleItem: FC<TechCircleItemProps> = (props) => {
    const classes = useStyles();
    const css: React.CSSProperties = {
        transform: `rotate(${props.angle}deg) translate(${props.itemSize}rem) rotate(-${props.angle}deg)`,
    };
    const researched = props.faction.technology.includes(props.tech.id);
    const preReqFullfilled = techPrerequisitesFulfilled(props.tech, props.faction);
    const missingRp = missingResearchPoints(props.tech, props.faction);
    const canAfford = canAffordTech(props.tech, props.faction);
    const statusClassName = researched
        ? "researched"
        : canAfford
        ? "canAfford"
        : preReqFullfilled
        ? "preReqFullfilled"
        : "";

    return (
        <div
            className={`tech level-${props.level} ${statusClassName}`}
            key={props.tech.id}
            style={css}
            onClick={() => props.onClick(props.tech)}
        >
            {preReqFullfilled &&
                !researched &&
                props.tech.fieldreqs.map(
                    (req: [TechnologyField, number], ir: number, reqArr: [TechnologyField, number][]) => {
                        const ang = ir * techAng + (270 - (reqArr.length - 1) * (techAng / 2));

                        const reqCss: React.CSSProperties = {
                            transform: `rotate(${ang}deg) translate(${3.5 - props.level * 0.5}rem) rotate(-${ang}deg)`,
                            color: missingRp.has(req[0]) ? "red" : "white",
                        };

                        return (
                            <span className={`tech-req`} style={reqCss} key={`${props.tech.id}-${req[0]}`}>
                                <TechFieldIcon field={req[0]} />
                                {req[1]}
                            </span>
                        );
                    }
                )}
            {props.tech.name}
        </div>
    );
};

export default TechCircle;
