import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { DATATECHNOLOGY } from "../data/dataTechnology";
import { FactionModel, Technology, TechnologyField } from "../models/Models";
import { missingResearchPoints } from "../utils/techUtils";
import { TechFieldIcon } from "../views/subviews/ScienceView";
import { IconResearchPoint } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            margin: "0.5rem",
            border: "solid 2px #0008",
            width: "25rem",
            borderRadius: "0.5rem",
            minHeight: "8rem",
            boxShadow: "inset 0 0 0.25rem 0.25rem #FFF2",
            background: "#333D",
            userSelect: "none",

            "&.size-1": {
                minHeight: "8rem",
            },
            "&.size-2": {
                minHeight: "8rem",
            },
            "&.size-3": {
                minHeight: "8rem",
            },
            "&.size-4": {
                minHeight: "10rem",
            },
            "&.size-5": {
                minHeight: "12rem",
            },
            "&.size-6": {
                minHeight: "14rem",
            },

            "& > h1": {
                fontSize: "1rem",
                position: "relative",
                padding: "0.25rem 0.5rem",
                margin: 0,
                width: "calc(100% - 5.5rem)",
                background: "#CDF2",
                borderBottom: "solid 2px #0006",
            },
            "& > p": {
                fontSize: "0.8rem",
                position: "relative",
                padding: "0.25rem 0.5rem",
                margin: 0,
                width: "calc(100% - 5rem)",
            },

            "& >div.prereqtech": {
                left: "0",
                bottom: "0",
                position: "absolute",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                padding: "0.25rem 0.75rem 0.25rem 0.25rem",
                background: "#2109",
                borderTopRightRadius: "1rem",
                fontStyle: "italic",
                fontWeight: "bold",
                borderTop: "solid 1px #FFF3",
                borderRight: "solid 2px #FFF3",
            },

            "& > div.fieldreqs": {
                top: "0",
                right: "0",
                width: "5.5rem",
                display: "flex",
                position: "absolute",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingRight: "0.5rem",
                height: "100%",
                borderLeft: "solid 2px #0008",
                background: "#0003",
                flexDirection: "column",

                "& > div": {
                    marginBottom: "0.25rem",
                    padding: "0 0.25rem",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",

                    "& > img": {
                        height: "1.5rem",
                    },

                    "&.missing": {
                        color: "#F44A",
                    },
                },
            },

            "& > div.underResearch": {
                background: "#0488",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 2rem 1rem #222A",
                
            },
        },
    })
);

interface TechCardProps {
    tech: Technology;
    faction: FactionModel;
    className?: string;
    onClick?: (tech: Technology) => void;
    highlightMissing?: boolean;
    underResearch?: boolean;
}

const TechCard: FC<TechCardProps> = (props) => {
    const classes = useStyles();

    const prereqtechNames: string[] = props.tech.techprereq.map((tid: string) => {
        const t = DATATECHNOLOGY.find((tech: Technology) => tech.id === tid);
        if (!t) {
            throw new Error(`Unknown technology ${tid} as prerequisite on ${props.tech.id}`);
        }

        return t.name;
    });

    function click() {
        if (props.onClick !== undefined) {
            props.onClick(props.tech);
        }
    }

    const missing = props.highlightMissing
        ? missingResearchPoints(props.tech, props.faction)
        : new Map<TechnologyField, number>();

    return (
        <div
            className={`${classes.root} size-${props.tech.fieldreqs.length}${
                props.underResearch === true ? " researching" : ""
            } ${props.className || ""}`}
            onClick={click}
        >
            <h1>{props.tech.name}</h1>
            <p>{props.tech.description}</p>
            {prereqtechNames.length > 0 && <div className="prereqtech">{prereqtechNames.join(", ")}</div>}
            <div className="fieldreqs">
                {props.tech.fieldreqs.map((req: [TechnologyField, number]) => {
                    const isMissing = missing.has(req[0]);

                    return (
                        <div className={`${isMissing ? "missing" : ""}`}>
                            <TechFieldIcon key={req[0]} field={req[0]} /> {req[1]}
                        </div>
                    );
                })}
            </div>
            {props.underResearch && (
                <div className="underResearch">
                    <IconResearchPoint size="xxl" wrapper="dark" />
                </div>
            )}
        </div>
    );
};

export default TechCard;
