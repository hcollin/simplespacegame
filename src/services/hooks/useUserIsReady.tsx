import { useService } from "jokits-react";
import { useEffect, useState } from "react";
import { GameModel } from "../../models/Models";
import useCurrentFaction from "./useCurrentFaction";


export default function useUserIsReady(): boolean {
    const [ready, setReady] = useState<boolean>(false);
    

    const faction = useCurrentFaction();
    const [game] = useService<GameModel>("GameService");

    useEffect(() => {
        if(game && faction) {
            setReady((prev: boolean) => {
                const n = game.factionsReady.includes(faction.id);
                if(n !== prev) return n;
                return prev;
            })
        }
    }, [game, faction]);


    return ready;
}