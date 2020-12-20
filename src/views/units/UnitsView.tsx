import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useAtom } from "jokits-react";
import React, { FC } from "react";

import { IconCredit } from "../../components/Icons";

import PageContainer from "../../components/PageContainer";

import useCurrentGame from "../../hooks/useCurrentGame";

import spaceStationJpg from "../../images/art/SpaceStation.jpg";
import { ShipUnit } from "../../models/Units";

import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { getShipMaintenance } from "../../utils/unitUtils";
import CombatSimulator from "./CombatSimulator";
import DesignsView from "./DesignsView";
import ShipDesigner from "./ShipDesigner";
import ShipsView from "./ShipsView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #024 4px, #012 16px)",
            padding: "2rem",
            overflowY: "auto",

            "& > div > header": {
                backgroundPosition: "center 30%",
            },

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
    })
);

const UnitsView: FC = () => {
    const classes = useStyles();
    const faction = useCurrentFaction();
    const game = useCurrentGame();

    const [unitView, setUnitview] = useAtom<string>("UnitViewDisplay", "ships");
    

    if (!faction || !game) return null;

    const unitUpkeep = game.units.reduce((cost: number, unit: ShipUnit) => {
        if (unit.factionId === faction.id) {
            const maint = getShipMaintenance(unit, faction);
            return cost + maint;
        }
        return cost;
    }, 0);

    return (
        <div className={classes.root}>
            <PageContainer color="#DD4" image={spaceStationJpg} font={faction.style.fontFamily}>
                <header>
                    <h1>Units</h1>

                    <div className="pointValue">
                        <IconCredit size="xl" wrapper="dark" />
                        <h1>{unitUpkeep} </h1>
                        <span>/ turn</span>
                    </div>
                </header>

                <nav className={classes.nav}>
                    <Button
                        variant="contained"
                        color={unitView === "ships" ? "primary" : "default"}
                        onClick={() => setUnitview("ships")}
                    >
                        Ships
                    </Button>
                    <Button
                        variant="contained"
                        color={unitView === "designs" ? "primary" : "default"}
                        onClick={() => setUnitview("designs")}
                    >
                        Designs
                    </Button>
                    <Button
                        variant="contained"
                        color={unitView === "parts" ? "primary" : "default"}
                        onClick={() => setUnitview("parts")}
                    >
                        Parts
                    </Button>
                    <Button
                        variant="contained"
                        color={unitView === "combatsim" ? "primary" : "default"}
                        onClick={() => setUnitview("combatsim")}
                    >
                        Combat Simulator
                    </Button>
                </nav>

                {unitView === "ships" && <ShipsView />}
                {unitView === "designs" && <DesignsView />}
                {unitView === "designer" && <ShipDesigner />}
                {unitView === "parts" && <PartsView />}
                {unitView === "combatsim" && <CombatSimulator />}
            </PageContainer>
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

export default UnitsView;
