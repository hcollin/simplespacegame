import { joki, useAtom, useService } from "jokits-react";
import { useEffect, useState } from "react";
import { GameModel } from "../models/Models";
import { SystemModel } from "../models/StarSystem";

export default function useSelectedSystem(): [SystemModel | null, ((id: string | null) => void)] {

    const [star, setStar] = useState<SystemModel | null>(null);
    const [game] = useService<GameModel>("GameService");

    const [starId, setStarId] = useAtom<string>("selectedSystem", "");


    useEffect(() => {
        if (starId === "") {
            setStar(null);
            joki.trigger({
                from: "useSelectedSystem",
                action: "systemSelected",
                data: null,
            });
            return;
        }

        if (game && starId) {

            if (star !== null && star.id === starId) {
                return;
            }

            const sm = game.systems.find((s: SystemModel) => s.id === starId);

            if (sm) {

                setStar((prev: SystemModel | null) => {
                    if (!sm) return null;
                    if (prev === null) return sm;
                    if (sm.id === prev.id) return prev;
                    return sm;
                });
                joki.trigger({
                    from: "useSelectedSystem",
                    action: "systemSelected",
                    data: sm,
                });
            }

        }
    }, [starId, game, star]);

    function setNewStar(id: string | null) {

        if (id === null) {
            setStarId("");
        } else {
            setStarId(id);
        }
    }


    return [star, setNewStar]
}