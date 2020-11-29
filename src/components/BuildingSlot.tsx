import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { TECHIDS } from "../data/dataTechnology";
import { Building } from "../models/Buildings";
import { Technology } from "../models/Models";
import { getTechById } from "../utils/techUtils";
import { IconCredit, IconIndustry, IconWelfare, IconEconomy, IconDuration, IconScore, IconUnderConstruction } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			border: "ridge 3px #FFF8",
			width: "15rem",
			position: "relative",
			minHeight: "12rem",

			borderRadius: "0.75rem",
			overflow: "hidden",
			background: "linear-gradient(-45deg, #000C 0, #123D 20%, #234F 50%, #123D 80%, #000C 100%)",

			// margin: "1rem",

			"& > h1": {
				position: "relative",
				// top: 0,
				// left: 0,
				width: "10.5rem",
				// right: "4.5rem",
				minHeight: "2.5rem",
				fontSize: "1.4rem",
				color: "#FFFD",
				margin: 0,
				padding: "0.25rem 0.5rem",
				background: "#0006",
				borderBottomRightRadius: "5rem 0.5rem",
				borderBottom: "solid 2px #FFF8",
				textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
			},

			"& > p": {
				padding: "0.25rem 0.5rem",
				width: "10.5rem",
				fontSize: "0.9rem",
				margin: 0,
			},

			"& > div.techPreq": {
				position: "absolute",
				bottom: 0,
				left: 0,

				fontSize: "0.5rem",
				textTransform: "uppercase",
				padding: "0.25rem 1rem 0.25rem 0.5rem",
				fontStyle: "italic",
				background: "#123",
				fontWeight: "bold",
				borderTopRightRadius: "1rem",
				borderTop: "solid 2px #FFF8",
				borderRight: "solid 1px #FFF8",
				zIndex: 20,
			},

			"& > div.costs": {
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				justifyContent: "center",
				background: "linear-gradient(90deg, #000A 0, #0008 1.8rem, #444A 2rem, #444D 100%)",
				position: "absolute",
				top: "0",
				right: "0",
				width: "4.5rem",
				bottom: "0",
				borderLeft: "ridge 3px #8888",
				fontWeight: "bold",

				"& > div": {
					flex: "1 1 auto",
					width: "100%",
					display: "flex",
					alignItems: "center",
					padding: "0 0.5rem",
					justifyContent: "space-between",
					// boxShadow: "inset 0 0 1rem 3px #000A",
					fontWeight: "bold",
					textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",
				},
			},
			"& > div.score": {
				position: "absolute",
				bottom: 0,
				right: "4.5rem",
				width: "9rem",
				height: "2rem",
				fontSize: "1rem",
				fontWeight: "bold",
				borderTop: "ridge 3px #AAA8",
				borderLeft: "ridge 3px #AAA8",
				borderTopLeftRadius: "7rem 2rem",
				background: "linear-gradient(-135deg, #220 10%, #552A 30%, #FF83 35%, #552B 40%, #0008 80%)",
				zIndex: 10,
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				paddingRight: "0.5rem",
				textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",

				"& > img": {
					marginRight: "0.5rem",
					marginBottom: "3px",
					opacity: 0.5,
				},
			},
			"&.clickable:hover": {
				cursor: "pointer",
				border: "ridge 3px #8F88",
				"& > div.costs": {
					borderLeft: "ridge 3px #4848",
				},
			},

			"&.disabled": {
				filter: "grayscale(0.8)",
				opacity: 0.5,
			},
			"&.underConstruction": {
				"& > .construction": {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "inset 0 0 2rem 3rem #000C",
					"& > span": {
						border: "ridge 3px #FFF8",
						borderTopLeftRadius: "25% 50%",
						borderBottomLeftRadius: "25% 50%",
						borderTopRightRadius: "25% 50%",
						borderBottomRightRadius: "25% 50%",
						backgroundColor: "#468A",

						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: "0 0 0 1.5rem",

						fontSize: "4rem",
						fontWeight: "bold",
						color: "#DDD",
						textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",

						"& img": {
							height: "7rem",
							width: "7rem",
							margin: "-0.5rem",
						},
					},
				},
				"&.clickable:hover": {
					cursor: "pointer",
					border: "ridge 3px #F228",
					"& > .construction": {
						"& > span": {
							background: "#822A",
							border: "ridge 3px #F228",
						},
					},
				},
			},
		},
	}),
);

interface Props {
	building: Building;
	onClick?: (building: Building) => void;
	disabled?: boolean;
	underConstruction?: number;
	className?: string;
}

const BuildingSlot: FC<Props> = (props) => {
	const classes = useStyles();

	function click() {
		if (props.onClick) {
			props.onClick(props.building);
		}
	}

	const techs = props.building.techPreqs.map((tid: TECHIDS) => getTechById(tid));

	const turnsLeft = props.underConstruction !== undefined ? props.underConstruction : 0;

	return (
		<div
			onClick={click}
			className={`${classes.root}${props.disabled ? " disabled" : ""}${turnsLeft > 0 ? " underConstruction" : ""}${
				props.onClick !== undefined ? " clickable" : ""
			} ${props.className || ""}`}
		>
			<h1>{props.building.name}</h1>

			<p>{props.building.description}</p>

			{techs.length > 0 && (
				<div className="techPreq">
					{techs.map((t: Technology) => (
						<span key={t.id}>{t.name}</span>
					))}
				</div>
			)}

			<div className="costs">
				<div>
					<IconCredit /> {props.building.maintenanceCost}
				</div>
				<div>
					<IconScore /> {props.building.score}
				</div>
			</div>
		</div>
	);
};

export default BuildingSlot;
