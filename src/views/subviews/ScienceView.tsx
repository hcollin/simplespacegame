import { makeStyles, Theme, createStyles, Button, ButtonGroup } from "@material-ui/core";
import React, { FC, useState } from "react";
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
import materialSvg from "../../images/techMaterial.svg";
import TechCard from "../../components/TechCard";
import { DATATECHNOLOGY } from "../../data/dataTechnology";
import { canAffordTech, getTechValue, missingResearchPoints, techPrerequisitesFulfilled } from "../../utils/techUtils";
import { IconResearchPoint } from "../../components/Icons";

import researchimg from "../../images/art/research.jpg";
import PageContainer from "../../components/PageContainer";
import { useService } from "jokits-react";
import { SERVICEID } from "../../services/services";
import FilterButtons from "../../components/FilterButtons";
import useMyCommands from "../../hooks/useMyCommands";
import { CommandType, ResearchCommand } from "../../models/Commands";
import { doRemoveCommand } from "../../services/commands/SystemCommands";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            width: "100%",
            minHeight: "100vh",
            color: "#FFFD",
            // background: "repeating-linear-gradient(0deg, #000 0, #132 4px, #021 16px)",
            background:
                "repeating-linear-gradient(160deg, #000 0, #111 5px, #222 100px, #232 130px, #242 140px, #111 150px, #000 155px)",
            height: "100&",
            padding: "2rem",
            overflowY: "auto",

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
                "& > header": {
                    // "&:after": {
                    //     content: '""',
                    //     background: "linear-gradient(to bottom, transparent 75%, #0008 80%, #777E 97%, #555 100%)",
                    //     position: "absolute",
                    //     top: 0,
                    //     bottom: 0,
                    //     left: "-5px",
                    //     right: "-5px",
                    //     zIndex: 0,
                    //     pointerEvents: "none",
                    // },
                    // "&>h1": {
                    //     padding: "2rem",
                    //     fontSize: "2.75rem",
                    //     color: "#FFFD",
                    //     letterSpacing: "0.25rem",
                    //     textShadow:
                    //         "0 0 1rem #BD7, 2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 4px #000,2px -2px 2px #000",
                    //     fontFamily: "Averia Serif Libre",
                    //     fontWeight: "normal",
                    // },
                },
            },
            [theme.breakpoints.down("md")]: {
                padding: 0,
            },
        },
        row: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2rem",
            [theme.breakpoints.down("lg")]: {
                flexWrap: "wrap",
                justifyContent: "space-around",
            },
        },
        technologyGrid: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            margin: "2rem 0",

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

                "&.target": {},
            },
        },
        singleTechGrid: {
            width: "100%",
            margin: "2rem 0",
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: "row",
            boxShadow: "inset 0 0 3rem 1rem #000",
            border: "ridge 5px #BD7",

            "& > div.col": {
                flex: "1 1 auto",
                display: "flex",
                position: "relative",
                alignItems: "center",
                borderRight: "groove 3px #0004",
                flexDirection: "column",
                justifyContent: "flex-start",
                // paddingTop: "7rem",
                // paddingBottom: "2rem",
                // minWidth: "25%",
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

                "& > h3": {
                    textAlign: "center",
                    margin: "0",
                    textShadow: "2px 2px 2px #0008",
                    borderBottom: "groove 2px #0004",
                    width: "100%",
                    padding: "2rem 0 1rem 0",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "6rem",
                    background: "#0002",
                },

                "&.target": {
                    boxShadow: "inset 0 0 3rem 1rem #0004",

                    "& > .researchTarget": {
                        width: "90%",
                        margin: "2rem 0",
                        // fontSize: "1.3rem",
                        borderRadius: "1rem",
                        display: "block",
                        // padding: "2rem 0",
                        "& small": {
                            display: "block",
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                            fontWeight: "bold",
                        },
                    },
                },

                "&.prereq": {
                    boxShadow: "inset 0 0 3rem 1rem #0004",
                },
                "&.reqby": {
                    boxShadow: "inset 0 0 3rem 1rem #0004",
                },
            },
            [theme.breakpoints.down("lg")]: {
                flexDirection: "column",
                "& > div.col": {
                    paddingTop: "5rem",
                    paddingBottom: "2rem",
                    minWidth: "auto",
                    "& > h3": {
                        fontSize: "1rem",
                    },

                    "&.target": {
                        background: "linear-gradient(0deg, transparent, #666A 5%, #666A 95%, transparent 100%)",
                        "& > .researchTarget": {
                            padding: "0.5rem 0",
                            fontSize: "1rem",
                        },
                        "& > div": {
                            width: "auto",
                        },
                    },
                    "&.prereq": {
                        background: "linear-gradient(0deg, transparent, #3228 5%, #333A 95%, transparent 100%)",
                        "& > div": {
                            width: "auto",
                        },
                    },
                    "&.reqby": {
                        background: "linear-gradient(0deg, transparent, #333A 5%, #2328 95%, transparent 100%)",
                        "& > div": {
                            width: "auto",
                        },
                    },
                },
            },
            [theme.breakpoints.up("xl")]: {
                flexDirection: "row",
                "& > div.col": {
                    paddingTop: "7rem",
                    paddingBottom: "2rem",
                    minWidth: "25%",
                    "&.target": {
                        background: "linear-gradient(90deg, transparent, #666A 5%, #666A 95%, transparent 100%)",
                        "& > .researchTarget": {
                            padding: "2rem 0",
                            fontSize: "1.3rem",
                        },
                    },
                    "&.prereq": {
                        background: "linear-gradient(90deg, transparent, #3228 5%, #333A 95%, transparent 100%)",
                    },
                    "&.reqby": {
                        background: "linear-gradient(90deg, transparent, #333A 5%, #2328 95%, transparent 100%)",
                    },
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
            border: "solid 3px transparent",

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

            "&.reqnotmet": {
                boxShadow: "inset 0 0 2rem 1rem #100D",
                border: "ridge 3px #F008",
                "& h1": {
                    color: "#F00A",
                },
            },
            "&.reqaremet": {
                boxShadow: "inset 0 0 2rem 1rem #010D",
                border: "ridge 3px #0F08",
                "& h1": {
                    color: "#080A",
                },
            },
        },
    })
);

const ScienceView: FC = () => {
    const classes = useStyles();

    const faction = useCurrentFaction();
    const [game] = useService<GameModel>(SERVICEID.GameService);

    const [showMode, setShowMode] = useState<string>("ALL");
    const [targetTech, setTargetTech] = useState<Technology | null>(null);
    const comms = useMyCommands<ResearchCommand>(CommandType.TechnologyResearch);

    if (!faction || !game) return null;

    // const techFields = faction.technologyFields.sort((a: FactionTechSetting, b: FactionTechSetting) => a[2] - b[2]);

    const pointsGenerated = researchPointGenerationCalculator(game, faction);

    const techUnderResearch = comms.map((cmd: ResearchCommand) => cmd.techId);

    function researchTech(tech: Technology) {
        if (faction && tech && !techUnderResearch.includes(tech.id)) {
            doResearchTechCommand(tech, faction.id);
        }
        if (techUnderResearch.includes(tech.id)) {
            const cmd = comms.find((cmd: ResearchCommand) => cmd.techId === tech.id);
            if (cmd) {
                doRemoveCommand(cmd.id);
            }
        }
    }

    function clickTech(tech: Technology) {
        if (faction && tech) {
            if (showMode === "SINGLE" || !canAffordTech(tech, faction)) {
                console.log("Set target Tech to", tech, "currently: ", targetTech);
                if (showMode !== "SINGLE") {
                    setShowMode("SINGLE");
                }
                setTargetTech((prev: Technology | null) => {
                    if (prev === null) return tech;
                    if (prev.id === tech.id) return null;
                    return tech;
                });
            } else {
                researchTech(tech);
            }
        }
    }

    const techs = [...DATATECHNOLOGY]
        .sort((a: Technology, b: Technology) => {
            return getTechValue(a) - getTechValue(b);
        })
        .filter((tech: Technology) => {
            if (showMode === "ALL") return true;

            if (showMode === "OWNED") {
                if (faction) {
                    return faction.technology.includes(tech.id);
                }
            }

            if (showMode === "SINGLE") {
                if (targetTech === null) return true;

                if (tech.id === targetTech.id) return true;
                if (tech.techprereq.includes(targetTech.id)) return true;
                if (targetTech.techprereq.includes(tech.id)) return true;
                return false;
            }

            const preReq = techPrerequisitesFulfilled(tech, faction);
            if (showMode === "MEETS PREREQUISITES" && preReq) {
                return true;
            }

            const missing = missingResearchPoints(tech, faction);

            if (missing.size === 0) return true;

            return false;
        });

    const targetUnderResearch = targetTech === null ? false : techUnderResearch.includes(targetTech.id);

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
                                targetTech={targetTech}
                            />
                        );
                    })}
                </div>

                <h2>
                    Technologies ({techs.length} / {DATATECHNOLOGY.length})
                </h2>

                {targetTech === null && (
                    <FilterButtons
                        values={["ALL", "MEETS PREREQUISITES", "CAN BE RESEARCHED", "OWNED", "SINGLE"]}
                        selected={showMode}
                        onChange={(s: string) => {
                            if (s !== "SINGLE") {
                                setTargetTech(null);
                            }
                            setShowMode(s);
                        }}
                    />
                )}

                {targetTech !== null && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setShowMode("ALL");
                            setTargetTech(null);
                        }}
                    >
                        BACK TO LIST
                    </Button>
                )}

                <div className={classes.technologyGrid}>
                    {targetTech === null &&
                        techs.map((tech: Technology) => {
                            const owned = faction.technology.find((s: string) => s === tech.id) !== undefined;
                            const canAfford = canAffordTech(tech, faction);
                            const techClasses = `${owned ? "owned " : ""}${!owned && !canAfford ? "cannotAfford" : ""}`;
                            if (showMode === "SINGLE") {
                                return (
                                    <TechCard
                                        tech={tech}
                                        faction={faction}
                                        key={tech.id}
                                        className={techClasses}
                                        onClick={clickTech}
                                        highlightMissing={true}
                                        underResearch={techUnderResearch.includes(tech.id)}
                                    />
                                );
                            }

                            if (canAfford && !owned) {
                                return (
                                    <TechCard
                                        tech={tech}
                                        faction={faction}
                                        key={tech.id}
                                        className={techClasses}
                                        onClick={clickTech}
                                        highlightMissing={true}
                                        underResearch={techUnderResearch.includes(tech.id)}
                                    />
                                );
                            }

                            return (
                                <TechCard
                                    tech={tech}
                                    faction={faction}
                                    key={tech.id}
                                    className={techClasses}
                                    highlightMissing={true}
                                    onClick={clickTech}
                                    underResearch={techUnderResearch.includes(tech.id)}
                                />
                            );
                        })}
                    {techs.length === 0 && <h3>No technologies available.</h3>}
                </div>
                {targetTech !== null && (
                    <div className={classes.singleTechGrid}>
                        <div className="col prereq">
                            <h3>
                                PREREQUISITES
                                <br />
                                <small>for {targetTech.name}</small>
                            </h3>
                            {techs.map((tech: Technology) => {
                                if (!targetTech.techprereq.includes(tech.id)) return null;
                                const owned = faction.technology.find((s: string) => s === tech.id) !== undefined;
                                const canAfford = canAffordTech(tech, faction);
                                const techClasses = `${owned ? "owned " : ""}${
                                    !owned && !canAfford ? "cannotAfford" : ""
                                } ${targetTech !== null && targetTech.id === tech.id ? "target" : ""}`;

                                return (
                                    <TechCard
                                        tech={tech}
                                        faction={faction}
                                        key={tech.id}
                                        className={techClasses}
                                        onClick={clickTech}
                                        highlightMissing={true}
                                        underResearch={techUnderResearch.includes(tech.id)}
                                    />
                                );
                            })}
                        </div>
                        <div className="col target">
                            <h3>TARGET TECHNOLOGY</h3>
                            <TechCard
                                tech={targetTech}
                                faction={faction}
                                className={`${
                                    faction.technology.find((s: string) => s === targetTech.id) !== undefined
                                        ? "owned"
                                        : ""
                                } `}
                                onClick={clickTech}
                                highlightMissing={true}
                                underResearch={targetUnderResearch}
                            />
                            {/* ${!canAffordTech(targetTech, faction) ? "cannotAfford" : ""} */}
                            <Button
                                className="researchTarget"
                                variant="contained"
                                color={targetUnderResearch ? "secondary" : "primary"}
                                disabled={!canAffordTech(targetTech, faction)}
                                onClick={() => researchTech(targetTech)}
                            >
                                {targetUnderResearch && (
                                    <>
                                        <small>Cancel:</small> {targetTech.name}
                                    </>
                                )}
                                {!targetUnderResearch && (
                                    <>
                                        <small>Research:</small> {targetTech.name}
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="col reqby">
                            <h3>
                                <small>{targetTech.name} is</small>
                                <br />
                                REQUIRED BY
                            </h3>
                            {techs.map((tech: Technology) => {
                                if (!tech.techprereq.includes(targetTech.id)) return null;
                                const owned = faction.technology.find((s: string) => s === tech.id) !== undefined;
                                const canAfford = canAffordTech(tech, faction);
                                const techClasses = `${owned ? "owned " : ""}${
                                    !owned && !canAfford ? "cannotAfford" : ""
                                } ${targetTech !== null && targetTech.id === tech.id ? "target" : ""}`;

                                return (
                                    <TechCard
                                        tech={tech}
                                        faction={faction}
                                        key={tech.id}
                                        className={techClasses}
                                        onClick={clickTech}
                                        highlightMissing={true}
                                        underResearch={techUnderResearch.includes(tech.id)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </PageContainer>
        </div>
    );
};

interface TechFieldProps {
    field: TechnologyField;
    faction: FactionModel;
    rpTotal: number;
    targetTech: Technology | null;
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

    let meetsRequirements = "notneeded";
    if (props.targetTech) {
        const required = props.targetTech.fieldreqs.find((req: [TechnologyField, number]) => {
            return req[0] === props.field && req[1] > 0;
        });
        if (required) {
            const missing = missingResearchPoints(props.targetTech, props.faction);
            if (missing.has(props.field)) {
                console.log(props.targetTech.name, props.field, missing.get(props.field));
                meetsRequirements = "reqnotmet";
            } else {
                meetsRequirements = "reqaremet";
            }
        }
    }

    return (
        <div className={`${classes.TechnologyFieldWrapper} ${meetsRequirements}`}>
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
        case TechnologyField.MATERIAL:
            image = materialSvg;
            break;
        case TechnologyField.INFORMATION:
            image = informationSvg;
            break;
    }

    if (image === "") return null;

    return <img src={image} alt={props.field} className={props.className || ""} />;
};

export default ScienceView;
