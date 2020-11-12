import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import { GameModel, SystemModel } from "../../models/Models";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { factionValues } from "../../utils/factionUtils";
import DataTable, { ColumnProps } from "../../components/DataTable";
import { getSystemEconomy, SystemEconomy } from "../../utils/systemUtils";
import PageContainer from "../../components/PageContainer";

import economyimg from '../../images/art/economy.jpg';
import { IconCredit } from "../../components/Icons";

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
                color: "#FFFE",
                borderRadius: "1rem",
                width: "calc(100% - 18rem)",
                background:
                    "linear-gradient(180deg, #000 0, #555 1.5rem, #999 3rem, #555 4.5rem, #444 94%, #555 96%, #444 98%, #000 100%)",
                border: "ridge 5px #FFD4",
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
        },
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
                if (value < 0) return <span className="red">{value}</span>;
                return <span className="green">{value}</span>;
            },
        },
        {
            key: "research",
            header: "Research",
            size: 100,
            className: "center",
        },
    ];

    return (
        <div className={classes.root}>
            <PageContainer color="#DD4" image={economyimg} font={faction.style.fontFamily}>

                <header>
                    <h1>Economy</h1>


                    <div className="pointValue">
                        <IconCredit size="xl" wrapper="dark" />
                        <h1>{fValues.income} </h1>
                        <span>/ turn</span>
                    </div>


                </header>


                <h2>Summary</h2>

                <div className={classes.row}>
                    <h4>Total Profit: {fValues.income}</h4>
                    <h5>Total Income: {fValues.totalEconomy}</h5>
                    <h5>Total Expenses: {fValues.expenses}</h5>

                    <h5>Trade Income: {fValues.trade}</h5>

                    <p>Unit Cost: {fValues.unitExpenses}</p>
                    <p>System Cost: {fValues.systemExpenses}</p>
                </div>

                <h2>Systems</h2>

                <div>
                    <DataTable columns={columns} rows={mySystems} />
                </div>
            </PageContainer>
        </div>
    );
};

export default EconomySheet;