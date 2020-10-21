import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { Command } from "../models/Commands";
import { GameModel } from "../models/Models";
import { User } from "../models/User";
import { getFactionByUsedId } from "../services/helpers/FactionHelpers";



export default function useMyCommands(): Command[] {

    const [user] = useService<User|null>("UserService");
    const [game] = useService<GameModel>("GameService");
    const [allCommands] = useService<Command[]>("CommandService");

    const [commands, setCommands] = useState<Command[]>([]);


    useEffect(() => {
        if(user && allCommands && game) {
            const faction = getFactionByUsedId(game.factions, user.id);
            if(faction) {
                setCommands(allCommands.filter((c: Command) => c.factionId === faction.id));
            }
            
        }

    },[ user, allCommands, game]);


    
    return commands;
}

