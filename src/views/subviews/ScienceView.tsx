import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import { FactionModel, FactionTechSetting, GameModel, Technology, TechnologyField } from "../../models/Models";
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
import { canAffordTech, getTechValue } from "../../utils/techUtils";
import { IconResearchPoint } from "../../components/Icons";

import researchimg from "../../images/art/research.jpg";
import PageContainer from "../../components/PageContainer";
import { useService } from "jokits-react";
import { SERVICEID } from "../../services/services";


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
            // background: "repeating-linear-gradient(0deg, #000 0, #132 4px, #021 16px)",
            background:
                "repeating-linear-gradient(160deg, #000 0, #111 5px, #222 100px, #232 130px, #242 140px, #111 150px, #000 155px)",
            height: "100&",
            padding: "2rem",

            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(-135deg, #000A 20rem, transparent 50%, #000D 100%)",
            },

            "& > div.page": {
                position: "relative",
                zIndex: 10,
                marginTop: "4rem",
                padding: "1rem",
                background:
                    "linear-gradient(180deg, #000 0, #555 1.5rem, #999 3rem, #555 4.5rem, #444 94%, #555 96%, #444 98%, #000 100%)",
                color: "#FFFE",
                borderRadius: "1rem",
                width: "calc(100% - 18rem)",
                marginBottom: "6rem",
                border: "ridge 5px #DFD4",
                "& > header": {
                    position: "relative",
                    height: "10rem",
                    background: "#000",
                    backgroundImage: `url(${researchimg})`,
                    width: "100%",
                    backgroundPosition: "center",
                    // filter: "grayscale(0.4) sepia(0.7) hue-rotate(52deg)",
                    boxShadow: "inset 0 0 2em 1rem #000",
                    border: "ridge 5px #BD78",
                    borderBottom: "none",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 2rem 2rem 2rem",
                    "&:after": {
                        content: '""',
                        background: "linear-gradient(to bottom, transparent 75%, #0008 80%, #777E 97%, #555 100%)",
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "-5px",
                        right: "-5px",
                        zIndex: 0,
                        pointerEvents: "none",
                    },
                    "&>h1": {
                        padding: "2rem",
                        fontSize: "2.75rem",
                        color: "#FFFD",
                        letterSpacing: "0.25rem",
                        textShadow:
                            "0 0 1rem #BD7, 2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 4px #000,2px -2px 2px #000",
                        fontFamily: "Averia Serif Libre",
                        fontWeight: "normal",
                    },
                },
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
    const [game] = useService<GameModel>(SERVICEID.GameService);

    if (!faction || !game) return null;

    // const techFields = faction.technologyFields.sort((a: FactionTechSetting, b: FactionTechSetting) => a[2] - b[2]);

    const pointsGenerated = researchPointGenerationCalculator(game, faction);

    function researchTech(tech: Technology) {
        if (faction && tech) {
            doResearchTechCommand(tech, faction.id);
        }
    }

    const techs = [...DATATECHNOLOGY].sort((a: Technology, b:Technology) => {
        return getTechValue(a) - getTechValue(b);

    })

    return (
        <div className={classes.root}>
            <PageContainer image={researchimg} color="#BD7" font={faction.style.fontFamily}>
                <header>
                    <h1>Research & Technology</h1>
                    <div className="pointValue">
                        <IconResearchPoint size="xl" wrapper="dark" />
                        <h1>{pointsGenerated} </h1>
                        <span>/ turn</span>
                    </div>
                </header>

                <div className={classes.row}>
                    {faction.technologyFields.map((v: FactionTechSetting) => {
                        return (
                            <TechnologyFieldWrapper
                                field={v.field}
                                faction={faction}
                                key={v.field}
                                rpTotal={pointsGenerated}
                            />
                        );
                    })}
                </div>

                <h2>Technologies</h2>

                <div className={classes.technologyGrid}>
                    {techs.map((tech: Technology) => {
                        const owned = faction.technology.find((s: string) => s === tech.id) !== undefined;
                        const canAfford = canAffordTech(tech, faction);
                        const techClasses = `${owned ? "owned " : ""}${!owned && !canAfford ? "cannotAfford" : ""}`;
                        console.log(tech.name, canAfford, owned);
                        if (canAfford && !owned) {
                            console.log("Clickable", tech);
                            return (
                                <TechCard
                                    tech={tech}
                                    faction={faction}
                                    key={tech.id}
                                    className={techClasses}
                                    onClick={researchTech}
                                />
                            );
                        }
                        return <TechCard tech={tech} faction={faction} key={tech.id} className={techClasses} />;
                    })}
                </div>
            </PageContainer>
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

    const techF = props.faction.technologyFields.find((v: FactionTechSetting) => v.field === props.field);
    const rpDist = researchPointDistribution(props.rpTotal, props.faction);

    if (!techF) {
        throw new Error(`Invalid Technology Field ${props.field}`);
    }
    const index = props.faction.technologyFields.findIndex((tech: FactionTechSetting) => tech.field === props.field);
    if (index < 0) throw new Error(`Cannot find technology field ${props.field}`);
    const pointGen = rpDist[index];

    return (
        <div className={classes.TechnologyFieldWrapper}>
            <label>{props.field}</label>

            <TechFieldIcon field={props.field} className="techFieldIcon" />

            <div className="values">
                <p>Current Points</p>
                <h1>{techF.points} </h1>

                <p>Points / turn</p>
                <h2>+{pointGen}</h2>
            </div>
            <div className="buttons">
                <Button
                    variant="contained"
                    color={techF.priority === 3 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 3, props.faction.id)}
                >
                    High
                </Button>
                <Button
                    variant="contained"
                    color={techF.priority === 2 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 2, props.faction.id)}
                >
                    Medium
                </Button>
                <Button
                    variant="contained"
                    color={techF.priority === 1 ? "primary" : "default"}
                    onClick={() => doAdjustTechValues(props.field, 1, props.faction.id)}
                >
                    Low
                </Button>
                <Button
                    variant="contained"
                    color={techF.priority === 0 ? "primary" : "default"}
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
