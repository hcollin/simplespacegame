import classes from "*.module.css";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import useCurrentUser from "../services/hooks/useCurrentUser";
import Wrapper from "./Wrapper";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			"& > button": {
				marginBottom: "0.5rem",
			},
		},
	}),
);

const ENV = process.env.NODE_ENV;

const AuthProviders: FC = () => {
	const classes = useStyles();
	const [user, send] = useCurrentUser();

	function loginWithGoogle() {
		if (!user) {
			send("loginWithGoogle");
		}
	}

	function loginInDev(ind: number) {
		if (!user) {
			send("loginAsDev", ind);
		}
	}

	const isDev = ENV === "development";

	return (
		<Wrapper title="Providers">
			<div className={classes.root}>
				<Button variant="contained" color="primary" fullWidth onClick={loginWithGoogle}>
					Google
				</Button>
				{isDev && (
					<>
						<Button variant="contained" fullWidth color="primary" onClick={() => loginInDev(0)}>
							Login DEV-1
						</Button>
						<Button variant="contained" color="primary" fullWidth onClick={() => loginInDev(1)}>
							Login DEV-2
						</Button>
						<Button variant="contained" color="primary" fullWidth onClick={() => loginInDev(2)}>
							Login DEV-3
						</Button>
						<Button variant="contained" color="primary" fullWidth onClick={() => loginInDev(3)}>
							Login DEV-4
						</Button>
					</>
				)}
			</div>
		</Wrapper>
	);
};

export default AuthProviders;
