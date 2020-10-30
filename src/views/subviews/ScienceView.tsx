import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import { FactionModel, FactionTechSetting, Technology, TechnologyField } from "../../models/Models";
import { doAdjustTechValues, doResearchTechCommand } from "../../services/commands/FactionCommands";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { researchPointDistribution, researchPointGenerationCalculator } from "../../utils/factionUtils";

import biologySvg from "../../images/techBiology.svg";
import physicsSvg from "../../images/techPhysics.svg";
import businessSvg from "../../images/techBusiness.svg";
import chemistrySvg from "../../images/techChemistry.svg";
import socialSvg from "../../images/techSocial.svg";
import informationSvg from "../../images/techInformation.svg";
import TechCard from "../../components/TechCard";
import { DATATECHNOLOGY } from "../../data/dataTechnology";
import { canAffordTech } from "../../utils/techUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            width: "100%",
            minHeight: "100vh",
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #132 4px, #021 16px)",
            height: "100&",
            padding: "2rem",

            "& > div.page": {
                position: "relative",
                marginTop: "4rem",
                padding: "1rem",
                background: "#444D",
                color: "#FFFE",
                borderRadius: "1rem",
                width: "calc(100% - 28rem)",
                marginBottom: "6rem",
            },
        },
        totalPoints: {
            top: "1rem",
            right: "1rem",
            position: "absolute",
            border: "solid 2px #0006",
            padding: "0.5rem 1rem",
            borderRadius: "40%",
            boxShadow: "inset 0 0 2rem 1rem #0808",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            "& > h1": {
                fontSize: "2rem",
                padding: "0 1rem",
                margin: 0,
            },
            "& > span": {
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "0",
                color: "#FFFA",
            },
        },
        row: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2rem",
        },
        technologyGrid: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            
            "& > div": {
                cursor: "pointer",
                "&.cannotAfford": {
                    opacity: 0.5,
                    cursor: "default",
                },
                
                "&.owned": {
                    filter: "sepia(0.9) hue-rotate(60deg)",
                    cursor: "default",
                    
                },
            },
            

            
        },
        TechnologyFieldWrapper: {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            padding: "3.5rem 0 0 0",
            boxShadow: "inset 0 0 2rem 1rem #000D",
            borderRadius: "1rem",

            "& > img.techFieldIcon": {
                position: "absolute",
                top: "0.5rem",
                left: "1rem",
                height: "3rem",
            },

            "& p": {
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: "bold",
                textAlign: "center",
            },

            "& h1, & h2": {
                textAlign: "center",
                margin: "0 0 1rem 0",
            },

            "& > label": {
                position: "absolute",
                top: "0.75rem",
                left: "3rem",
                right: 0,
                height: "1rem",
                fontSize: "1.5rem",
                textAlign: "center",
                fontWeight: "bold",
            },

            "& > div.values": {
                padding: "1rem",
            },
            "& > div.buttons": {
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                background: "#000B",
                borderBottomRightRadius: "1rem",
                borderTopLeftRadius: "1rem",
                "& > button": {
                    marginBottom: "0.25rem",
                    // padding: "0.25rem",
                },
            },
        },
    })
);

const ScienceView: FC = () => {
    const classes = useStyles();

    const faction = useCurrentFaction();

    if (!faction) return null;

    // const techFields = faction.technologyFields.sort((a: FactionTechSetting, b: FactionTechSetting) => a[2] - b[2]);

    const pointsGenerated = researchPointGenerationCalculator(faction);

    function researchTech(tech: Technology) {
        console.log("TECH", tech);
        if(faction && tech) {
            doResearchTechCommand(tech, faction.id);
        }
        

    }

    return (
        <div className={classes.root}>
            <div className="page">
                <h1>Research</h1>

                <div className={classes.totalPoints}>
                    <h1>{pointsGenerated} </h1>
                    <span>/ turn</span>
                </div>

                <div className={classes.row}>
                    {faction.technologyFields.map((v: FactionTechSetting) => {
                        return (
                            <TechnologyFieldWrapper
                                field={v[0]}
                                faction={faction}
                                key={v[0]}
                                rpTotal={pointsGenerated}
                            />
                        );
                    })}
                </div>

                <h2>Technologies</h2>

                <div className={classes.technologyGrid}>
                    {DATATECHNOLOGY.map((tech: Technology) => {
                        const owned = faction.technology.find((s: string) => s === tech.id) !== undefined;
                        const canAfford = canAffordTech(tech, faction);
                        const techClasses = `${owned ? "owned ": ""}${!owned && !canAfford ? "cannotAfford": ""}`;
                        if(canAfford && !owned) {
                            console.log("Clickable", tech);
                            return <TechCard tech={tech} faction={faction} key={tech.id} className={techClasses} onClick={researchTech} />;    
                        }
                        return <TechCard tech={tech} faction={faction} key={tech.id} className={techClasses}/>;
                    })}
                </div>
            </div>
        </div>
    );
};

interface TechFieldProps {
    field: TechnologyField;
    faction: FactionModel;
    rpTotal: number;
}

const TechnologyFieldWrapper: FC<TechFieldProps> = (props) => {
    const classes = useStyles();

    const techF = props.faction.technologyFields.find((v: FactionTechSetting) => v[0] === props.field);
    const rpDist = researchPointDistribution(props.rpTotal, props.faction);

    if (!techF) {
        throw new Error(`Invalid Technology Field ${props.field}`);
    }
    const index = props.faction.technologyFields.findIndex((tech: FactionTechSetting) => tech[0] === props.field);
    if (index < 0) throw new Error(`Cannot find technology field ${props.field}`);
    const pointGen = rpDist[index];

    return (
        <div className={classes.TechnologyFieldWrapper}>
            <label>{props.field}</label>

            <TechFieldIcon field={props.field} className="techFieldIcon" />

            <div className="values">
                <p>Current Points</p>
                <h1>{techF[1]} </h1>

                <p>Points / turn</p>
                <h2>+{pointGen}</h2>
            </div>
            <div className="buttons">
                <Button
                    variant="contained"
                    color={techF[2] === 3 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 3, props.faction.id)}
                >
                    High
                </Button>
                <Button
                    variant="contained"
                    color={techF[2] === 2 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 2, props.faction.id)}
                >
                    Medium
                </Button>
                <Button
                    variant="contained"
                    color={techF[2] === 1 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 1, props.faction.id)}
                >
                    Low
                </Button>
                <Button
                    variant="contained"
                    color={techF[2] === 0 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 0, props.faction.id)}
                >
                    None
                </Button>
            </div>
        </div>
    );
};

export interface TechFieldIconProps {
    field: TechnologyField;
    className?: string;
}

export const TechFieldIcon: FC<TechFieldIconProps> = (props) => {
    let image = "";
    switch (props.field) {
        case TechnologyField.BIOLOGY:
            image = biologySvg;
            break;
        case TechnologyField.PHYSICS:
            image = physicsSvg;
            break;
        case TechnologyField.BUSINESS:
            image = businessSvg;
            break;
        case TechnologyField.CHEMISTRY:
            image = chemistrySvg;
            break;
        case TechnologyField.SOCIOLOGY:
            image = socialSvg;
            break;
        case TechnologyField.INFORMATION:
            image = informationSvg;
            break;
    }

    if (image === "") return null;

    return <img src={image} alt={props.field} className={props.className || ""} />;
};

export default ScienceView;
