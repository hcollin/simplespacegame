import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { joki, useService } from "jokits-react";
import React, { FC } from "react";
import useMyCommands from "../hooks/useMyCommands";
import {
    BuildUnitCommand,
    Command,
    CommandType,
    FleetCommand,
    ResearchCommand,
    SystemPlusCommand,
} from "../models/Commands";
import { FactionModel, GameModel, GameState } from "../models/Models";
import { removeCommand } from "../services/commands/SystemCommands";
import { getSystemByCoordinates, getSystemById } from "../services/helpers/SystemHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getTechById } from "../utils/techUtils";
import CheatView from "./CheatView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        commands: {
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,

            width: "18rem",
            background: "linear-gradient(90deg, #000 0,#444 5%, #777 10%, #444 15%,#333 95%,#000 100%)",
            boxShadow: "inset 0 0 2rem 2rem #0124",
            // background: "repeating-linear-gradient(-25deg, #000 0, #555 7px, #777 10px, #666 60px, #444 90px, #222 100px)",
            padding: "0.5rem",
            zIndex: 100,
            color: "white",
            "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                // background: "linear-gradient(to right, #000C 0, #7898 5%, #9AB3 95%,  #000C 100%)",
                background:
                    "repeating-linear-gradient(200deg, #000 0, #3338 5px, transparent 10px, #BDF1 120px, transparent 150px, #4448 155px, #000 160px)",
            },
            "& > h1": {
                color: "#FFFD",
                fontSize: "1rem",
                borderTop: "groove 3px #0004",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                textTransform: "uppercase",
                background: "linear-gradient(-25deg, #001 0, #0128 70%, transparent 90%)",
                margin: "0",
                padding: "0.5rem",
                borderBottom: "ridge 5px #FFF8",
            },
        },
        command: {
            color: "white",
            margin: "0.5rem 0",
            padding: "0 0.25rem",
            display: "flex",
            zIndex: 110,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        faction: {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(to bottom, #002D 0, #8896 5%, #EEEC 50%, #9889 95%, #400B 100%)",
            marginBottom: "0.25rem",
            padding: "0 0.25rem",
            "& > img": {
                width: "3rem",
                marginRight: "0.5rem",
            },
            "& > h3": {
                fontSize: "1.2rem",
                color: "#FFFD",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
            },
            "&.ready": {
                opacity: 0.75,
                filter: "grayscale(0.9)",
                background: "linear-gradient(to bottom, #002D 0, #3346 5%, #888C 50%, #5449 95%, #400B 100%)",
                "&:after": {
                    top: "50%",
                    left: "50%",
                    color: "#FFFD",
                    width: "10rem",
                    content: '"READY"',
                    position: "absolute",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginLeft: "-5rem",
                    zIndex: "100",
                    marginTop: "-1.75rem",
                    textAlign: "center",
                    transform: "rotate(-10deg)",
                    letterSpacing: "6px",
                },
            },
        },
        turn: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "4rem",
            background: "linear-gradient(90deg, #012D 0,   #7898 10%, #2348 15%, #000A 100%)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            borderTop: "groove 5px #fff4",
            "& > div": {
                flex: "1 1 auto",
                textAlign: "center",
                position: "relative",
                "& > h1": {
                    padding: 0,
                    margin: 0,
                    fontSize: "1.8rem",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },
                "& > h2": {
                    padding: 0,
                    margin: 0,
                    fontSize: "1.2rem",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                },
                "&> label": {
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
                    textTransform: "uppercase",
                    transform: "rotate(-90deg)",
                    display: "block",
                    position: "absolute",
                    left: "1rem",
                    top: "0.5rem",
                    letterSpacing: "2px",
                    color: "#FFFA",
                },
            },
        },
    })
);

interface CommandListProps {}

const CommandList: FC<CommandListProps> = (props: CommandListProps) => {
    const classes = useStyles();
    // const [commands] = useService<Command[]>("CommandService");
    const [game] = useService<GameModel>("GameService");

    const commands = useMyCommands();

    const faction = useCurrentFaction();

    function loginFaction(fm: FactionModel) {
        joki.trigger({
            to: "UserService",
            action: "switch",
            data: fm.playerId,
        });
    }

    function factionClickHandler(fm: FactionModel) {
        
    }

    if (!commands || !game || !faction) return null;

    const isReady = game.factionsReady.includes(faction.id);

    return (
        <div className={classes.commands}>
            <h1>Commands</h1>

            {commands.map((cm: Command) => {
                switch (cm.type) {
                    case CommandType.FleetMove:
                        return <FleetMoveCommandItem command={cm} key={cm.id} game={game} isReady={isReady}/>;
                    case CommandType.SystemBuild:
                        return <SystemBuildCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
                    case CommandType.TechnologyResearch:
                        return <ResearchCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
                    default:
                        return <SystemPlusCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
                }
            })}

            <h1>Factions</h1>
            {game.factions.map((fm: FactionModel) => {
                const isReady = game.factionsReady.includes(fm.id);
                return (
                    <div
                        className={`${classes.faction} ${isReady ? "ready" : ""}`}
                        key={fm.id}
                        onClick={() => loginFaction(fm)}
                    >
                        <img src={require(`../images/symbols/${fm.iconFileName}`)} alt={faction.name} />
                        <h3 style={{ color: fm.color }}> {fm.name}</h3>
                    </div>
                );
            })}

            <CheatView />

            <div className={classes.turn}>
                <div>
                    <label>Turn</label>
                    <h1>{game.turn}</h1>
                </div>
                <div>
                    <h2>{GameState[game.state]}</h2>
                </div>
            </div>
        </div>
    );
};

interface CommandProps {
    command: Command;
    game: GameModel;
    isReady: boolean;
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

    const system = getSystemById(props.game, cmd.targetSystem);
    const systemName = system ? system.name : cmd.targetSystem;

    return (
        <div className={classes.command}>
            {cmdText} in {systemName}{" "}
            {!props.isReady && <Button
                variant="contained"
                color="secondary"
                onClick={() => removeCommand(cmd.id)}
                disabled={props.game.turn !== cmd.turn}
            >
                X
            </Button>}
        </div>
    );
};

const FleetMoveCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as FleetCommand;
    const system = getSystemByCoordinates(props.game, cmd.target);
    const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
    return (
        <div className={classes.command}>
            <p>
                {cmd.unitIds.length} Units moving to {systemName}
            </p>
            {!props.isReady && <Button
                variant="contained"
                color="secondary"
                onClick={() => removeCommand(cmd.id)}
                disabled={props.game.turn !== cmd.turn}
            >
                X
            </Button>}
        </div>
    );
};

const SystemBuildCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as BuildUnitCommand;
    const system = getSystemByCoordinates(props.game, cmd.target);
    const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
    return (
        <div className={classes.command}>
            Build a {cmd.shipName} in {systemName}
            {!props.isReady && <Button
                variant="contained"
                color="secondary"
                onClick={() => removeCommand(cmd.id)}
                disabled={props.game.turn !== cmd.turn}
            >
                X
            </Button>}
        </div>
    );
};

const ResearchCommandItem: FC<CommandProps> = (props) => {
    const classes = useStyles();
    const cmd = props.command as ResearchCommand;
    const tech = getTechById(cmd.techId);

    return (
        <div className={classes.command}>
            Research technology {tech.name}.
            {!props.isReady && <Button
                variant="contained"
                color="secondary"
                onClick={() => removeCommand(cmd.id)}
                disabled={props.game.turn !== cmd.turn}
            >
                X
            </Button>}
        </div>
    );
};

export default CommandList;
