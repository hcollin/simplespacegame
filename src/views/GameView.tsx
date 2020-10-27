import { Button, createStyles, makeStyles, Theme } from "@material-ui/core"
import { useService } from "jokits-react"
import React, { FC, useEffect } from "react"
import CheatView from "../components/CheatView"
import CommandList from "../components/CommandList"
import FactionHeader from "../components/FactionHeader"
import FactionInfo from "../components/FactionInfo"
import LargeMap from "../components/LargeMap"
// import SimpleMap from "../components/SimpleMap"
import SystemInfo from "../components/SystemInfo"
import { FactionModel, GameModel } from "../models/Models"
import { processTurn } from "../services/commands/GameCommands"
import useCurrentUser from "../services/hooks/useCurrentUser"

const useStyles = makeStyles((theme: Theme) => createStyles({
    factions: {
        position: "absolute",
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
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        zIndex: 100,
    }
}))

const GameView: FC = () => {

    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");

    const [user, send] = useCurrentUser();
    

    useEffect(() => {
        if(game && !user && send !== undefined) {
            
            setTimeout(() => {
                const faction = game.factions[0];
                console.log("login as", faction.name, faction.playerId);
                send("switch", game.factions[0].playerId);
            }, 500);
            
        }

    }, [user, game, send]);

    if (!game) return null;



    return (
        <div>
            <FactionHeader />
            

            <div className={classes.rows}>
        {/* <SimpleMap systems={game.systems} factions={game.factions} units={game.units} /> */}
                <LargeMap systems={game.systems} factions={game.factions} units={game.units} />

                <SystemInfo />
            </div>

            <CheatView />

            <CommandList />

            <Button variant="contained" color="primary" onClick={processTurn} className={classes.nextTurn}>END TURN</Button>

            {/* <h1>Game {game.turn}</h1> */}


        </div>
    )
}


export default GameView;