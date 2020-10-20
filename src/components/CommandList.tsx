import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import { Command } from "../models/Commands";
import { removeCommand } from "../services/commands/SystemCommands";


const useStyles = makeStyles((theme: Theme) => createStyles({
    commands: {
        position: "absolute",
        top: 0,
        right: "14rem",
        bottom: 0,
        width: "14rem",
        backgroundColor: "#0004",
        padding: "0.5rem",
    }
}))

interface CommandListProps {
    
}

const CommandList: FC<CommandListProps> = (props: CommandListProps) => {
    const classes = useStyles();
    const [commands] = useService<Command[]>("CommandService");
    
    
    if(!commands) return null;

    return (
        <div className={classes.commands}>
            <h2>Commands</h2>

            {commands.map((cm: Command) => {
                return (
                    <div key={cm.id}>
                        {cm.factionId} {cm.type} <Button variant="contained" color="secondary" onClick={() => removeCommand(cm.id)}>X</Button>
                    </div>
                );
            })}
        </div>
    );
};

export default CommandList;
