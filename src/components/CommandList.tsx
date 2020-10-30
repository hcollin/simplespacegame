import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import useMyCommands from "../hooks/useMyCommands";
import { BuildUnitCommand, Command, CommandType, FleetCommand, ResearchCommand, SystemPlusCommand } from "../models/Commands";
import { GameModel } from "../models/Models";
import { removeCommand } from "../services/commands/SystemCommands";
import { getSystemByCoordinates, getSystemById } from "../services/helpers/SystemHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getTechById } from "../utils/techUtils";


const useStyles = makeStyles((theme: Theme) => createStyles({
    commands: {
        position: "fixed",
        top: 0,
        right: "14rem",
        bottom: 0,
        width: "14rem",
        backgroundColor: "#444",
        padding: "0.5rem",
        zIndex: 100,
        color: "white",
    },
    command: {
        color: "white",
        margin: "0.5rem 0",
        padding: "0 0.25rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
}))

interface CommandListProps {

}

const CommandList: FC<CommandListProps> = (props: CommandListProps) => {
    const classes = useStyles();
    // const [commands] = useService<Command[]>("CommandService");
    const [game] = useService<GameModel>("GameService");

    const commands = useMyCommands();

    const faction = useCurrentFaction();

    if (!commands || !game || !faction) return null;

    return (
        <div className={classes.commands}>
            <h2>Commands</h2>

            {commands.map((cm: Command) => {
                switch(cm.type) {
                    case CommandType.FleetMove:
                        return <FleetMoveCommandItem command={cm} key={cm.id} game={game} />;
                    case CommandType.SystemBuild:
                        return <SystemBuildCommandItem command={cm} key={cm.id} game={game} />;
                    case CommandType.TechnologyResearch:
                        return <ResearchCommandItem command={cm} key={cm.id} game={game} />;
                    default:
                        return <SystemPlusCommandItem command={cm} key={cm.id} game={game} />
                }
                
                // return (
                //     <div key={cm.id}>
                //         {cm.factionId} {cm.type} <Button variant="contained" color="secondary" onClick={() => removeCommand(cm.id)} disabled={game.turn !== cm.turn}>X</Button>
                //     </div>
                // );
            })}
        </div>
    );
};


interface CommandProps {
    command: Command;
    game: GameModel;
}

const SystemPlusCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as SystemPlusCommand;

    let cmdText = "unknown";
    switch (cmd.type) {
        case CommandType.SystemDefense:
            cmdText = "Build defences";
            break;
        case CommandType.SystemEconomy:
            cmdText = "Build ecoomy";
            break;
        case CommandType.SystemIndustry:
            cmdText = "Build Industry";
            break;
        case CommandType.SystemWelfare:
            cmdText = "Build Welfare";
            break;
    }

    const system = getSystemById(cmd.targetSystem);
    const systemName = system ? system.name : cmd.targetSystem;

    return (
        <div className={classes.command}>
            {cmdText} in {systemName} <Button variant="contained" color="secondary" onClick={() => removeCommand(cmd.id)} disabled={props.game.turn !== cmd.turn}>X</Button>
        </div>
    )

}

const FleetMoveCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as FleetCommand;
    const system = getSystemByCoordinates(cmd.target);
    const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
    return (
        <div className={classes.command}>
            <p>{cmd.unitIds.length} Units moving to {systemName}</p>
            <Button variant="contained" color="secondary" onClick={() => removeCommand(cmd.id)} disabled={props.game.turn !== cmd.turn}>X</Button>
        </div>
    )

}

const SystemBuildCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as BuildUnitCommand;
    const system = getSystemByCoordinates(cmd.target);
    const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
    return (
        <div className={classes.command}>
            Build a {cmd.shipName} in {systemName}
            <Button variant="contained" color="secondary" onClick={() => removeCommand(cmd.id)} disabled={props.game.turn !== cmd.turn}>X</Button>
        </div>
    )
}

const ResearchCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as ResearchCommand;
    const tech = getTechById(cmd.techId)
    
    return (
        <div className={classes.command}>
            Research technology {tech.name}.
            <Button variant="contained" color="secondary" onClick={() => removeCommand(cmd.id)} disabled={props.game.turn !== cmd.turn}>X</Button>
        </div>
    )
}

export default CommandList;
