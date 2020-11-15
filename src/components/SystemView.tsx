import { makeStyles, Theme, createStyles, Button, Grid } from "@material-ui/core";
import { useService } from "jokits-react";
import React, { FC } from "react";
import useMyCommands from "../hooks/useMyCommands";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { GameModel } from "../models/Models";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import useCurrentUser from "../services/hooks/useCurrentUser";
import useUserIsReady from "../services/hooks/useUserIsReady";
import { SERVICEID } from "../services/services";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: "fixed",
			top: "1rem",
			right: "20rem",
			bottom: "1rem",
			width: "auto",
			minWidth: "40rem",
			background: "linear-gradient(90deg, #000 0,#333 20px, #666 40px, #222 60px,#181820 calc(100% - 20px), #111 calc(100% - 10px), #000 100%)",
            zIndex: 1000,
            color: "#FFFA",
            boxShadow: "inset 0 0 8rem 2rem #000",
            borderRadius: "1rem",
            border: "groove 5px #FFF4",
            "&:after": {
                content: '""',
                userSelect: "none",
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: -1,
                background: "repeating-linear-gradient(200deg, #000 0, #3338 5px, transparent 10px, #BDF1 120px, transparent 150px, #4448 155px, #000 160px)",
                borderRadius: "1rem",
            },
            "& > header": {
                borderBottom: "solid 3px #0008",
                padding: "0.5rem 1rem",
            }
		},
		flexRow: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
        },
        contentArea: {
            padding: "0.5rem",
            
            background: "#0003",
            boxShadow: "inset 0 0 2rem 1rem #0008",
        }
	}),
);

const SystemView: FC = () => {
	const classes = useStyles();

	const [star, setStar] = useSelectedSystem();
	// const comms = useMyCommands();
	// const [user] = useCurrentUser();
	const [game] = useService<GameModel>(SERVICEID.GameService);
	const faction = useCurrentFaction();
	// const userIsReady = useUserIsReady();

	if (!star || !game || !faction) {
		return null;
	}

	function close() {
		setStar(null);
	}

	return (
		<div className={classes.root}>
			<header className={`${classes.flexRow}`}>
				<h1>{star.name}</h1>
				<Button variant="contained" color="secondary" onClick={close}>
					X{" "}
				</Button>
			</header>

			<Grid container>
				<Grid item lg={12}>
					<p>{star.description}</p>
					<p>{star.keywords.join(", ")}</p>
				</Grid>

				<Grid item lg={5} className={classes.contentArea}>
					<h2>Infrastructure</h2>
				</Grid>
				
                <Grid item lg={5} className={classes.contentArea}>
                    <h2>Stats</h2>
                </Grid>
                
                <Grid item lg={2}>
                    <h2>Commands</h2>
                </Grid>



                <Grid item lg={7} className={classes.contentArea}>
					<h2>Buildings</h2>
				</Grid>
			</Grid>
		</div>
	);
};

export default SystemView;
