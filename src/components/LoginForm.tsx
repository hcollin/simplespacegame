import { Button, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import React, { FC, useState } from "react";
import useCurrentUser from "../services/hooks/useCurrentUser";
import Wrapper from "./Wrapper";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			"& >.field": {
				marginBottom: "1rem",
			},
			"&> .buttons": {
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			},
		},
	}),
);

const LoginForm: FC = () => {
	const classes = useStyles();
	const [email, setEmail] = useState<string>("test@test.com");
    const [passwd, setPasswd] = useState<string>("");
    
    const [registerOn, setRegisterOn] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>("");

	const [user, send] = useCurrentUser();

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswd(event.target.value);
    };
    
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(event.target.value);
	};

	function login(e: any) {
		e.preventDefault();
		send("loginEmailPasswd", {
			email: email,
            passwd: passwd,
            
		});
		setEmail("");
		setPasswd("");
	}

	function register(e: any) {
        e.preventDefault();
		send("registerEmailPassword", {
			email: email,
            passwd: passwd,
            name: userName,
		});
		setEmail("");
		setPasswd("");
	}

	return (
		<Wrapper title={registerOn ? "Register" : "Login"}>
			<form onSubmit={registerOn ? register : login} className={classes.form}>
				<TextField fullWidth type="email" value={email} label="Email" onChange={handleEmailChange} variant="outlined" className="field loginEmail" />
				<br />

				<TextField
					fullWidth
					type="password"
					value={passwd}
					label="Password"
					onChange={handlePasswdChange}
					variant="outlined"
					className="field loginPasswd"
				/>

                {registerOn && <TextField fullWidth type="text" value={userName} label="Display Name" onChange={handleNameChange} variant="outlined" className="field userName" />}

				<div className="buttons">
					<Button variant="outlined" color="default" onClick={() => setRegisterOn((prev: boolean) => !prev)}>
						{registerOn ? "Cancel" : "Register"}
					</Button>
					<Button type="submit" variant="contained" color="primary">
						{registerOn ? "Submit" : "Login"}
					</Button>
				</div>
			</form>
		</Wrapper>
	);
};

export default LoginForm;
