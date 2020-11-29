import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useService } from "jokits-react";

import React, { FC, useEffect, useState } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import useUnitSelection from "../hooks/useUnitSelection";

import { Command } from "../models/Commands";
import { FactionModel, GameModel, SystemModel } from "../models/Models";
import { ShipUnit } from "../models/Units";
import { moveUnits } from "../services/commands/UnitCommands";
import { unitIsMoving } from "../services/helpers/UnitHelpers";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { SERVICEID } from "../services/services";
import { distanceBetweenCoordinates } from "../utils/MathUtils";
import { getSystemByCoordinates } from "../utils/systemUtils";
import MiniUnitInfo from "./MiniUnitInfo";

import SendIcon from "@material-ui/icons/Send";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import HelpContainer from "./HelpContainer";
import { getFactionFromArrayById } from "../services/helpers/FactionHelpers";
import FactionBanner from "./FactionBanner";
import { getFactionAdjustedUnit } from "../utils/unitUtils";
import useMobileMode from "../hooks/useMobileMode";
import ModalButton from "./ModalButton";
import MinimizeIcon from '@material-ui/icons/Minimize';
import AllOutIcon from '@material-ui/icons/AllOut';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			top: "100px",
			// left: "1rem",
			// background: "repeating-linear-gradient(to bottom, #1118 0, #333E 5px, #444E 54px, #777E 67px, #555E 76px, #1118 80px)",
			// background: "linear-gradient(180deg, #000 0, #222 5%, #333 95%, #000 100%)",
			background: "repeating-linear-gradient(0deg, #000 0, #222 0.2rem, #222 2.8rem, #111 3rem)",
			color: "#FFFD",
			boxShadow: "inset 0 0 2rem 0.5rem #000",
			border: "ridge 3px #FFF5",
			padding: "0 0.5rem",
			borderRadius: "1rem",
			maxHeight: "60vh",
			display: "flex",
			flexDirection: "column",
			"& > div.body": {
				overflowY: "auto",
				position: "relative",
				// top: 0,
				// left: 0,
				// right: 0,
				// bottom: 0,
				"& > div.pagination": {
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "0.5rem",
					marginTop: "1rem",
					"& > div": {
						fontWeight: "bold",
						color: "#FFFA",
					},
					"& > button": {
						margin: 0,
						padding: "0.25rem 0.5rem",
					},
				},

				"& div.destination": {
					position: "relative",
					width: "100%",
					height: "10rem",
					display: "flex",
					overflow: "hidden",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-around",
					padding: "0.5rem",
					background: "#222",
					boxShadow: "inset 0 0 2rem 1rem #000",
					"& > h4": {
						top: "0",
						left: "50%",
						width: "50%",
						position: "absolute",
						marginLeft: "-25%",
						textAlign: "center",
						fontStyle: "italic",
						color: "#FFFA",
						textTransform: "uppercase",

						border: "ridge 3px #0008",
						borderTop: "none",
						background: "#1246",
						[theme.breakpoints.down("md")]: {
							fontSize: "0.7rem",
							letterSpacing: 0,
							borderBottomLeftRadius: "2rem",
							borderBottomRightRadius: "2rem",
							padding: "0.5rem 0 0.25rem 0",
						},
						[theme.breakpoints.up("lg")]: {
							fontSize: "1rem",
							letterSpacing: "2px",
							borderBottomLeftRadius: "3rem",
							borderBottomRightRadius: "3rem",
							padding: "1rem 0 0.5rem 0",
						},
					},
					"& > div.from, & > div.to": {
						borderRadius: "50%",

						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						"& > span": {
							fontWeight: "bold",
							textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
							textAlign: "center",
						},

						"& > .fbanner": {
							position: "absolute",
							top: "75%",
							left: "0.5rem",
							right: "auto",
						},

						"&.to": {
							"& > .fbanner": {
								right: "0.5rem",
								left: "auto",
							},
						},
						[theme.breakpoints.down("md")]: {
							width: "3rem",
							height: "3rem",
							"& > span": {
								fontSize: "0.5rem",
							},
							"& > .fbanner": {
								display: "none",
							},
						},
						[theme.breakpoints.up("lg")]: {
							width: "8rem",
							height: "8rem",
							"& > span": {
								fontSize: "1rem",
							},
						},
					},
					"& > div.travel": {
						flex: "1 1 auto",
						margin: "2rem 1rem 0 1rem",
						borderTop: "dashed 3px #FFF",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "2.5rem",
						// fontSize: "1.1rem",
						fontWeight: "bold",
						color: "#FFFE",
						"& > span": {
							display: "flex",
							alignItems: "center",
							color: "#FFFA",

							"& > b": {
								// fontSize: "1.6rem",
								color: "#FFFE",
								// margin: "0 0.5rem",
							},
						},
						[theme.breakpoints.down("md")]: {
							fontSize: "0.5rem",
							"& > span": {
								"& > b": {
									fontSize: "1rem",
									margin: "0 0.2rem",
								},
							},
						},
						[theme.breakpoints.up("lg")]: {
							fontSize: "1.1rem",
							"& > span": {
								"& > b": {
									fontSize: "1.6rem",
									margin: "0 0.5rem",
								},
							},
						},
					},
				},
			},

			"& > button.close": {
				top: "-1rem",
				right: "-1.75rem",
				width: "3rem",
				cursor: "pointer",
				height: "3rem",
				zIndex: "1200",
				position: "absolute",
				boxShadow: "0 0 0.5rem 0.1rem #0008, inset 0 0 0.5rem 0.25rem #FFF3",
				fontWeight: "bold",
				borderRadius: "1.5rem",
				background: "#210C",
				border: "ridge 3px #FFF8",
				fontSize: "1.6rem",
				color: "#FFFA",
				transition: "all 0.2s ease",
				padding: 0,
				margin: 0,
				"&:hover": {
					backgroundColor: "#630C",
					color: "#FFFD",
				},
			},

			"& h1, & h2, & h3, & h4": {
				textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
			},

			"& h4": {
				padding: "1rem 1rem 0 1rem",
				margin: 0,
			},
			"& h2": {
				margin: 0,
				[theme.breakpoints.down("md")]: {
					padding: 0,
				},
				[theme.breakpoints.up("lg")]: {
					padding: "0 1rem",
				},
			},

			"& div.units": {
				margin: "0.5rem 0",
				padding: "0 0.5rem",

				"& > div": {
					marginBottom: "0.25rem",
				},

				"& .ship": {
					transition: "all 0.25s ease",
					"&.isNotInFleet": {
						filter: "grayscale(0.9)",
						opacity: 0.75,
						transform: "scale(0.9)",
					},
				},
			},

			"& div.actions": {
				height: "2rem",
				position: "relative",

				"& > button": {
					bottom: "-1.5rem",
					right: "-2rem",
					width: "8rem",
					height: "4rem",
					cursor: "pointer",
					zIndex: "1200",
					position: "absolute",
					boxShadow: "0 0 0.5rem 0.1rem #0008, inset 0 0 0.5rem 0.25rem #FFF3",
					fontWeight: "bold",
					borderRadius: "2rem",
					background: "#021C",
					border: "ridge 3px #FFF8",
					fontSize: "1.4rem",
					color: "#FFFA",
					transition: "all 0.2s ease",
					padding: 0,
					margin: 0,
					"& svg": {
						marginLeft: "0.5rem",
					},
					"&:hover:not(.inactive)": {
						backgroundColor: "#063C",
						color: "#FFFD",
					},
					"&.inactive": {
						display: "none",

						"&:hover": {},
					},
				},
			},
			[theme.breakpoints.down("md")]: {
				top: "5rem",
				width: "calc(100% - 5.5rem)",
				left: "0.5rem",
				maxWidth: "45rem",
				"& > button.minify": {
					position: "absolute",
					top: "-1rem",
					left: "-0.25rem",
				},
			},
			[theme.breakpoints.up("lg")]: {
				top: "100px",
				width: "45rem",
				left: "1rem",
				maxWidth: "45rem",
				"& > button.minify": {
					position: "absolute",
					top: "-1rem",
					left: "-0.75rem",
				},
			},
		},
		maximize: {
			position: "absolute",
			
			left: "0.25rem",
			zIndex: 1200,
			[theme.breakpoints.down("md")]: {
				top: "4rem",
			},
			[theme.breakpoints.up("lg")]: {
				top: "calc(100px - 1rem)",
			},
		}
	}),
);

const FleetView: FC = () => {
	const classes = useStyles();

	const faction = useCurrentFaction();
	const [fleet, fleetActions] = useUnitSelection();
	const [star, setStar] = useSelectedSystem();
	const [commands] = useService<Command[]>(SERVICEID.CommandService);

	const [unitSelection, setUnitSelection] = useState<ShipUnit[]>([]);

	const [minified, setMinified] = useState<boolean>(false);

	useEffect(() => {
		setUnitSelection(fleet);
	}, [fleet]);

	if (!commands) return null;

	if (fleet.length === 0) return null;

	let viewMode = "VIEW";
	if (fleet.length > 0 && faction && fleet[0].factionId === faction.id && !unitIsMoving(commands, fleet[0])) viewMode = "MOVE";

	function close() {
		fleetActions.clr();
		setStar(null);
	}

	function moveFleet() {
		if (star && unitSelection.length > 0) {
			moveUnits(unitSelection, star.location);
			close();
		}
	}

	function updateSelection(ships: ShipUnit[]) {
		setUnitSelection(ships);
	}
	// console.log("FLEETVIEW", viewMode, fleet, star, units);

	if (fleet.length <= 0) {
		return null;
	}

	const canMove = viewMode === "MOVE" && unitSelection.length > 0 && star !== null;

	if(minified) {
		return <ModalButton onClick={() => setMinified(false)} className={classes.maximize}><AllOutIcon /></ModalButton>
	}

	return (
		<div className={classes.root}>
			<ModalButton onClick={() => setMinified(true)} className="minify"><MinimizeIcon /></ModalButton>
			<button className="close" onClick={close}>
				X
			</button>
			<div className="body">
				{viewMode === "MOVE" && <SelectUnitToFleet units={fleet} system={star} close={close} commands={commands} updateSelection={updateSelection} />}
				{viewMode === "VIEW" && <ViewFleetContent units={fleet} system={null} close={close} commands={commands} />}
			</div>
			{viewMode === "MOVE" && (
				<div className="actions">
					{/* <Button variant="outlined" color="secondary" onClick={() => fleetActions.clr()}>Cancel</Button> */}
					<Button variant="contained" color="primary" onClick={moveFleet} disabled={!canMove} className={!canMove ? "inactive" : ""}>
						MOVE <SendIcon />
					</Button>
				</div>
			)}
		</div>
	);
};

interface ContentProps {
	units: ShipUnit[];
	system: SystemModel | null;
	commands: Command[];
	close: () => void;
	updateSelection?: (ships: ShipUnit[]) => void;
}

const ViewFleetContent: FC<ContentProps> = (props) => {
	return (
		<>
			<h4>Fleet</h4>

			<div className="units">
				{props.units.map((unit: ShipUnit) => {
					return <MiniUnitInfo unit={unit} key={unit.id} />;
				})}
			</div>

			{/* <div className="actions">
                <Button variant="contained" color="primary" onClick={() => props.close()}>Close</Button>
            </div> */}
		</>
	);
};

interface TravelInfo {
	from: SystemModel | null;
	fromFaction: FactionModel | null;
	to: SystemModel | null;
	toFaction: FactionModel | null;
	distance: number;
	turns: number;
	slowestShip: ShipUnit | null;
}

const SelectUnitToFleet: FC<ContentProps> = (props) => {
	const [inFleet, setInFleet] = useState<ShipUnit[]>(props.units);
	const [game] = useService<GameModel>(SERVICEID.GameService);
	const [unitIndex, setUnitIndex] = useState<number>(0);
	const inMobileMode = useMobileMode();

	useEffect(() => {
		if (props.updateSelection) {
			props.updateSelection(inFleet);
		}
	}, [inFleet]);

	if (!game) return null;

	const paginationLimit = inMobileMode ? 2 : 6;

	function addToFleet(ship: ShipUnit) {
		if (!inFleet.includes(ship)) {
			setInFleet((prev) => {
				return [...prev, ship];
			});
		}
	}

	function removeFromFleet(ship: ShipUnit) {
		if (inFleet.includes(ship)) {
			setInFleet((prev) => {
				return prev.filter((s: ShipUnit) => s.id !== ship.id);
			});
		}
	}

	function toggleUnit(ship: ShipUnit) {
		if (inFleet.includes(ship)) {
			removeFromFleet(ship);
		} else {
			addToFleet(ship);
		}
	}

	function moveFleet() {
		// if(props.moveFleet) {
		//     props.moveFleet(inFleet);
		// }
	}

	const canMove = props.system !== null && inFleet.length > 0;
	const toFaction = getFactionFromArrayById(game.factions, props.system?.ownerFactionId || "");
	const trInfo: TravelInfo = {
		from: null,
		fromFaction: null,
		to: props.system || null,
		toFaction: toFaction || null,
		distance: 0,
		slowestShip: null,
		turns: 0,
	};

	const slowestUnit = inFleet.reduce((slowest: ShipUnit | null, cur: ShipUnit) => {
		if (slowest === null) return cur;

		if (cur.speed < slowest.speed) return cur;
		return slowest;
	}, null);
	if (slowestUnit && props.system) {
		const origSystem = getSystemByCoordinates(game, slowestUnit.location);
		if (origSystem) {
			trInfo.from = origSystem;
			const frFaction = getFactionFromArrayById(game.factions, origSystem.ownerFactionId);
			trInfo.fromFaction = frFaction || null;
		}
		const unFaction = getFactionFromArrayById(game.factions, slowestUnit.factionId);
		trInfo.slowestShip = unFaction ? getFactionAdjustedUnit(unFaction, slowestUnit) : slowestUnit;
		trInfo.distance = Math.ceil(distanceBetweenCoordinates(slowestUnit.location, props.system.location));
		trInfo.turns = Math.ceil(trInfo.distance / slowestUnit.speed);
	}

	const shownUnits = props.units.slice(unitIndex, unitIndex + paginationLimit);

	return (
		<>
			{/* <h4>Fleet</h4> */}
			{props.units.length > paginationLimit && (
				<div className="pagination">
					<Button variant="outlined" disabled={unitIndex === 0} onClick={() => setUnitIndex((prev: number) => Math.max(0, prev - paginationLimit))}>
						<NavigateBeforeIcon />
					</Button>
					<div>
						{unitIndex + 1} - {Math.min(unitIndex + paginationLimit, props.units.length)} / {props.units.length}
					</div>
					<Button
						variant="outlined"
						disabled={unitIndex + paginationLimit >= props.units.length}
						onClick={() => setUnitIndex((prev: number) => Math.min(prev + paginationLimit, props.units.length - 1))}
					>
						<NavigateNextIcon />
					</Button>
				</div>
			)}
			<div className="units">
				{shownUnits.map((unit: ShipUnit) => {
					const isInFleet = inFleet.includes(unit);
					return <MiniUnitInfo unit={unit} key={unit.id} className={`ship ${!isInFleet ? "isNotInFleet" : ""}`} onClick={() => toggleUnit(unit)} />;
				})}
			</div>

			{props.system && slowestUnit && trInfo.to && (
				<>
					<div className="destination">
						<h4>Travel information</h4>
						<div
							className="from"
							style={{
								background: `radial-gradient(white 0, ${trInfo.from?.color || "yellow"} 80%, black 100%)`,
								boxShadow: trInfo.fromFaction ? `0 0 3rem 0.5rem ${trInfo.fromFaction.color}` : "none",
							}}
						>
							<span>{trInfo.from?.name || "Unknown"}</span>
							{trInfo.fromFaction && <FactionBanner faction={trInfo.fromFaction} size="sm" className="fbanner" />}
						</div>

						<div className="travel">
							<span>
								<b>{trInfo.distance}</b>ly in <b>{trInfo.turns}</b> turns at speed of <b>{trInfo.slowestShip?.speed || 0}</b>
							</span>
						</div>

						<div
							className="to"
							style={{
								background: `radial-gradient(white 0, ${trInfo.to?.color || "yellow"} 80%, black 100%)`,
								boxShadow: trInfo.toFaction ? `0 0 3rem 0.5rem ${trInfo.toFaction.color}` : "none",
							}}
						>
							<span>{trInfo.to.name}</span>
							{trInfo.toFaction && <FactionBanner faction={trInfo.toFaction} size="sm" className="fbanner" />}
						</div>
					</div>
				</>
			)}
			{!props.system && slowestUnit && (
				<HelpContainer>
					<p>Select destination system from the map.</p>
				</HelpContainer>
			)}
		</>
	);
};

export default FleetView;
