import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { DATATECHNOLOGY } from "../data/dataTechnology";
import { FactionModel, Technology, TechnologyField } from "../models/Models";
import { TechFieldIcon } from "../views/subviews/ScienceView";

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

            "& > h1": {
                fontSize: "1rem",
                position: "relative",
                padding: "0.25rem 0.5rem",
                margin: 0,
                width: "calc(100% - 5rem)",
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
                width: "5rem",
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
                    padding: "0 0.25rem 0 0",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    "& > img": {
                        height: "1.5rem",
                    },
                },
            },
        },
    })
);

interface TechCardProps {
    tech: Technology;
    faction: FactionModel;
    className?: string;
    onClick?: (tech: Technology) => void;
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
        if(props.onClick !== undefined) {
            props.onClick(props.tech);
        }
    }

    return (
        <div className={`${classes.root} ${props.className || ""}`} onClick={click}>
            <h1>{props.tech.name}</h1>
            <p>{props.tech.description}</p>
            {prereqtechNames.length > 0 && <div className="prereqtech">{prereqtechNames.join(", ")}</div>}
            <div className="fieldreqs">
                {props.tech.fieldreqs.map((req: [TechnologyField, number]) => {
                    return (
                        <div>
                            <TechFieldIcon key={req[0]} field={req[0]} /> {req[1]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TechCard;
