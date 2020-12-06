import { makeStyles, Theme, createStyles, Button, ButtonGroup, TextField, InputLabel } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { useAtom, useSetAtom } from "jokits-react";
import React, { FC, useState } from "react";
import PageContainer from "../../components/PageContainer";

import spaceStationJpg from "../../images/art/SpaceStation.jpg";
import { SHIPCLASS, ShipDesign, ShipWeapon } from "../../models/Units";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			zIndex: 2,
			// width: "100%",
			// height: "100vh",
			color: "#FFFD",
			background: "repeating-linear-gradient(0deg, #000 0, #024 4px, #012 16px)",
			padding: "2rem",
			overflowY: "auto",
			[theme.breakpoints.down("md")]: {
				padding: 0,
			},
		},
		nav: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-start",
			borderBottom: "ridge 3px #0008",
			margin: "1rem 0",
			padding: "0.5rem",
			"& > button": {
				marginRight: "1rem",
			},
		},
	}),
);

const UnitsView: FC = () => {
	const classes = useStyles();
	const faction = useCurrentFaction();

	const [unitView, setUnitview] = useAtom<string>("UnitViewDisplay", "ships");

	if (!faction) return null;

	return (
		<div className={classes.root}>
			<PageContainer color="#DD4" image={spaceStationJpg} font={faction.style.fontFamily}>
				<header>
					<h1>Units</h1>

					<div className="pointValue">Units</div>
				</header>

				<nav className={classes.nav}>
					<Button variant="contained" color={unitView === "ships" ? "primary" : "default"} onClick={() => setUnitview("ships")}>
						Ships
					</Button>
					<Button variant="contained" color={unitView === "designs" ? "primary" : "default"} onClick={() => setUnitview("designs")}>
						Designs
					</Button>
					<Button variant="contained" color={unitView === "parts" ? "primary" : "default"} onClick={() => setUnitview("parts")}>
						Parts
					</Button>
				</nav>

				{unitView === "ships" && <ShipsView />}
				{unitView === "designs" && <DesignsView />}
				{unitView === "designer" && <ShipDesigner />}
				{unitView === "parts" && <PartsView />}
			</PageContainer>
		</div>
	);
};

const ShipsView: FC = () => {
	return (
		<div>
			<h2>Ships</h2>
		</div>
	);
};

interface ShipCustomDesign {
	name: string;
	pointsMax: number;
	pointsUsed: number;

	weapons: ShipWeapon[];

	hullType: SHIPCLASS;

	hullAdjustment: number;
}

const DesignsView: FC = () => {
	const [designs, setDesigns] = useState<ShipCustomDesign[]>([]);
	const setUnitview = useSetAtom<string>("UnitViewDisplay");

	return (
		<div>
			<h2>Designs</h2>

			<Button variant="contained" startIcon={<AddCircle />} onClick={() => setUnitview("designer")}>
				New Design
			</Button>
		</div>
	);
};

const PartsView: FC = () => {
	return (
		<div>
			<h2>Parts</h2>
		</div>
	);
};

interface ShipDesignSpec {
	shipClass: SHIPCLASS;
	points: number;
	hull: number;
}

const ShipDesignSpecs: ShipDesignSpec[] = [
	{
		shipClass: SHIPCLASS.CORVETTE,
		points: 10,
		hull: 60,
	},
	{
		shipClass: SHIPCLASS.FRIGATE,
		points: 25,
		hull: 110,
	},
	{
		shipClass: SHIPCLASS.DESTROYER,
		points: 45,
		hull: 150,
	},
	{
		shipClass: SHIPCLASS.CRUISER,
		points: 65,
		hull: 180,
	},
];

function getDesignSpecByShipClass(sc: SHIPCLASS): ShipDesignSpec {
	const sp = ShipDesignSpecs.find((sd: ShipDesignSpec) => sd.shipClass === sc);
	if (!sp) {
		throw new Error(`Unknown ship Spec ${sc}`);
	}
	return sp;
}

const ShipDesigner: FC = () => {
	const [design, setDesign] = useState<ShipCustomDesign>({
		name: "Unknown class",
		pointsMax: ShipDesignSpecs[0].points,
		pointsUsed: 0,
		weapons: [],
		hullType: ShipDesignSpecs[0].shipClass,
		hullAdjustment: 0,
	});

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setName(event.target.value);
		setDesign({ ...design, name: event.target.value });
	};

	const handleHullTypeChange = (sc: SHIPCLASS) => {
		const nSpec = getDesignSpecByShipClass(sc);
		setDesign({ ...design, hullType: sc, pointsMax: nSpec.points });
	};

	const handleHullAdjustment = (adj: number) => {
		const newAdj = design.hullAdjustment + adj;
		const np = design.pointsUsed + adj;
		setDesign({ ...design, hullAdjustment: newAdj, pointsUsed: np });
	};

	const availableTypes: SHIPCLASS[] = [SHIPCLASS.CORVETTE, SHIPCLASS.FRIGATE, SHIPCLASS.DESTROYER, SHIPCLASS.CRUISER];

	const currentSpec = getDesignSpecByShipClass(design.hullType);

	const currentHull = currentSpec.hull + (design.hullAdjustment*5);

	return (
		<div>
			<h2>
				Designer {design.pointsUsed} / {design.pointsMax}{" "}
			</h2>

			<div>
				<InputLabel>Ship Class Name</InputLabel>
				<TextField value={design.name} variant="outlined" onChange={handleNameChange} />
			</div>

			<div>
				<ButtonGroup>
					{availableTypes.map((sc: SHIPCLASS) => {
						return (
							<Button
								variant="contained"
								key={sc}
								color={design.hullType === sc ? "primary" : "default"}
								onClick={() => handleHullTypeChange(sc)}
							>
								{sc}
							</Button>
						);
					})}
				</ButtonGroup>
			</div>

			<div>
				<InputLabel>Hull</InputLabel>
				<Button variant="contained" onClick={() => handleHullAdjustment(-1)}>
					-
				</Button>
				<h3>{currentHull}</h3>
				<Button variant="contained" onClick={() => handleHullAdjustment(1)}>
					+
				</Button>
			</div>
		</div>
	);
};

export default UnitsView;
