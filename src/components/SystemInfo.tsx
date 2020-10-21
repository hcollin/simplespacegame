import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { plusEconomy, plusWelfare, plusIndustry, plusDefense } from "../services/commands/SystemCommands";

import BuildIcon from "@material-ui/icons/Build";
import SecurityIcon from "@material-ui/icons/Security";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import useMyCommands from "../hooks/useMyCommands";
import { Command, CommandType, SystemPlusCommand } from "../models/Commands";
import useUnitsInSelectedSystem from "../hooks/useUnitsInSelectedSystem";
import { UnitModel } from "../models/Models";
import UnitInfo from "./UnitInfo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "1rem",
        },
        value: {
            width: "15rem",

            padding: "0.5rem 0.5rem 0.5rem 0.5rem",
            fontSize: "1.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            // "border": "solid 1px black",
            // "borderRadius": "1rem",
            fontWeight: "bold",
            "& > button": {
                fontSize: "1.4rem",
                padding: 0,
            },
            "& > p": {
                margin: 0,
                padding: 0,
                fontSize: "1rem",
            },
        },
    })
);

const SystemInfo: FC = () => {
    const classes = useStyles();
    const [star] = useSelectedSystem();
    const comms = useMyCommands();
    const units = useUnitsInSelectedSystem();

    if (star === null) return null;

    const comPlusInd = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemIndustry && cs.targetSystem === star.id;
    }).length;
    const comPlusEco = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemEconomy && cs.targetSystem === star.id;
    }).length;
    const comPlusWlf = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemWelfare && cs.targetSystem === star.id;
    }).length;
    const comPlusDef = comms.filter((c: Command) => {
        const cs = c as SystemPlusCommand;
        return cs.type === CommandType.SystemDefense && cs.targetSystem === star.id;
    }).length;

    return (
        <div className={classes.root}>
            <h1>{star.name}</h1>

            <div className={classes.value}>
                <BuildIcon />
                {star.industry}
                <Button variant="contained" color="primary" onClick={() => plusIndustry(star.id)}>
                    +
                </Button>
                {comPlusInd > 0 && <p>+{comPlusInd}</p>}
            </div>
            <div className={classes.value}>
                <MonetizationOnIcon /> {star.economy}
                <Button variant="contained" color="primary" onClick={() => plusEconomy(star.id)}>
                    +
                </Button>
                {comPlusEco > 0 && <p>+{comPlusEco}</p>}
            </div>
            <div className={classes.value}>
                <SecurityIcon /> {star.defense}
                <Button variant="contained" color="primary" onClick={() => plusDefense(star.id)}>
                    +
                </Button>
                {comPlusDef > 0 && <p>+{comPlusDef}</p>}
            </div>
            <div className={classes.value}>
                <PeopleAltIcon /> {star.welfare}
                <Button variant="contained" color="primary" onClick={() => plusWelfare(star.id)}>
                    +
                </Button>
                {comPlusWlf > 0 && <p>+{comPlusWlf}</p>}
            </div>

            <h2>Units</h2>

            {units.map((u: UnitModel) => {
                return (
                  <UnitInfo key={u.id} unit={u} />
                );
            })}
        </div>
    );
};

export default SystemInfo;
