import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { joki, useService } from "jokits-react";
import React, { FC, useEffect, useState } from "react";
import useMyCommands from "../hooks/useMyCommands";
import { BuildBuildingCommand, BuildUnitCommand, Command, CommandType, FleetCommand, ResearchCommand, SystemPlusCommand } from "../models/Commands";
import { FactionModel, GameModel } from "../models/Models";
import { doRemoveCommand } from "../services/commands/SystemCommands";
import { getSystemById } from "../services/helpers/SystemHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { getTechById } from "../utils/techUtils";

import CancelIcon from "@material-ui/icons/Cancel";

import iconBuildSvg from "../images/iconUnderConstruction.svg";
import iconScienceSvg from "../images/iconScience.svg";
import iconFleetSvg from "../images/iconUnits.svg";
import { IconCommand, IconCredit, IconDefense, IconIndustry, IconResearchPoint, IconScore, IconWelfare } from "./Icons";
import { calculateTargetScore, factionValues, getFactionScore, researchPointGenerationCalculator } from "../utils/factionUtils";
import { doPlayerDone } from "../services/commands/GameCommands";
import { COMMANDPAGINATIONLIMIT } from "../configs";
import { getSystemByCoordinates } from "../utils/systemUtils";
import CheatView from "./CheatView";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import CommandIcon from "./CommandIcon";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import SubMenuButton from "./SubMenuButton";
import { doCloseGame, doLogout } from "../services/commands/UserCommands";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		commands: {
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,

			width: "18rem",
			background: "linear-gradient(90deg, #000 0,#444 5%, #777 10%, #444 15%,#333 95%,#000 100%)",
			boxShadow: "inset 0 0 2rem 2rem #0124",
			// background: "repeating-linear-gradient(-25deg, #000 0, #555 7px, #777 10px, #666 60px, #444 90px, #222 100px)",
			padding: "0 0 0.5rem 0",
			zIndex: 100,
			color: "white",
			"& > .menuopener": {
				display: "none",
			},
			"&:before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: -1,
				// background: "linear-gradient(to right, #000C 0, #7898 5%, #9AB3 95%,  #000C 100%)",
				background: "repeating-linear-gradient(200deg, #000 0, #3338 5px, transparent 10px, #BDF1 120px, transparent 150px, #4448 155px, #000 160px)",
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
				"& > small": {
					marginLeft: "1rem",
					"&.red": {
						color: "#F88D",
					},
				},
			},
			"& > header": {
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-around",
				flexWrap: "wrap",
				boxShadow: "inset 0 0 1rem 0.7rem #FFF4",
				background: "#9BF1",
				"& > div": {
					flex: "1 1 auto",
					width: "50%",
					color: "#FFFD",
					fontSize: "1.1rem",
					fontWeight: "bold",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRight: "solid 3px #0008",
					borderBottom: "solid 3px #0008",
					padding: "0.5rem",
					boxShadow: "inset 0 0 1rem 0.25rem #0124",
					textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
					"& > img": {
						marginRight: "0.5rem",
					},
					"&:nth-child(even)": {
						borderRight: "none",
					},
					"& > small": {
						fontSize: "0.7rem",
						marginLeft: "0.5rem",
						"&.green": {
							color: "#0B0D",
						},
						"&.red": {
							color: "#B00D",
						},
					},
				},
			},
			[theme.breakpoints.down("md")]: {
				right: "-15rem",
				transition: "all 0.3s ease",
				boxShadow: "inset 0 0 2rem 2rem #0124, 0 0 1rem 0.5rem #0008",

				"& > .menuopener": {
					top: "calc(50% - 4.5rem)",
					left: "-2rem",
					margin: "0",
					display: "block",
					padding: "0",
					position: "absolute",
					height: "9rem",
					width: "2rem",
					borderTopLeftRadius: "1rem",
					borderBottomLeftRadius: "1rem",
					background: "#888",
					border: "groove 3px #0008",
					boxShadow: "inset 0 0 1rem 0.15rem #000A",
					borderRight: "none",
					opacity: 0.75,
					outline: "none",
					"& > .icon": {
						transform: "rotate(180deg)",
						transition: "all 0.6s ease",
					},
					"&:hover": {
						opacity: 1,
					},
					"&:focus": {
						opacity: 1,
					},
				},
				"&.open": {
					right: 0,
					"& > .menuopener": {
						"& > .icon": {
							transform: "rotate(0deg)",
							transition: "all 0.6s ease",
						},
					},
				},
			},
		},
		pagination: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			boxShadow: "inset 0 0 1rem 0.5rem #000a",
			background: "#4688",
			padding: "0.25rem 0",
		},
		command: {
			color: "white",
			padding: "0.5rem 0.5rem",
			display: "flex",
			zIndex: 110,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			position: "relative",
			borderTop: "solid 3px #0008",
			borderBottom: "solid 3px #123B",
			background: "linear-gradient(90deg, black 0,#0008 6px, #0008 2.5rem, #4688 2.75rem, #0128 3rem, #0124 90%, #0008 97%, #000 100%)",

			"&.green": {
				background: "linear-gradient(90deg, black 0,#0408 6px, #0508 1.5rem, #0408 2.5rem, #4688 2.75rem, #0128 3rem, #0124 90%, #0008 97%, #000 100%)",
			},

			"&.red": {
				background: "linear-gradient(90deg, black 0,#4008 6px, #5008 1.5rem, #4008 2.5rem, #4688 2.75rem, #0128 3rem, #0124 90%, #0008 97%, #000 100%)",
			},

			"&.blue": {
				background: "linear-gradient(90deg, black 0,#0048 6px, #0058 1.5rem, #0048 2.5rem, #4688 2.75rem, #0128 3rem, #0124 90%, #0008 97%, #000 100%)",
			},

			"&.gray": {
				background: "linear-gradient(90deg, black 0,#2228 6px, #3338 1.5rem, #2228 2.5rem, #4688 2.75rem, #0128 3rem, #0124 90%, #0008 97%, #000 100%)",
			},

			"& > img.commandIcon": {
				width: "1.7rem",
				"&.lg": {
					width: "2.5rem",
					marginLeft: "-0.4rem",
				},
			},
			"& > label": {
				fontSize: "0.7rem",
				textTransform: "uppercase",
				position: "absolute",
				top: 0,
				left: "3.25rem",
				right: 0,
				height: "1rem",
				background: "#0008",
				color: "#FFFC",
				fontWeight: "bold",
				zIndex: 5,
			},
			"& > h2": {
				position: "absolute",
				top: "1rem",
				left: "3.25rem",
				right: 0,
				fontSize: "1.1rem",
				margin: 0,
				padding: 0,
				zIndex: 5,
				"& > small": {
					fontSize: "0.7rem",
					display: "block",
					marginTop: "-3px",
				},
			},

			"& > .cancelButton": {
				zIndex: 10,
				"& .commandIcon": {
					display: "none",
				},
				"& .cancelIcon": {
					display: "block",
				},
			},
		},
		faction: {
			position: "relative",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			// justifyContent: "space-between",
			borderBottom: "solid 2px #FFF2",
			borderTop: "solid 2px #0008",
			background: "linear-gradient(90deg, black 0, #FFF3 3px, #FFF8 1.5rem, #FFF5 2.5rem, #4448 3rem,  #3338 95%, #000 100%)",
			height: "2rem",
			// marginBottom: "0.25rem",
			// padding: "0 0.25rem",
			
			"& > img": {
				width: "1.6rem",
				// marginRight: "0.5rem",
				margin: "0.2rem 0.25rem",
			},
			"& > h3": {
				fontSize: "0.8rem",
				color: "#FFFD",
				textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
				// position: "absolute",
				// top: 0,
				// left: 0,
				// right: 0,
				// bottom: 0,
				// background: "#0008",
				padding: "0.25rem 0.5rem",
				margin: 0,
				
			},
			"& > .vpIcon": {
				position: "absolute",
				top: 0,
				right: "1.5rem",
				margin: 0,
				padding: 0,
				opacity: 0.7,
			},
			"& > .score": {
				position: "absolute",
				top: 0,
				right: "0.5rem",
				margin: 0,
				padding: 0,
				textAlign: "right",
				fontSize: "1.2rem",
				color: "#FFFE",
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
				"&.menu": {
					flex: "0 0 auto",
                    width: "6rem",
                    marginRight: "1rem",
                    
                    "& > div": {
                        
                        "& > div.submenu": {
                            background: "#0008",
                            padding: "0.5rem",
                            left: "auto",
                            right: 0,
                            borderTopLeftRadius: "1rem",
                            borderTopRightRadius: "1rem",

                            "& > button": {
                                margin: "0.25rem 0",
                                "&:first-child": {
                                    
                                }
                            },
                            "& > hr": {
                                background: "#FFF8",
                                margin: "0.5rem 0",
                            }
                            
                        },
                    }

					
				},
			},
		},
		miniDisplay: {
			position: "absolute",
			top: 0,
			bottom: 0,
			left: 0,
			width: "3rem",
			background: "linear-gradient(90deg, #000, #555 6px, #222 8px, #444 100%)",
			"&:before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: -1,
				// background: "linear-gradient(to right, #000C 0, #7898 5%, #9AB3 95%,  #000C 100%)",
				background: "repeating-linear-gradient(200deg, #000 0, #3338 5px, transparent 10px, #BDF1 120px, transparent 150px, #4448 155px, #000 160px)",
			},

			[theme.breakpoints.down("md")]: {
				display: "flex",
				flexDirection: "column",
				zIndex: 200,
				transition: "opacity 0.6s ease",
				opacity: 1,

				"& > div.value": {
					height: "1.5rem",
					display: "flex",
					position: "relative",
					fontSize: "1rem",
					alignItems: "center",
					fontWeight: "bold",
					textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
					justifyContent: "center",
					paddingLeft: "0.75rem",
					borderBottom: "ridge 2px #0008",
					"& > img": {
						top: "5%",
						left: "-5%",
						width: "80%",
						height: "80%",
						position: "absolute",
						zIndex: "-1",
					},
					"&.red": {
						color: "#F33",
					},
				},

				"& > button.commandCancelButton": {
					width: "2.5rem",
					height: "2.5rem",
					margin: "0.1rem 0.1rem 0.1rem 0.4rem",
					padding: "0",
					borderRadius: "0.5rem",
					background: "#F00",
					boxShadow: "inset 0 0 1rem 0.5rem #0008",
					border: "ridge 3px #000A",
					"& > img": {
						width: "2rem",
						height: "2rem",
					},
					"&:hover": {
						background: "#F44",
						boxShadow: "inset 0 0 1rem 0.5rem #4448",
						border: "ridge 3px #000A",
					},
				},

				"& > div.empty": {
					flex: "1 1 auto",
				},
				"& > div.turn": {
					color: "#FFFA",
					width: "100%",
					margin: "0.5rem 0",
					fontSize: "1.4rem",
					textAlign: "center",
					textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
					fontWeight: "bold",
				},
				"& > button.ready": {
					width: "2.5rem",
					height: "2.5rem",
					margin: "0 0.1rem 0.25rem 0.4rem",
					background: "#0C0",
					boxShadow: "inset 0 0 1rem 0.25rem #0008, 0 3px 2px 1px #000",
					border: "ridge 2px #0008",
					borderRadius: "0.5rem",
					"& > img": {
						width: "2rem",
						height: "2rem",
					},
					"&.notAllDone": {
						background: "#CC0",
					},
				},

				"&.open": {
					opacity: 0,
					pointerEvents: "none",
					userSelect: "none",
				},
			},
			[theme.breakpoints.up("lg")]: {
				display: "none",
			},
		},
	}),
);

const isDev = process.env.NODE_ENV === "development";

interface CommandListProps {}

const CommandList: FC<CommandListProps> = (props: CommandListProps) => {
	const classes = useStyles();

	const [open, setOpen] = useState<boolean>(false);
	// const [commands] = useService<Command[]>("CommandService");
	const [game] = useService<GameModel>("GameService");

	const [cmdIndex, setCmdIndex] = useState<number>(0);
	const commands = useMyCommands();
	const faction = useCurrentFaction();

	useEffect(() => {
		if (cmdIndex >= commands.length) {
			setCmdIndex((prev: number) => (prev > COMMANDPAGINATIONLIMIT ? prev - COMMANDPAGINATIONLIMIT : 0));
		}
	}, [commands, cmdIndex]);

	function loginFaction(fm: FactionModel) {
		if (isDev) {
			joki.trigger({
				to: "UserService",
				action: "switch",
				data: fm.playerId,
			});
		}
	}

	if (!commands || !game || !faction) return null;

	const isReady = game.factionsReady.includes(faction.id);

	const values = factionValues(game, faction.id);

	const commandsFull = commands.length >= values.maxCommands;
	const pointsGenerated = researchPointGenerationCalculator(game, faction);

	const cmdsShown = commands.slice(cmdIndex, cmdIndex + COMMANDPAGINATIONLIMIT);

	const commandsLeft = values.maxCommands - commands.length;

	return (
		<div className={`${classes.commands} ${open ? "open" : ""}`}>
			<button className="menuopener" onClick={() => setOpen((prev: boolean) => !prev)}>
				<DoubleArrowIcon className="icon" />
			</button>
			<div className={`${classes.miniDisplay} ${open ? "open" : ""}`}>
				<div className={`value ${values.income <= 0 ? "red" : ""}`}>
					<IconCredit />
					{faction.money}
				</div>
				<div className="value">
					<IconResearchPoint />
					{pointsGenerated >= 0 ? `+${pointsGenerated}` : `-${pointsGenerated}`}
				</div>
				<div className="value">
					<IconScore />
					{getFactionScore(game, faction.id)}
				</div>
				<div className="value">
					<IconWelfare />
					{values.totalWelfare}
				</div>
				<div className={`value ${commandsLeft <= 0 ? "red" : ""}`}>
					<IconCommand />
					{commandsLeft}
				</div>
				{cmdsShown.map((cmd: Command) => {
					return (
						<button key={cmd.id} className="commandCancelButton" onClick={() => doRemoveCommand(cmd.id)}>
							<CommandIcon command={cmd} />
						</button>
					);
				})}

				<div className="empty"></div>
				<div className="turn">{game.turn}</div>
                
                <button
					onClick={() => doPlayerDone(faction.id)}
					className={`ready ${commands.length < values.maxCommands ? "notAllDone" : ""}`}
					disabled={isReady}
				>
					<DoneAllIcon />
				</button>
			</div>
			<header>
				<div>
					<IconCredit size="lg" />
					{faction.money}
					<small className={values.income < 0 ? "red" : "green"}>{values.income >= 0 ? `+${values.income}` : values.income}</small>
				</div>
				<div>
					<IconResearchPoint size="lg" />
					{pointsGenerated}
				</div>
				<div>
					<IconScore size="lg" />
					{getFactionScore(game, faction.id)} <small>/ {calculateTargetScore(game)}</small>
				</div>
				<div>
					<IconWelfare size="lg" />
					{values.totalWelfare}
				</div>
			</header>

			<h1>
				Commands
				<small className={commandsFull ? "red" : ""}>
					({commands.length} / {values.maxCommands})
				</small>
			</h1>

			{cmdsShown.map((cm: Command) => {
				switch (cm.type) {
					case CommandType.FleetMove:
						return <FleetMoveCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
					case CommandType.SystemBuildUnit:
						return <SystemBuildCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
					case CommandType.SystemBuildingBuild:
						return <SystemBuildBuildingItem command={cm} key={cm.id} game={game} isReady={isReady} />;
					case CommandType.TechnologyResearch:
						return <ResearchCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
					default:
						return <SystemPlusCommandItem command={cm} key={cm.id} game={game} isReady={isReady} />;
				}
			})}
			{commands.length > COMMANDPAGINATIONLIMIT && (
				<div className={classes.pagination}>
					<Button
						variant="contained"
						onClick={() => setCmdIndex((prev: number) => (prev >= COMMANDPAGINATIONLIMIT ? prev - COMMANDPAGINATIONLIMIT : 0))}
						disabled={cmdIndex === 0}
					>
						Prev {COMMANDPAGINATIONLIMIT}
					</Button>
					<Button
						variant="contained"
						onClick={() => setCmdIndex((prev: number) => (prev + COMMANDPAGINATIONLIMIT < commands.length ? prev + COMMANDPAGINATIONLIMIT : prev))}
						disabled={cmdIndex + COMMANDPAGINATIONLIMIT > commands.length}
					>
						{" "}
						Next {COMMANDPAGINATIONLIMIT}
					</Button>
				</div>
			)}

			<h1>Factions</h1>
			{game.factions.map((fm: FactionModel) => {
				const isReady = game.factionsReady.includes(fm.id);
				const score = getFactionScore(game, fm.id);
				return (
					<div className={`${classes.faction} ${isReady ? "ready" : ""}`} key={fm.id} onClick={() => loginFaction(fm)} style={{background: `linear-gradient(90deg, transparent 0, ${fm.color} 1.25rem, transparent 2.5rem)`}}>
						<img src={require(`../images/symbols/${fm.iconFileName}`)} alt={faction.name} />
						<h3 style={{ color: fm.color, fontFamily: fm.style.fontFamily || "Arial" }}> {fm.name}</h3>

						<IconScore size="lg" className="vpIcon" />
						<h2 className="score">{score}</h2>
					</div>
				);
			})}

			{isDev && <CheatView />}

			<div className={classes.turn}>
				<div>
					<label>Turn</label>
					<h1>{game.turn}</h1>
				</div>
				<div className="menu">
					<SubMenuButton direction="UP" color={commandsLeft === 0 ? "primary": "default"}>
						
						<Button variant="contained" color="primary" onClick={() => doCloseGame()}>
							CLOSE
						</Button>
						<Button variant="contained" color="primary" onClick={() => doLogout()}>
							LOGOUT
						</Button>
                        <hr />
                        <Button variant="contained" color="primary" onClick={() => doPlayerDone(faction.id)} disabled={isReady}>
							READY
						</Button>
					</SubMenuButton>
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
		<div className={`${classes.command} blue`}>
			{cmd.type === CommandType.SystemEconomy && <IconCredit size="lg" className="commandIcon" />}
			{cmd.type === CommandType.SystemDefense && <IconDefense size="lg" className="commandIcon" />}
			{cmd.type === CommandType.SystemIndustry && <IconIndustry size="lg" className="commandIcon" />}
			{cmd.type === CommandType.SystemWelfare && <IconWelfare size="lg" className="commandIcon" />}

			<label>{cmdText}</label>
			<h2>{systemName}</h2>

			{!props.isReady && (
				<Button
					variant="contained"
					color="secondary"
					className="cancelButton"
					onClick={() => doRemoveCommand(cmd.id)}
					disabled={props.game.turn !== cmd.turn}
				>
					{cmd.type === CommandType.SystemEconomy && <IconCredit className="commandIcon" />}
					{cmd.type === CommandType.SystemDefense && <IconDefense className="commandIcon" />}
					{cmd.type === CommandType.SystemIndustry && <IconIndustry className="commandIcon" />}
					{cmd.type === CommandType.SystemWelfare && <IconWelfare className="commandIcon" />}
					<CancelIcon className="cancelIcon" />
				</Button>
			)}
		</div>
	);
};

const FleetMoveCommandItem: FC<CommandProps> = (props) => {
	const classes = useStyles();
	const cmd = props.command as FleetCommand;
	const system = getSystemByCoordinates(props.game, cmd.target);
	const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
	return (
		<div className={`${classes.command} red`}>
			<img src={iconFleetSvg} className="commandIcon lg" alt="Fleet Icon" />
			<label>Fleet Movement to</label>
			<h2>{systemName}</h2>

			{/* <p>
                {cmd.unitIds.length} Units moving to {systemName}
            </p> */}
			{!props.isReady && (
				<Button
					variant="contained"
					color="secondary"
					className="cancelButton"
					onClick={() => doRemoveCommand(cmd.id)}
					disabled={props.game.turn !== cmd.turn}
				>
					<img src={iconFleetSvg} className="commandIcon" alt="Fleet Icon" />
					<CancelIcon className="cancelIcon" />
				</Button>
			)}
		</div>
	);
};

const SystemBuildCommandItem: FC<CommandProps> = (props) => {
	const classes = useStyles();
	const cmd = props.command as BuildUnitCommand;
	const system = getSystemById(props.game, cmd.targetSystem);
	const systemName = system ? system.name : cmd.targetSystem;
	// const system = getSystemByCoordinates(props.game, cmd.target);
	// const systemName = system ? system.name : `coordinates ${cmd.target.x}, ${cmd.target.y}`;
	return (
		<div className={`${classes.command} red`}>
			<img src={iconBuildSvg} className="commandIcon lg" alt="Build icon" />
			<label>Build Unit</label>
			<h2>
				{cmd.shipName}
				<br />
				<small>
					{systemName} ({cmd.turnsLeft})
				</small>
			</h2>

			{!props.isReady && (
				<Button
					variant="contained"
					color="secondary"
					className="cancelButton"
					onClick={() => doRemoveCommand(cmd.id)}
					disabled={props.game.turn !== cmd.turn}
				>
					<img src={iconBuildSvg} className="commandIcon" alt="Build icon" />
					<CancelIcon className="cancelIcon" />
				</Button>
			)}
		</div>
	);
};

const SystemBuildBuildingItem: FC<CommandProps> = (props) => {
	const classes = useStyles();
	const cmd = props.command as BuildBuildingCommand;
	const system = getSystemById(props.game, cmd.targetSystem);
	const systemName = system ? system.name : cmd.targetSystem;

	return (
		<div className={`${classes.command} blue`}>
			<img src={iconBuildSvg} className="commandIcon lg" alt="Build icon" />
			<label>Build Building</label>
			<h2>
				{cmd.buildingType}
				<br />
				<small>
					{systemName} ({cmd.turnsLeft})
				</small>
			</h2>

			{!props.isReady && (
				<Button
					variant="contained"
					color="secondary"
					className="cancelButton"
					onClick={() => doRemoveCommand(cmd.id)}
					disabled={props.game.turn !== cmd.turn}
				>
					<img src={iconBuildSvg} className="commandIcon" alt="Build icon" />
					<CancelIcon className="cancelIcon" />
				</Button>
			)}
		</div>
	);
};

const ResearchCommandItem: FC<CommandProps> = (props) => {
	const classes = useStyles();
	const cmd = props.command as ResearchCommand;
	const tech = getTechById(cmd.techId);

	return (
		<div className={`${classes.command} green`}>
			<img src={iconScienceSvg} className="commandIcon lg" alt="Science Icon" />

			<label>Research</label>
			<h2>{tech.name}</h2>
			{!props.isReady && (
				<Button
					variant="contained"
					color="secondary"
					className="cancelButton"
					onClick={() => doRemoveCommand(cmd.id)}
					disabled={props.game.turn !== cmd.turn}
				>
					<img src={iconScienceSvg} className="commandIcon" alt="Science Icon" />
					<CancelIcon className="cancelIcon" />
				</Button>
			)}
		</div>
	);
};

export default CommandList;
