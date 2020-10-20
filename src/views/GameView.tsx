import { useService } from "jokits-react"
import React, { FC } from "react"
import FactionInfo from "../components/FactionInfo"
import SimpleMap from "../components/SimpleMap"
import { FactionModel, GameModel } from "../models/Models"

const GameView: FC = () => {

    const [game] = useService<GameModel>("GameService");

    if(!game) return null;

    return (
        <div>
            
            <SimpleMap systems={game.systems} factions={game.factions} />

            {game.factions.map((fm: FactionModel) => <FactionInfo faction={fm} key={fm.id} />)}

        </div>
    )
}


export default GameView;