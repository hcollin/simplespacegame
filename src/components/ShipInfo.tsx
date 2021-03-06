import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import {
	IconAccuracy,
	IconAgility,
	IconArmor,
	IconCooldown,
	IconCredit,
	IconDamage,
	IconDuration,
	IconHull,
	IconIndustry,
	IconMaintenanceCost,
	IconShields,
	IconSpeed,
} from "./Icons";
import { ShipDesign, ShipWeapon } from "../models/Units";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import {
	getShipAgility,
	getShipArmor,
	getShipBuildTime,
	getShipCost,
	getShipHull,
	getShipIndustry,
	getShipMaintenance,
	getShipShieldsMax,
	getShipShieldsReg,
	getShipSpeed,
} from "../utils/unitUtils";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: "relative",
			padding: 0,
			border: "solid 2px #0008",
			// background: "#0004",
			background: "#666",
			borderRadius: "0.5rem",
			width: "30rem",
			boxShadow: "inset 0 0 1rem 0.25rem #0044",
			"& > h3": {
				padding: "0.25rem",
				height: "2.2rem",
				margin: 0,
				background: "#0004",
				borderBottom: "solid 2px #0008",
				color: "#FFFD",
				// fontSize: "1rem",
				textShadow: "1px 1px 1px #000, -1px 1px 2px #000, -1px -1px 1px #000, 1px -1px 1px #000",
			},
			"& > h4": {
				top: "1rem",
				color: "#FFFD",
				right: "9.5rem",
				margin: "0",
				padding: "0",
				zIndex: "30",
				position: "absolute",
				fontSize: "0.7rem",
				textShadow: "1px 1px 1px #000, -1px 1px 2px #000, -1px -1px 1px #000, 1px -1px 1px #000",
				textAlign: "right",
				width: "8rem",
				textTransform: "uppercase",
				"& > span": {
					position: "absolute",
					top: "-0.5rem",
					right: 0,
					fontSize: "0.5rem",
					textTransform: "none",
					color: "#CCCD",
				},
			},
			"& > div.corner": {
				position: "absolute",
				top: 0,
				right: 0,
				width: "15rem",
				padding: "0 0.25rem 0 0.75rem",
				height: "2.2rem",
				background: "#0007",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: "1.4rem",
				fontWeight: "bold",
				borderBottomLeftRadius: "1rem",
				color: "#FFFE",

				"& > img": {
					margin: "0 9px 0 3px",
					height: "1.5rem",
					width: "1.5rem",
				},
			},

			"& > div.content": {
				background: "repeating-linear-gradient(#444D 3px, #222D 8px, #444D 10px)",
				color: "#FFFE",
				position: "relative",
				// padding: "1rem 0 0.5rem 0",

				"& button": {
					position: "absolute",
					top: "3px",
					right: 0,
					padding: 0,
					margin: 0,
					zIndex: 20,
					fontSize: "0.7rem",
					opacity: 0.5,
					"&:hover": {
						opacity: 0.9,
					},
				},

				"& > header": {
					position: "relative",
					left: 0,
					right: 0,
					top: 0,
					zIndex: 10,
					fontSize: "0.7rem",
					fontWeight: "bold",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					background: "linear-gradient(to bottom, transparent 0, #200D 6px,  transparent 100%)",
					borderBottom: "solid 1px #0008",
					borderTop: "solid 1px #0008",
					textTransform: "uppercase",
					padding: "3px 0.25rem",
					paddingRight: "5rem",
				},

				"& > div.description": {
					padding: "0.5rem",

					fontSize: "0.8rem",
					textAlign: "center",
					fontStyle: "italic",

					background: "linear-gradient(to bottom, transparent 0, #000D 5%, #0004 95%, transparent 100%)",
				},
				"& > div.keywords": {
					padding: "0.5rem",

					fontSize: "0.9rem",
					textAlign: "center",
					fontWeight: "bold",

					// background: "linear-gradient(to bottom, transparent 0, #000D 5%, #0004 95%, transparent 100%)",
					background: "#000A",
					borderTop: "ridge 3px #FFF8",
					borderBottom: "ridge 3px #FFF8",
				},

				"& > div.weapons": {
					padding: "0.5rem 0",
					"& > div.weapon": {
						fontSize: "0.9rem",
						color: "#FFFE",
						display: "flex",
						flexDirection: "row",
						width: "100%",
						alignItems: "center",
						justifyContent: "space-around",
						fontWeight: "bold",
						padding: "3px 0.25rem",
						"& > div": {
							flex: "0 0 auto",
							width: "15%",

							"&.name": {
								flex: "1 1 auto",
							},
							"&.damage": {
								width: "20%",
							},
							"&.type": {
								width: "20%",
								fontSize: "0.6rem",
							},
						},
						"&:nth-child(even)": {
							background: "linear-gradient(to bottom, transparent 0, #FFF2 10%, #FFF3 90%, transparent 100%)",
						},
					},
				},

				"&.hidden": {
					padding: 0,
					"& > div": {
						display: "none",
					},
					"& > header": {
						display: "flex",
					},
				},
			},

			"& > div.data": {
				display: "flex",
				flexDirection: "row",
				width: "100%",
				alignItems: "center",
				justifyContent: "space-around",
				// padding: "0.25rem",

				"& > div": {
					flex: "1 1 auto",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontWeight: "bold",
					fontSize: "1.4rem",
					padding: "0.25rem",

					borderRight: "solid 1px #0008",
					color: "#000D",

					"& > span": {
						fontSize: "0.9rem",
					},

					"& > img": {
						marginRight: "0.25rem",
					},
					"&:last-child": {
						borderRight: "none",
					},
				},
			},
			"&.clickable": {
				"&:hover": {
					background: "#999",
					cursor: "pointer",
				},
			},
			"&.selected": {
				background: "#486",
				"&.clickable:hover": {
					background: "#6A8",
				},
			},
			[theme.breakpoints.down("sm")]: {
				width: "100%",
				"& > h3": {
					height: "5rem",
				},
				"& > div.corner": {
					top: "2.5rem",
					right: 0,
					width: "100%",
					padding: "0 0.25rem 0 0.75rem",
					height: "2.5rem",
					borderBottomLeftRadius: "0rem",
				},
				"& > div.data": {
					flexWrap: "wrap",
				},
			},
			[theme.breakpoints.up("md")]: {
				width: "30rem",
				"& > h3": {
					height: "2.2rem",
				},
				"& > div.corner": {
					top: 0,
					right: 0,
					width: "15rem",
					padding: "0 0.25rem 0 0.75rem",
					height: "2.2rem",
					borderBottomLeftRadius: "1rem",
				},
				"& > div.data": {
					flexWrap: "nowrap",
				},
			},
		},
	}),
);

interface ShipInfoProps {
	ship: ShipDesign;
	className?: string;
	onClick?: (ship: ShipDesign) => void;
	selected?: boolean;
}

const ShipInfo: FC<ShipInfoProps> = (props) => {
	const classes = useStyles();
	const faction = useCurrentFaction();
	const [contentOpen, setContentOpen] = useState<boolean>(false);

	function handleClick() {
		if (props.onClick) {
			props.onClick(props.ship);
		}
	}

	return (
		<div className={`${classes.root}${props.onClick ? " clickable" : ""}${props.selected ? " selected" : ""} ${props.className}`} onClick={handleClick}>
			<h3>{props.ship.name}</h3>
			{/* <h4>
				<span>class</span>
				{props.ship.typeClassName}
			</h4> */}

			<div className="corner">
				{getShipBuildTime(props.ship, faction || undefined)} <IconDuration size="lg" />
				{getShipMaintenance(props.ship, faction || undefined)} <IconMaintenanceCost size="lg" />
				{getShipIndustry(props.ship, faction || undefined)} <IconIndustry size="lg" />
				{getShipCost(props.ship, faction || undefined)} <IconCredit size="lg" />
			</div>

			<div className={`content ${contentOpen ? "" : "hidden"}`}>
				<Button
					variant="contained"
					color="default"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						setContentOpen((prev: boolean) => !prev);
					}}
				>
					{contentOpen ? "HIDE" : "SHOW"}
				</Button>

				<header>
					<span>Weapons ({props.ship.weapons.length})</span>
					{props.ship.troops > 0 && <span>Troops: {props.ship.troops}</span>}
					{props.ship.fightersMax > 0 && (
						<span>
							Fighters: {props.ship.fighters}) / {props.ship.fighters}
						</span>
					)}
				</header>

				<div className={`weapons`}>
					{props.ship.weapons.map((weapon: ShipWeapon, ind: number) => {
						return (
							<div key={`s-w-${ind}`} className="weapon">
								<div className="name">{weapon.name}</div>
								<div className="accuracy">
									<IconAccuracy size="md" /> {weapon.accuracy}
								</div>
								<div className="damage">
									<IconDamage size="sm" /> {Array.isArray(weapon.damage) ? `${weapon.damage[0]} - ${weapon.damage[1]} ` : weapon.damage}
								</div>

								<div className="cooldown">
									<IconCooldown size="sm" /> {weapon.cooldownTime}
								</div>
								<div className="type">{weapon.type}</div>
							</div>
						);
					})}
				</div>

				{props.ship.keywords.length > 0 && <div className="keywords">{props.ship.keywords.join(", ")}</div>}
				{props.ship.description && <div className="description">{props.ship.description}</div>}
			</div>

			<div className="data">
				<div>
					<IconHull size="lg" /> {getShipHull(props.ship, faction || undefined)}
				</div>
				<div>
					<IconArmor size="lg" /> {getShipArmor(props.ship, faction || undefined)}
				</div>
				{props.ship.shieldsMax > 0 && (
					<div>
						<IconShields size="lg" /> {getShipShieldsMax(props.ship, faction || undefined)}{" "}
						<span> (+{getShipShieldsReg(props.ship, faction || undefined)})</span>
					</div>
				)}

				<div>
					<IconAgility size="lg" /> {getShipAgility(props.ship, faction || undefined)}
				</div>

				<div>
					<IconSpeed size="lg" /> {getShipSpeed(props.ship, faction || undefined)}
				</div>
			</div>
		</div>
	);
};

export default ShipInfo;
