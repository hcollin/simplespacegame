import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { Command, CommandType } from "../models/Commands";
import { GameModel } from "../models/Models";
import { User } from "../models/User";
import { getFactionByUserId } from "../services/helpers/FactionHelpers";



export default function useMyCommands<T extends Command>(type?: CommandType): T[] {

    const [user] = useService<User|null>("UserService");
    const [game] = useService<GameModel>("GameService");
    const [allCommands] = useService<Command[]>("CommandService");

    const [commands, setCommands] = useState<T[]>([]);


    useEffect(() => {
        if(user && allCommands && game) {
            const faction = getFactionByUserId(game.factions, user.id);
            if(faction) {
                if(type === undefined) {
                    const fcoms = allCommands.filter((c: Command) => c.factionId === faction.id);
                    setCommands(fcoms as T[]);
                } else {
                    setCommands(allCommands.filter((c: Command) => c.factionId === faction.id && c.type === type) as T[]);
                }
                
            }
            
        }

    },[ user, allCommands, game]);


    
    return commands;
}

