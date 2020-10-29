import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import { doCreateNewGame } from "../services/commands/GameCommands";
import useCurrentUser from "../services/hooks/useCurrentUser";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "1rem",
            background: "radial-gradient(#444, black)",
            color: "#FFFD",
            minHeight: "100vh",
            "& > header": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                "& > div.logins": {
                    "& > button": {
                        marginLeft: "0.5rem",
                    }
                }
            }
        }
    }));

const MenuPage: FC = () => {
    const classes = useStyles();
    
    const [playerCount] = useState<number>(4);

    const [user, send] = useCurrentUser();

    function loginWithGoogle() {
        if (!user) {
            send("loginWithGoogle");
        }
    }

    function loginInDev() {
        if(!user) {
            send("loginAsDev");
        }
    }

    function clickNewGame() {
        doCreateNewGame(playerCount);
    }
    return (
        <div className={classes.root}>
            <header>
                <h1>Frost Galaxy</h1>

                {!user && <div className="logins">
                    <Button variant="contained" color="primary" onClick={loginWithGoogle}>Login with Google</Button>
                    <Button variant="contained" color="primary" onClick={loginInDev}>Login DEVELOPMENT</Button>
                </div>}
                {user && <div><p>Welcome {user.name}</p></div>}
            </header>

            {user &&

                <div>
                    <h2>Create a new game</h2>

                    <Button variant="contained" color="primary" onClick={clickNewGame}>New {playerCount} player Game</Button>


                </div>
            }


            {user && <div>
                <h2>List of Games</h2>
            </div>}

        </div>
    )
}

export default MenuPage;