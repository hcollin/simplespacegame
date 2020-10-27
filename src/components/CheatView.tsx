import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { joki, useService } from "jokits-react";
import React, { FC } from "react";
import { FactionModel, GameModel } from "../models/Models";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import FactionInfo from "./FactionInfo";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cheats: {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "14rem",
            backgroundColor: "#333",
            padding: "0.5rem",
            zIndex: 20,
            "& > h1": {
                color: "#FFFD",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                margin: "1rem 0 0.25rem 0",
                width: "100%",
                borderTop: "solid 1px #FFF8",
            }
        },
        rows: {
            marginTop: "5rem",
            display: "flex",
            flexDirection: "row",
        },
        nextTurn: {
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            zIndex: 100,
        },
    })
);

const CheatView: FC = () => {
    const classes = useStyles();
    const [game] = useService<GameModel>("GameService");
    

    const faction = useCurrentFaction();

    if (!game) return null;

    function readyAllFactions() {
        console.log("Ready all factions");
        if(game) {
            game.factions.forEach((fm: FactionModel) => {
                if(!game.factionsReady.includes(fm.id)) {
                    joki.trigger({
                        to: "GameService",
                        action: "ready",
                        data: fm.id
                    });
                }
            });
        }
    }

    function loginFaction(fm: FactionModel) {
        joki.trigger({
            to: "UserService",
            action: "switch",
            data: fm.playerId,
        });
    }


    return (
        <div className={classes.cheats}>
            <h1>Factions</h1>
            {game.factions.map((fm: FactionModel) => {
                const isDone = game.factionsReady.includes(fm.id);
                return <Button onClick={() => loginFaction(fm)} disabled={isDone} variant="contained" style={{marginBottom: "0.5rem"}} color={faction && faction.id === fm.id ? "primary": "default"}><img src={require(`../images/symbols/${fm.iconFileName}`)} alt={fm.name} height="32"/> {fm.name}</Button>
            })}

            <h1>Dev Commands</h1>
            <Button variant="contained" onClick={readyAllFactions}>Ready all factions</Button>
        </div>
    );
};

export default CheatView;
