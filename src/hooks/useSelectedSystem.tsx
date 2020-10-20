import { useAtom, useService } from "jokits-react";
import { useEffect, useState } from "react";
import { GameModel, SystemModel } from "../models/Models";




export default function useSelectedSystem(): [SystemModel | null, ((id: string | null) => void)] {

    const [star, setStar] = useState<SystemModel | null>(null);
    const [game] = useService<GameModel>("GameService");

    const [starId, setStarId] = useAtom<string>("selectedSystem", "");


    useEffect(() => {

        if (starId === "") {
            setStar(null);
            return;
        }

        if (game && starId) {
            const sm = game.systems.find((s: SystemModel) => s.id === starId);
            setStar((prev: SystemModel | null) => {
                if (!sm) return null;
                if (prev === null) return sm;
                if (sm.id === prev.id) return prev;
                return sm;
            });
        }



    }, [starId, game]);

    function setNewStar(id: string | null) {

        if (id === null) {
            setStarId("");
        } else {
            setStarId(id);
        }
    }

    return [star, setNewStar]
}