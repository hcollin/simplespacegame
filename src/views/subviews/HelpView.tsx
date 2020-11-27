import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

import BuildIcon from "@material-ui/icons/Build";
import SecurityIcon from "@material-ui/icons/Security";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import StarIcon from "@material-ui/icons/Star";
import SpeedIcon from "@material-ui/icons/Speed";
import {
    IconCommand,
    IconCredit,
    IconDefense,
    IconIndustry,
    IconResearchPoint,
    IconTechBiology,
    IconTechInformation,
    IconTechMaterial,
    IconTechBusiness,
    IconTechChemistry,
    IconTechPhysics,
    IconWelfare,
} from "../../components/Icons";
import PageContainer from "../../components/PageContainer";

import bgImage from "../../images/art/SpaceStation.jpg";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";

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
            background: "repeating-linear-gradient(0deg, #000 0, #222 4px, #111 16px)",
            height: "100%",
            // padding: "2rem",
            overflowY: "auto",
            "& div.content": {
                paddingBottom: "2rem",
                "& > h2": {
                    borderTop: "ridge 3px #0004",
                    color: "#FFFE",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },

                "& > h3": {
                    // borderTop: "ridge 3px #0004",
                    color: "#FFFD",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },

                "& > h4": {
                    // borderTop: "ridge 3px #0004",
                    color: "#FFFA",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },
            },

            [theme.breakpoints.down("md")]: {
                padding: 0,
            },
            [theme.breakpoints.up("lg")]: {
                padding: "2rem",
            },
        },
    })
);

const HelpView: FC = () => {
    const classes = useStyles();
    const faction = useCurrentFaction();
    if (!faction) return null;
    return (
        <div className={classes.root}>
            <PageContainer color="#348" image={bgImage} font={faction.style.fontFamily}>
                <header>
                    <h1>Help</h1>
                </header>
                <div className="content">
                    <h2>Commands</h2>
                    <p>
                        Each turn player can give 3 commands <IconCommand /> as a base line. Commands can be related to
                        unit movement, building units or buildings, improving system paramters, research etc. Some
                        actions like travel and building reserves a command slot until it has been completed.
                    </p>
                    <p>
                        More command slots can be gained mainly by incresing the <IconWelfare /> walfare value in
                        system. If the system has a welfare value of 5 it will automtically increase the command limit
                        by one. Also for every 10th total welfare in the empire will also provide a new command.
                    </p>
                    <h2>Systems</h2>
                    <p>
                        Systems are the primary targets for commands and they are used to build units, they can hold
                        buildings and produce wealth and power to the faction. Each system cost <b>1 money</b> to
                        maintain per turn.
                    </p>
                    <p>Each system has 4 main parameters: Industry, Economy, Defense and Welfare.</p>
                    <h4>
                        <IconIndustry /> Industry
                    </h4>
                    <p>
                        Industry represents the infrastructure in the system to build. Larger ships require a larger
                        industry to be built as do some buildings. Also Defense value can never be higher that the
                        Industry.
                    </p>
                    <p>
                        <i>Cost per turn: 1 money per 2 industry after 3.</i>
                    </p>
                    <h4>
                        <IconCredit /> Economy
                    </h4>{" "}
                    <p>
                        Economy represents the strenght of the commerce in the System. Each point of economy will
                        produce 1 money per turn.
                    </p>
                    <h4>
                        <IconDefense /> Defense
                    </h4>{" "}
                    <p>
                        Defense represents the automated defence capability in the system. When trying to invade a
                        system the invasion fleets troop count must be higher than the defence value of the system.
                    </p>
                    <p>
                        <i>Cost per turn: 1 money per defense point</i>
                    </p>
                    <h4>
                        <IconWelfare /> Welfare
                    </h4>
                    <p>
                        Welfare represents health and living standards of the people living in this system. For each 10
                        points of total welfare the faction has, it gains one additional command per turn. If the system
                        has 5 welfare, another command is added to the pool. <br />
                    </p>
                    <p>
                        <i>Cost per turn: 1 money per 2 walfare points over 3</i>
                    </p>
                    <h3>Building units</h3>
                    <p>
                        Each system as one space dock that can be used to build ships. Each ship takes N amount of turns
                        to finish and the build process cannot be cancelled after the initial turn.
                    </p>
                    <p>
                        Building a unit is a persistant command that will reserve one command until the unit has been
                        completed.{" "}
                    </p>
                    <h3>Buidling buildings</h3>
                    <p>
                        Each system can contain a number of buildings depending on the industry value of the system.
                        Only one building can be built at once per system.
                    </p>
                    <p>
                        Building a building is a persistant command that will reserve one command until the building has
                        been completed.
                    </p>
                    <h2>Research</h2>
                    <p>
                        Every turn systems generate research points <IconResearchPoint /> that are then divided among
                        six fields:
                        <ul>
                            <li>
                                <IconTechBiology /> Biology
                            </li>
                            <li>
                                <IconTechMaterial /> Material
                            </li>
                            <li>
                                <IconTechBusiness /> Economy
                            </li>
                            <li>
                                <IconTechInformation /> Information
                            </li>
                            <li>
                                <IconTechChemistry /> Chemistry
                            </li>
                            <li>
                                <IconTechPhysics /> Physics
                            </li>
                        </ul>
                    </p>
                    <p>
                        The amount of research points each field gains per turn can be adjusted with four priority
                        levels: None, Low, Medium or High. If all fields have the same priority they reseave the same
                        amount of points (- rounding errors).
                    </p>
                    <h3>Researching Technology</h3>
                    <p>
                        When enough research points have been accumulated to fields, a technology can be researched.
                        Researching a technology is a command. Researching technology also spends the amount of points
                        it requires from the target fields.
                    </p>
                    <h3>Gaining research points</h3>
                    <p>Each system generates research points based on their parameters.</p>
                    <ul>
                        <li>Every fourth Economy point generates 1 research point</li>
                        <li>
                            For every third point of the sum of industry and defense parameters generates 1 research
                            point <i>((ind+def)/3)</i>
                        </li>
                        <li>
                            Welfare will generate 1 research point per welfare for the first 2 points after that it will
                            start dropping <i>[0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4, -5, -5, -5,...]</i>
                        </li>
                    </ul>
                    <h2>Units</h2>
                    <p>
                        Units (aka Ships) are used to invade other Systems and do combat. When a unit is being built it
                        reserves a command. When a fleet of units is moving that also reserves a command. Each turn
                        ships will also cost an upkeep.
                    </p>
                    <h3>Building units</h3>
                    <p>
                        Each unit costs credits to build and they require a certain level of industry on the system too.
                        While unit is under construction it will also reserve a command slot.
                    </p>
                    <h3>Unit attributes</h3>
                    <p>
                        Each unit many values that will affect its effectivness in combat as well as it's ability to
                        invade systems and travel speed.
                    </p>
                    <h4>Resilience</h4>
                    <p>
                        Hull tells how much damage the ship can take before it is destroyed. Armor reduces the amount of
                        damage hull takes.
                    </p>
                    <p>Shields are shot down before the hull is reached and they regenerate after each combat round.</p>
                    <h4>Weapons</h4>
                    <p>Each unit can have multiple weapons and each weapon has different attributes.</p>
                    <ul>
                        <li>Accauracy: How accurate the weapon is (bigger the better)</li>
                        <li>Damage: How much damage this weapon inflicts on each hit</li>
                        <li>Cooldown: How many turns it takes for this weapon to reload</li>
                        <li>
                            Type: How well weapon is able to deal damage to shields and hull depens on its type:
                            <ul>
                                <li>Energy: No adjustment</li>
                                <li>Kinetic: Bypasses shields, Armor is 25% more effective</li>
                                <li>Missile: Deals 2x more damage to shields</li>
                            </ul>
                        </li>
                        <li>Special: Some weapons may have some special attributes too like rapid fire etc.</li>
                    </ul>
                    <h4>Troops and Fighters</h4>
                    <p>
                        Troop value is used when invading systems. The total troop value of invading ships must be
                        higher than systems defence value.{" "}
                    </p>
                    <p>
                        Fighters are automatically deployed at the beginning of the combat. Destroyed fighters are
                        replaced while the unit is being repaired in a friendly system.
                    </p>
                </div>
            </PageContainer>
        </div>
    );
};

export default HelpView;
