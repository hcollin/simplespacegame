import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { useSetAtom } from "jokits-react";
import React, { FC } from "react";
import ShipInfo from "../../components/ShipInfo";
import { ShipDesign } from "../../models/Units";
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
    })
);

const DesignsView: FC = () => {
    const classes = useStyles();
    const setUnitview = useSetAtom<string>("UnitViewDisplay");
    const faction = useCurrentFaction();
    
    if (!faction) return null;

    return (
        <div>
            <h2>Designs</h2>

            <div className={classes.row}>
                {faction.shipDesigns.map((sd: ShipDesign) => {
                    return <ShipInfo ship={sd} key={sd.id} />;
                })}
            </div>

            <Button variant="contained" startIcon={<AddCircle />} onClick={() => setUnitview("designer")}>
                New Design
            </Button>
        </div>
    );
};

export default DesignsView;
