import React, { FC, useState } from "react";
import MenuPageContainer from "../components/MenuPageContainer";
import { FactionModel, FactionSetup, GameModel } from "../models/Models";
import { doCloseCurrentGame, doJoinGame } from "../services/commands/GameCommands";
import { SERVICEID } from "../services/services";
import { useService } from "jokits-react";
import FactionSetupView from "../components/FactionSetup";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import FactionBlock from "../components/FactionBlock";
import useCurrentUser from "../services/hooks/useCurrentUser";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        faction: {
            display: "flex",
            flexDirection: "row",
            "& > div.block": {
                width: "2rem",
                height: "2rem",
                marginRight: "1rem",
            },
            "& > h3": {
                fontWeight: "normal",
            },
        },
        freeSlot: {
            padding: "1rem",
            fontSize: "1.4rem",
            border: "dashed 3px #BDF4",
            borderRadius: "1rem",
            fontStyle: "italic",
            marginBottom: "0.5rem",
            color: "#BDF8",
        }
    })
);

const JoinGameView: FC = () => {
    const classes = useStyles();
    const [factionSetup, setFactionSetup] = useState<FactionSetup | undefined>(undefined);
    const [game] = useService<GameModel>(SERVICEID.GameService);
    const [user] = useCurrentUser();

    if (!game || !user) return null;

    function setFaction(fs: FactionSetup) {
        setFactionSetup(fs);
    }

    function joinGame() {
        if(factionSetup) {
            doJoinGame(factionSetup);
        }
    }

    const alreadyJoined = game.factions.find((fm: FactionModel) => fm.playerId === user.userId) !== undefined;

    const freePlayerSlots = game.setup.playerCount - game.factions.length;

    const freeSlots: string[] = [];
    for(let i=0; i < freePlayerSlots; i++) {
        freeSlots.push(`slot-${i}`);
    }

    return (
        <MenuPageContainer title={`${game.name}: Join game`} backHandler={doCloseCurrentGame}>
            <div className="actions">
                {!alreadyJoined && <Button variant="contained" color="primary" onClick={joinGame}>
                    Join Game
                </Button>}
            </div>

            {!alreadyJoined && <FactionSetupView onChange={setFaction} factions={game.factions} />}

            <section>
                <h2>Factions</h2>

                {game.factions.map((fm: FactionModel) => {
                    return <FactionBlock faction={fm} key={fm.id} size="lg" />;
                })}
                {freeSlots.map((s: string) => {
                    return (
                        <div key={s} className={classes.freeSlot}>
                            Waiting for a player to join...
                        </div>
                    )
                })}

            </section>
        </MenuPageContainer>
    );
};

export default JoinGameView;
