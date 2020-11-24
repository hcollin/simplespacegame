import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { ShipUnit } from "../models/Units";
import { getFactionById } from "../utils/factionJokiUtils";
import { getFactionAdjustedUnit } from "../utils/unitUtils";
import { IconDamage, IconHull, IconShields, IconSpeed, IconTroops } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			borderRadius: "0.5rem",
			border: "ridge 3px #FFF4",
			background: "linear-gradient(180deg, #000, #333 1rem, #333 calc(100% - 1rem), #000 100%)",
			overflow: "hidden",
			"& > header": {
				color: "white",
				textShadow: "2px 2px 2px #000,-2px 2px 2px #000,-2px -2px 2px #000,2px -2px 2px #000",
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
                width: "40rem",
                height: "3rem",

				"& h1": {
					fontSize: "1rem",
					margin: 0,
					padding: 0,
				},
				"& h2": {
					fontSize: "0.65rem",
					textTransform: "uppercase",
					margin: 0,
					padding: 0,
				},
				"& > div": {
					
					"&.name": {
						width: "20rem",
						borderBottomRightRadius: "2rem",
                        padding: "0.25rem 0.5rem 0.25rem 3rem",
                        position: "relative",
                        boxShadow: "inset 0 0 0.5rem 3px #0008",
                        "& > img": {
                            textAlign: "center",
                            marginRight: "0.5rem",
                            height: "2rem",
                            width: "2rem",
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                        }
					},
					"&.state": {
						
						textAlign: "right",
						paddingRight: "0.5rem",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
                        justifyContent: "space-around",
                        height: "100%",

						"& > span": {
                            
                            display: "flex",
						    flexDirection: "row",
						    alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 0.5rem",
                            borderLeft: "solid 1px #000",
                            height: "100%",
                            "& > img": {
                                marginRight: "0.5rem",
                            },

                        },
					},

					
				},
			},
		},
	}),
);

interface MiniUnitInfoProps {
	unit: ShipUnit;
	onClick?: (unit: ShipUnit) => void;
	selected?: boolean;
	className?: string;
}

const MiniUnitInfo: FC<MiniUnitInfoProps> = (props) => {
	const classes = useStyles();
    const faction = getFactionById(props.unit.factionId);
    
    function click() {
        if(props.onClick) {
            props.onClick(props.unit);
        }
    }

    const ship = getFactionAdjustedUnit(faction, props.unit);

	return (
		<div className={`${classes.root} ${props.className || ""}`} onClick={click}>
			<header>
                
				<div className="name" style={{ background: faction.color }}>
                    <img src={require(`../images/symbols/${faction.iconFileName}`)} alt={faction.name} />
					<h2>{ship.typeClassName}</h2>
					<h1>{ship.name}</h1>
				</div>

				<div className="state">
					<span>
						<IconHull /> {ship.hull - ship.damage} / {ship.hull}
					</span>

					<span>
						<IconShields /> {ship.shields} / {ship.shieldsMax}
					</span>

					<span>
						<IconSpeed /> {ship.speed}
					</span>

                    <span>
						<IconTroops /> {ship.troops}
					</span>
				</div>
			</header>
		</div>
	);
};

export default MiniUnitInfo;
