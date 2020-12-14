import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { Command, CommandType } from "../models/Commands";
import { GameModel } from "../models/Models";
import { User } from "../models/User";
import { getFactionByUserId } from "../services/helpers/FactionHelpers";
import { getActionPointCostOfCommands, getFactionActionPointPool } from "../utils/commandUtils";



export default function useMyCommands<T extends Command>(type?: CommandType): [T[], number, number] {

    const [user] = useService<User|null>("UserService");
    const [game] = useService<GameModel>("GameService");
    const [allCommands] = useService<Command[]>("CommandService");
    const [apsUsed, setApsUsed] = useState<number>(0);
    const [apsPool, setApsPool] = useState<number>(0);

    const [commands, setCommands] = useState<T[]>([]);

    useEffect(() => {
        if(user && allCommands && game) {
            const faction = getFactionByUserId(game.factions, user.userId);
            if(faction) {
                
                const fcoms = allCommands.filter((c: Command) => c.factionId === faction.id);
                const pool = getFactionActionPointPool(game, faction);
                const aps = getActionPointCostOfCommands(game, fcoms);
                if(type === undefined) {
                    setCommands(fcoms as T[]);
                } else {
                    setCommands(fcoms.filter((c: Command) => c.type === type) as T[]);
                }
                setApsUsed((prev: number) => prev === aps ? prev : aps);
                setApsPool((prev: number) => prev === pool ? prev : pool);
            }
        }

    },[user, allCommands, game]);


    
    return [commands, apsUsed, apsPool];
}




