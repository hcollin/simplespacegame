import { TECHIDS } from "../data/dataTechnology";
import { FactionModel, GameModel, SystemModel } from "../models/Models";
import { factionHasTechnology } from "./techTools";



export function techMarketing(faction: FactionModel, game: GameModel): number {
    if(!factionHasTechnology(faction, TECHIDS.Marketing)) return 0;

    const totEco = game.systems.reduce((tot: number, sm: SystemModel) => {
        if(sm.ownerFactionId === faction.id) {
            return tot + sm.economy;
        }
        return tot;
    }, 0);

    return Math.floor(totEco/5);

}