import { joki } from "jokits-react";
import { FactionModel, GameModel } from "../models/Models";

export function getFactionById(fid: string): FactionModel {
    const game = joki.service.getState("GameService") as GameModel;
    const f = game.factions.find((f: FactionModel) => f.id === fid);
    if (!f) {
        throw new Error(`Invalid Faction id ${fid}`);
    }
    return f;
}
