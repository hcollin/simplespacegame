import { createStyles, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC, useState } from "react";
import CommandList from "../components/CommandList";
import FactionHeader from "../components/FactionHeader";
// import FactionInfo from "../components/FactionInfo"
import LargeMap from "./subviews/LargeMap";
// import SimpleMap from "../components/SimpleMap"
import { GameModel, GameState } from "../models/Models";

import iconMapSvg from "../images/iconMap.svg";
import iconEconomySvg from "../images/iconEconomy.svg";
import iconScienceSvg from "../images/iconScience.svg";
import iconDiplomacySvg from "../images/iconDiplomacy.svg";
import iconHelpSvg from "../images/iconHelp.svg";
import iconUnitsSvg from '../images/iconUnits.svg';


import EconomySheet from "./subviews/EconomySheet";
import HelpView from "./subviews/HelpView";
import ScienceView from "./subviews/ScienceView";
import DiplomacyView from "./subviews/DiplomacyView";
import FleetView from "../components/FleetView";
import SystemView from "../components/SystemView";
import UnitsView from "./subviews/UnitsView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
        },
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
            position: "absolute",
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
                    filter: "grayscale(0.9)",
                    transform: "scale(0.75)",
                    transition: "all 0.2s ease",
                },
                "&.active": {
                    "& > img": {
                        filter: "none",
                        transform: "scale(1)",
                    },
                },
                "&:hover": {
                    "& > img": {
                        transform: "scale(0.9)",
                        filter: "grayscale(0.75)",
                        cursor: "pointer",
                    },
                },
            },
            [theme.breakpoints.down("md")]: {
                width: "calc(100% - 3rem)",
                height: "4rem",
                borderRight: "none",
                borderRadius:0,
                padding: "0 1rem",
                zIndex: 90,
                "& > div": {
                    
                    "& > img": {
                        height: "3.5rem",
                        width: "3.5rem",
                        // transform: "scale(0.75)",
                        // transition: "all 0.2s ease",
                    },
                },
            },
            [theme.breakpoints.up("lg")]: {
                width: "600px",
                height: "5rem",
                "& > div": {
                    "& > img": {
                        height: "4rem",
                        width: "4rem",
                    },
                },
            },
            
            
        },
        processing: {
            display: "flex",
            height: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "radial-gradient(#456 0, #000 100%)",
            "& > h1": {
                color: "#FFFA",
                fontSize: "4rem",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                padding: "0 1rem",
                textAlign: "center",
                [theme.breakpoints.down("md")]: {
                    fontSize: "2rem",
                },
                [theme.breakpoints.up("lg")]: {
                    fontSize: "4rem",
                }
            },
            "& > div": {
                width: "60%",
                height: "1rem",
                boxShadow: "0 0 1rem 0.25rem #0008",
            },
        },
    })
);

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

    if (game.state === GameState.PROCESSING) {
        return (
            <div className={classes.processing}>
                <h1>Processing Turn {game.turn}</h1>
                <LinearProgress />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <FactionHeader />

            {/* <div className={classes.rows}> */}
            {/* <SimpleMap systems={game.systems} factions={game.factions} units={game.units} /> */}

            {view === "map" && (
                <>
                    <LargeMap systems={game.systems} factions={game.factions} units={game.units} />
                    {/* <SystemInfo /> */}
                    <FleetView />
                    <SystemView />
                </>
            )}
            {view === "economy" && <EconomySheet />}
            {view === "science" && <ScienceView />}
            {view === "diplomacy" && <DiplomacyView />}
            {view === "help" && <HelpView />}
            {view === "units" && <UnitsView />}

            <CommandList />

            {/* <Button variant="contained" color="primary" onClick={processTurn} className={classes.nextTurn}>END TURN</Button> */}

            {/* <h1>Game {game.turn}</h1> */}

            <div className={classes.mainMenu}>
                <div className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
                    <img src={iconMapSvg} alt="Map View" />
                </div>
                <div className={view === "economy" ? "active" : ""} onClick={() => setView("economy")}>
                    <img src={iconEconomySvg} alt="Economy View" />
                </div>
                <div className={view === "science" ? "active" : ""} onClick={() => setView("science")}>
                    <img src={iconScienceSvg} alt="Science View" />
                </div>
                <div className={view === "units" ? "active": ""} onClick={() => setView("units")}>
                    <img src={iconUnitsSvg} alt="Units View" />
                </div>
                <div className={view === "diplomacy" ? "active" : ""} onClick={() => setView("diplomacy")}>
                    <img src={iconDiplomacySvg} alt="Diplomacy View" />
                </div>
                <div className={view === "help" ? "active" : ""} onClick={() => setView("help")}>
                    <img src={iconHelpSvg} alt="Help View" />
                </div>
            </div>
        </div>
    );
};

// const CombatTestView: FC = () => {
//     const [game] = useService<GameModel>(SERVICEID.GameService);

//     const [report, setReport] = useState<CombatReport | null>(null);

//     useEffect(() => {
//         if (game && report === null) {
//             const star = arnd(game.systems);

//             const rep: CombatReport = {
//                 id: "test-id",
//                 gameId: game.id,
//                 systemId: star.id,
//                 title: "Combat Report!",
//                 turn: game.turn,
//                 type: DetailReportType.Combat,
//                 factionIds: game.factions.map((fm: FactionModel) => fm.id),
//                 rounds: [],
//                 units: [],
//                 origUnits: [],
//             };

//             const targetPoints = rnd(10, 20);

//             rep.factionIds.forEach((fid: string) => {
//                 const fleet = generateFleetForTargetSize(star.location, fid, targetPoints);
//                 rep.units = [...rep.units, ...fleet];
//             });

//             // const factions = [rep.factionIds[0], rep.factionIds[1], ...arnds(rep.factionIds, rnd(2, 12))];

//             // rep.units = arnds<ShipDesign>(DATASHIPS, factions.length).map((sd: ShipDesign, ind: number) => {
//             // 	return createShipFromDesign(sd, factions[ind], star.location);
//             // });

//             const combat = spaceCombatMain(game, rep.units, star);
//             console.log("COMBAT", combat);
//             rep.rounds = combat.roundLog;
//             rep.origUnits = combat.origUnits;

//             setReport(rep);
//         }
//     }, [game, report]);

//     if (!game || !report) return null;

//     return <CombatViewer combatReport={report} />;
// };


export default GameView;

// function generateFleetForTargetSize(location: Coordinates, factionId: string, size: number): ShipUnit[] {
//     let points: number = 0;

//     const ships: ShipUnit[] = [];

//     while (points < size) {
        
        
//         const d = arnd<ShipDesign>(DATASHIPS);
//         if(d.type !== SHIPCLASS.FIGHTER) {
//             const s = createShipFromDesign(d, factionId, location);
//             ships.push(s);
//             points += s.sizeIndicator;
        
//         }
        
//     }

//     return ships;
// }