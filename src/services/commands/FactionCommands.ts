import { joki } from "jokits-react";
import { CommandType, ResearchCommand } from "../../models/Commands";
import { FactionTechSetting, GameModel, Technology, TechnologyField } from "../../models/Models";
import { getFactionFromArrayById } from "../helpers/FactionHelpers";
import { createEmptyCommandForCurrentFactionAndGame, factionIsReady } from "./SystemCommands";




export function doAdjustTechValues(tech: TechnologyField, newValue: number, factionId: string) {

    const game = joki.service.getState("GameService") as GameModel;
    
    const faction = getFactionFromArrayById(game.factions, factionId);
    if (faction) {
        faction.technologyFields = faction.technologyFields.map((ftf: FactionTechSetting) => {
            if (ftf.field === tech) {
                ftf.priority = newValue;
                return {...ftf};
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


export function doResearchTechCommand(tech: Technology, factionId: string) {
    if(factionIsReady()) return;
    const rootCommand = createEmptyCommandForCurrentFactionAndGame(CommandType.TechnologyResearch);

    if (!rootCommand) {
        console.error(`Cannot research ${tech.name}`);
        return;
    }

    const command = { ...rootCommand, techId: tech.id } as ResearchCommand;

    joki.trigger({
        to: "CommandService",
        action: "addCommand",
        data: command,
    });
}
