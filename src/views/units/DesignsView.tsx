import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { AddCircle, Cancel, Delete, Edit } from "@material-ui/icons";
import { useAtom, useSetAtom } from "jokits-react";
import React, { FC, useState } from "react";
import ShipInfo from "../../components/ShipInfo";
import { ShipDesign } from "../../models/Units";
import { doRemoveShipDesign } from "../../services/commands/FactionCommands";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			height: "100%",
			[theme.breakpoints.down("sm")]: {
				flexWrap: "wrap",
			},
			[theme.breakpoints.up("md")]: {
				flexWrap: "nowrap",
			},
			"&.leftAlign": {
				justifyContent: "flex-start",
				alignItems: "flex-start",
			},
			"&.wrap": {
				flexWrap: "wrap",
			},
		},
		layer: {
			position: "relative",

			"& > .buttons": {
				position: "absolute",
				top: 0,
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-around",
				zIndex: 100,
				background: "#0008",
				boxShadow: "inset 0 0 2rem 0.5rem #000",
				borderRadius: "0.5rem",
			},
		},
	}),
);

const DesignsView: FC = () => {
	const classes = useStyles();
	const setUnitview = useSetAtom<string>("UnitViewDisplay");
	const faction = useCurrentFaction();

	const [selectedDesign, setSelectedDesign] = useState<ShipDesign | null>(null);

	const [editableDesign, setEditableDesign] = useAtom<ShipDesign | null>("editShipDesign", null);

	if (!faction) return null;

	function editDesign() {
		if (selectedDesign) {
			setEditableDesign(selectedDesign);
			setUnitview("designer");
		}
	}

	function removeDesign() {
		if (selectedDesign && faction) {
			doRemoveShipDesign(selectedDesign, faction.id);
		}
    }
    
    function newDesign() {
        setEditableDesign(null);
        setUnitview("designer");
    }

	return (
		<div>
			<h2>Designs</h2>

			<div className={classes.row}>
				{faction.shipDesigns.map((sd: ShipDesign) => {
					if (selectedDesign !== null && selectedDesign.id === sd.id) {
						return (
							<div className={classes.layer} key={sd.id}>
								<ShipInfo ship={sd} />
								<div className="buttons">
									<Button variant="contained" color="primary" onClick={editDesign}>
										<Edit />
									</Button>
									<Button variant="contained" color="secondary" onClick={removeDesign}>
										<Delete />
									</Button>
									<Button variant="contained" color="default" onClick={() => setSelectedDesign(null)}>
										<Cancel />
									</Button>
								</div>
							</div>
						);
					}

					return <ShipInfo ship={sd} key={sd.id} onClick={() => setSelectedDesign(sd)} />;
				})}
			</div>

			<Button variant="contained" startIcon={<AddCircle />} onClick={newDesign}>
				New Design
			</Button>
		</div>
	);
};

export default DesignsView;
