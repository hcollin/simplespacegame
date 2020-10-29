import { joki } from "jokits-react";
import { FactionTechSetting, GameModel, TechnologyField } from "../../models/Models";
import { getFactionById } from "../helpers/FactionHelpers";




export function doAdjustTechValues(tech: TechnologyField, newValue: number, factionId: string) {

    const game = joki.service.getState("GameService") as GameModel;
    
    const faction = getFactionById(game.factions, factionId);
    if (faction) {
        faction.technologyFields = faction.technologyFields.map((ftf: FactionTechSetting) => {
            if (ftf[0] === tech) {
                ftf[2] = newValue;
                return [...ftf];
            }
            return ftf;
        })

        joki.trigger({
            to: "GameService",
            action: "updateFaction",
            data: { ...faction },
        });
    }

}