import { makeStyles, Theme, createStyles, Table, TableHead, TableCell, TableRow, TableBody } from "@material-ui/core"
import { useService } from "jokits-react";
import React, { FC } from "react"
import { GameModel, SystemModel } from "../../models/Models";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { factionValues } from "../../utils/factionUtils";

import { DataGrid, ColDef, RowsProp } from '@material-ui/data-grid';
import DataTable, { ColumnProps } from "../../components/DataTable";


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        height: "100vh",
        color: "#FFFD",
        background: "repeating-linear-gradient(0deg, #000 0, #222 4px, #111 16px)",
        minHeight: "100vh",
        padding: "2rem",

        "& > div.page": {
            marginTop: "4rem",
            padding: "1rem",
            background: "#444D",
            color: "#FFFE",
            borderRadius: "1rem",
            width: "calc(100% - 28rem)",
        }
    },
    systems: {
        color: "#FFFD",
        minHeight: "10rem",
       
    }
}));


const EconomySheet: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();

    if (!game || !faction) return null;

    const values = factionValues(game, faction.id);

    const mySystems = game.systems.filter((sm: SystemModel) => sm.ownerFactionId === faction.id);

     const columns: ColumnProps[] = [
        {
            key: "id",
            header: "ID",
            size: 100,
        },
        {
            key: "name",
            header: "Name",
            size: 300,
        },
        {
            key: "industry",
            header: "Industry",
            size: 100,
        },
        {
            key: "economy",
            header: "Economy",
            size: 100,
        },
        {
            key: "defense",
            header: "Defense",
            size: 100,
        },
        {
            key: "welfare",
            header: "Welfare",
            size: 100,
        },
     ];

     

    console.log(mySystems);
    return <div className={classes.root}>

        <div className="page">
            <h1>Economy</h1>

            <h2>Systems</h2>

            <div>
               <DataTable columns={columns} rows={mySystems} />
            </div>


        </div>




    </div>
}


export default EconomySheet;
