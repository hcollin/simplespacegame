import { Button, createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core"
import { useService } from "jokits-react"
import React, { FC, useEffect, useState } from "react"
import CommandList from "../components/CommandList"
import FactionHeader from "../components/FactionHeader"
// import FactionInfo from "../components/FactionInfo"
import LargeMap from "./subviews/LargeMap"
// import SimpleMap from "../components/SimpleMap"
import SystemInfo from "../components/SystemInfo"
import { GameModel, GameState } from "../models/Models"
// import { doProcessTurn } from "../services/commands/GameCommands"
import useCurrentUser from "../services/hooks/useCurrentUser"


import iconMapSvg from '../images/iconMap.svg';
import iconEconomySvg from '../images/iconEconomy.svg';
import iconScienceSvg from '../images/iconScience.svg';

import iconDiplomacySvg from '../images/iconDiplomacy.svg';
import iconHelpSvg from '../images/iconHelp.svg';

import EconomySheet from "./subviews/EconomySheet"
import HelpView from "./subviews/HelpView"
import ScienceView from "./subviews/ScienceView"
import DiplomacyView from "./subviews/DiplomacyView"
import FleetView from "../components/FleetView"



const useStyles = makeStyles((theme: Theme) => createStyles({
    factions: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "14rem",
        backgroundColor: "#333",
        padding: "0.5rem",
        zIndex: 20,
    },
    rows: {
        marginTop: "5rem",
        display: "flex",
        flexDirection: "row",
    },
    nextTurn: {
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 100,
    },
    mainMenu: {
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 100,

        width: "600px",
        height: "5rem",
        backgroundColor: "#222C",
        borderTopRightRadius: "3rem 100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 4rem 0 2rem",
        borderTop: "solid 3px #8888",
        borderRight: "solid 6px #8888",
        "& > div": {
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            "& > img": {
                height: "4rem",
                width: "4rem",
                filter: "grayscale(0.9)",
                transform: "scale(0.75)",
                transition: "all 0.2s ease",
            },
            "&.active": {
                "& > img": {
                    filter: "none",
                    transform: "scale(1)",
                }
            },
            "&:hover": {
                "& > img": {
                    transform: "scale(0.9)",
                    filter: "grayscale(0.75)",
                    cursor: "pointer",
                }
            }

        }

    },
    processing: {
        display: "flex",
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "radial-gradient(#456 0, #000 100%)",
        "& > h1" :{
            color: "#FFFA",
            fontSize: "4rem",
            textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
        },
        "& > div": {
            width: "60%",
            height: "1rem",
            boxShadow: "0 0 1rem 0.25rem #0008",
        }
        
    }
}))

const GameView: FC = () => {

    const classes = useStyles();

    const [view, setView] = useState<string>("map");

    const [game] = useService<GameModel>("GameService");

    // const [user, send] = useCurrentUser();

    // useEffect(() => {
    //     // if (game && !user && send !== undefined) {

    //     //     setTimeout(() => {
    //     //         const faction = game.factions[0];
    //     //         console.log("login as", faction.name, faction.playerId);
    //     //         send("switch", game.factions[0].playerId);
    //     //     }, 500);

    //     // }

    // }, [user, game, send]);

    if (!game) return null;


    if(game.state === GameState.PROCESSING) {
        return <div className={classes.processing}>
            <h1>Processing Turn {game.turn}</h1>
            <LinearProgress />
        </div>
    }
    

    return (
        <div>
            <FactionHeader />


            {/* <div className={classes.rows}> */}
            {/* <SimpleMap systems={game.systems} factions={game.factions} units={game.units} /> */}
            
            {view === "map" && <>
                <LargeMap systems={game.systems} factions={game.factions} units={game.units} />
                <SystemInfo />
                <FleetView />
            </>}
            {view === "economy" && <EconomySheet />}
            {view === "science" && <ScienceView />}
            {view === "diplomacy" && <DiplomacyView />}
            {view === "help" && <HelpView />}


        

            <CommandList />

            

            {/* <Button variant="contained" color="primary" onClick={processTurn} className={classes.nextTurn}>END TURN</Button> */}

            {/* <h1>Game {game.turn}</h1> */}

            <div className={classes.mainMenu}>
                <div className={view === "map" ? "active": ""} onClick={() => setView("map")}>
                    <img src={iconMapSvg} alt="Map View" />
                </div>
                <div className={view === "economy" ? "active": ""} onClick={() => setView("economy")}>
                    <img src={iconEconomySvg} alt="Economy View" />
                </div>
                <div className={view === "science" ? "active": ""} onClick={() => setView("science")}>
                    <img src={iconScienceSvg} alt="Science View" />
                </div>
                {/* <div className={view === "units" ? "active": ""} onClick={() => setView("units")}>
                    <img src={iconUnitsSvg} alt="Units View" />
                </div> */}
                <div className={view === "diplomacy" ? "active": ""} onClick={() => setView("diplomacy")}>
                    <img src={iconDiplomacySvg} alt="Diplomacy View" />
                </div>
                <div className={view === "help" ? "active": ""} onClick={() => setView("help")}>
                    <img src={iconHelpSvg} alt="Help View" />
                </div>
            </div>


        </div>
    )
}


export default GameView;