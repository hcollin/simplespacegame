import { Button, createStyles, makeStyles, Theme } from "@material-ui/core"
import { useService } from "jokits-react"
import React, { FC } from "react"
import CommandList from "../components/CommandList"
import FactionHeader from "../components/FactionHeader"
import FactionInfo from "../components/FactionInfo"
import SimpleMap from "../components/SimpleMap"
import SystemInfo from "../components/SystemInfo"
import { FactionModel, GameModel } from "../models/Models"
import { processTurn } from "../services/commands/GameCommands"

const useStyles = makeStyles((theme: Theme) => createStyles({
    factions: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "14rem",
        backgroundColor: "#0002",
        padding: "0.5rem",
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


    if (!game) return null;



    return (
        <div>
            <FactionHeader />
            

            <div className={classes.rows}>
                <SimpleMap systems={game.systems} factions={game.factions} units={game.units} />
                <SystemInfo />
            </div>

            <div className={classes.factions}>
                {game.factions.map((fm: FactionModel) => <FactionInfo faction={fm} key={fm.id} />)}
            </div>

            <CommandList />

            <Button variant="contained" color="primary" onClick={processTurn} className={classes.nextTurn}>END TURN</Button>

            <h1>Game {game.turn}</h1>


        </div>
    )
}


export default GameView;