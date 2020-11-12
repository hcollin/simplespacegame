import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

import BuildIcon from "@material-ui/icons/Build";
import SecurityIcon from "@material-ui/icons/Security";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import StarIcon from '@material-ui/icons/Star';
import SpeedIcon from '@material-ui/icons/Speed';
import { IconCredit, IconDefense, IconIndustry, IconWelfare } from "../../components/Icons";



const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        minHeight: "100vh",
        color: "#FFFD",
        background: "repeating-linear-gradient(0deg, #000 0, #222 4px, #111 16px)",
        height: "100&",
        padding: "2rem",
        

        "& > div.page": {
            marginTop: "4rem",
            padding: "1rem",
            background: "#444D",
            color: "#FFFE",
            borderRadius: "1rem",
            width: "calc(100% - 28rem)",
            marginBottom: "6rem",
        },
    }
}));

const HelpView: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className="page">
                <h1>Help</h1>

                <h2>Systems</h2>

                <p>Systems are the primary targets for commands and they are used to build units and produce wealth and power to the faction. Each system cost <b>1 money</b> to maintain per turn.</p>

                <p>Each system has 4 parameters: Industry, Economy, Defense and Welfare.</p>
                
                <h4><IconIndustry /> Industry</h4>

                <p>Industry represents the infrastructure in the system to build. Larger ships require a larger industry to be built. Also Defense value can never be higher that the Industry.<br /><i>Cost per turn: 1 money per 2 industry after 3.</i></p>

                <h4><IconCredit /> Economy</h4> <p>Economy represents the strenght of the commerce in the System. Each point of economy will produce 1 money per turn.</p>
                
                <h4><IconDefense /> Defense</h4> <p>Defense represents the automated defence capability in the system. Each defense point counts as one weapon die for systems owner. If there are no defending ships in the system, these defences are ignored. <br /><i>Cost per turn: 1 money per defense point</i></p>

                <h4><IconWelfare /> Welfare</h4><p>Welfare represents health and living standards of the people living in this system. For each 10 points of total welfare the faction has, it gains one additional command per turn. If the system has 5 welfare, another command is added to the pool. <br /><i>Cost per turn: 1 money per 2 walfare points over 3</i></p>

                <h3>Research Points</h3>

                <p>Each system generates research points based on their parameters.</p>

                <ul>
                    <li>Every fourth Economy point generates 1 research point</li>
                    <li>For every third point of the sum of industry and defense parameters generates 1 research point <i>((ind+def)/3)</i></li>
                    <li>Welfare will generate 1 research point per welfare for the first 2 points after that it will start dropping <i>[0, 1, 2, 1, 0, -1, -1, -2, -2, -3, -4, -5, -5, -5,...]</i></li>
                </ul>

                <h2>Units</h2>

                <p>Units (aka Ships) are used to invade other Systems and do combat. There is an upkeep cost for each unit per turn that is 1/3 of the building cost of the unit, with a minimum of 1.</p>

                <p>Each unit has the following attributes:</p>
                <ul>
                    <li><MonetizationOnIcon /> <b>Cost:</b> How much money does it cost to build this ship</li>
                    <li><BuildIcon /> <b>Industry:</b> The minimum industry level the system needs to have to be able to build this ship.</li>

                    <li><StarIcon /> <b>Weapons:</b> How many combat dice does this unit roll each turn.</li>
                    <li><SecurityIcon /> <b>Hull:</b> How many hits can this ship take until it is destroyed.</li>

                    <li><SpeedIcon /> <b>Speed:</b> How fast this unit moves.</li>
                </ul>

                
                

                <h3>Combat</h3>
              

                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio quia, harum modi explicabo nobis eos saepe facilis commodi, veniam maiores similique minus ut, dolorum id ipsam velit qui. Iure, amet?</p>
                <h2>Header 4</h2>
            </div>

        </div>
    )

}

export default HelpView;