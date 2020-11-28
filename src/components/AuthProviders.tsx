import classes from "*.module.css";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import DATAUSERS from "../data/dataUser.";
import { User } from "../models/User";
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
				{isDev && <h4>Development Users</h4>}
				{isDev &&

					DATAUSERS.map((usr: User, ind: number) => {
						return (
							<Button variant="contained" fullWidth color="primary" onClick={() => loginInDev(ind)} key={usr.id}>
								{usr.name}
							</Button>
						);
					})}
			</div>
		</Wrapper>
	);
};

export default AuthProviders;
