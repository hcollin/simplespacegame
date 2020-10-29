import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import { GameModel, SystemModel } from "../../models/Models";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { factionValues } from "../../utils/factionUtils";
import DataTable, { ColumnProps } from "../../components/DataTable";
import { getSystemEconomy, SystemEconomy } from "../../utils/systemUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            width: "100%",
            height: "100vh",
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #320 4px, #210 16px)",
            minHeight: "100vh",
            padding: "2rem",

            "& > div.page": {
                marginTop: "4rem",
                padding: "1rem",
                background: "#444D",
                color: "#FFFE",
                borderRadius: "1rem",
                width: "calc(100% - 28rem)",
            },
            "& span.red": {
                color: "red",
                fontWeight: "bold",
                
            },
            "& span.green": {
                color: "green",
                fontWeight: "bold",
                
            },
        },
        systems: {
            color: "#FFFD",
            minHeight: "10rem",
        },
        row: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
        }
    })
);

interface ExtSystem extends SystemModel {
    profit: number;
    income: number;
}

const EconomySheet: FC = () => {
    const classes = useStyles();

    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();

    if (!game || !faction) return null;

    const fValues = factionValues(game, faction.id);

    const mySystems: SystemEconomy[] = game.systems.reduce((econ: SystemEconomy[], sm: SystemModel) => {
        if (sm.ownerFactionId === faction.id) {
            econ.push(getSystemEconomy(sm));
        }
        return econ;
    }, []);

    const columns: ColumnProps[] = [
        {
            key: "name",
            header: "Name",
            size: 300,
        },
        {
            key: "industry",
            header: "Industry",
            size: 100,
            className: "center",
        },
        {
            key: "economy",
            header: "Economy",
            size: 100,
            className: "center",
        },
        {
            key: "defense",
            header: "Defense",
            size: 100,
            className: "center",
        },
        {
            key: "welfare",
            header: "Welfare",
            size: 100,
            className: "center",
        },
        {
            key: "income",
            header: "Income",
            size: 80,
            className: "center",
        },
        {
            key: "industryExpenses",
            header: "Ind Cost",
            size: 80,
            className: "center",
        },
        {
            key: "welfareExpenses",
            header: "Wlf Cost",
            size: 80,
            className: "center",
        },
        {
            key: "defenseExpenses",
            header: "Def Cost",
            size: 80,
            className: "center",
        },
        {
            key: "profit",
            header: "Profit",
            size: 80,
            className: "center bigText",
            wrapper: (value: string | number, item: any, index: number, isHeader) => {
                if (isHeader) return value;
                console.log("Profit ", value);
                if (value < 0) return <span className="red">{value}</span>;
                return <span className="green">{value}</span>;
            },
        },
        {
            key: "research",
            header: "Research",
            size: 100,
            className: "center",
        }
    ];

    console.log(mySystems);
    return (
        <div className={classes.root}>
            <div className="page">
                <h1>Economy</h1>

                <h2>Summary</h2>

                <div className={classes.row}>
                    <h4>Total Profit: {fValues.income}</h4>
                    <h5>Total Income: {fValues.totalEconomy}</h5>
                    <h5>Total Expenses: {fValues.expenses}</h5>
                    
                    <p>Unit Cost: {fValues.unitExpenses}</p>
                    <p>System Cost: {fValues.systemExpenses}</p>
                </div>

                <h2>Systems</h2>

                <div>
                    <DataTable columns={columns} rows={mySystems} />
                </div>
            </div>
        </div>
    );
};

export default EconomySheet;
