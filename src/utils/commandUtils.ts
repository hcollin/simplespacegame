import { joki } from "jokits-react";
import { Command, CommandType, FleetCommand } from "../models/Commands";
import { UnitModel } from "../models/Models";



export function unitIsInFleet(unit: UnitModel): FleetCommand|null {

    const commands = joki.service.getState("CommandService") as Command[];

    const com = commands.find((cmd: Command) => {
        if (cmd.type === CommandType.FleetMove) {
            const fcmd = cmd as FleetCommand;
            const u = fcmd.unitIds.includes(unit.id);
            if (u) {
                return true;
            }
        }
        return false;
    });

    if(com) {
        return com as FleetCommand;
    }
    return null;
}