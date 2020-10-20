import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC } from "react";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { plusEconomy, plusWelfare, plusIndustry, plusDefense } from "../services/commands/SystemCommands";

import BuildIcon from '@material-ui/icons/Build';
import SecurityIcon from '@material-ui/icons/Security';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: "1rem",
    },
    value: {
        "width": "15rem",
        
        "padding": "0.5rem 0.5rem 0.5rem 0.5rem",
        "fontSize": "1.8rem",
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        
        // "border": "solid 1px black",
        // "borderRadius": "1rem",
        fontWeight: "bold",
        "& > button": {
            fontSize: "1.4rem",
            padding: 0,
        }
    }
}))


const SystemInfo: FC = () => {
    const classes = useStyles();
    const [star] = useSelectedSystem()

    if (star === null) return null;

    return (
        <div className={classes.root}>
            <h1>{star.name}</h1>



            <div className={classes.value}><BuildIcon />{star.industry} <Button variant="contained" color="primary" onClick={() => plusIndustry(star.id)}>+</Button> </div>
            <div className={classes.value}><MonetizationOnIcon /> {star.economy} <Button variant="contained" color="primary" onClick={() => plusEconomy(star.id)}>+</Button> </div>
            <div className={classes.value}><SecurityIcon /> {star.defense} <Button variant="contained" color="primary" onClick={() => plusDefense(star.id)}>+</Button> </div>
            <div className={classes.value}><PeopleAltIcon /> {star.welfare} <Button variant="contained" color="primary" onClick={() => plusWelfare(star.id)}>+</Button> </div>

            
        </div>
    )
}

export default SystemInfo;