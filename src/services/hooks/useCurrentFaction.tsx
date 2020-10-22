import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { FactionModel, GameModel } from "../../models/Models";
import useCurrentUser from "./useCurrentUser";



export default function useCurrentFaction(): FactionModel | null {

    const [faction, setFaction] = useState<FactionModel | null>(null)

    const [game] = useService<GameModel>("GameService");
    const [user] = useCurrentUser();

    useEffect(() => {

        if (game && user) {
            const f = game.factions.find((f: FactionModel) => f.playerId === user.id);
            if (f) {
                setFaction(f);
            } else {
                setFaction(null);
            }
        }

    }, [game, user]);


    return faction;
}