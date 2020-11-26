import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
            position: "relative",
			padding: "1.5rem 1rem",
			width: "20rem",
			border: "ridge 3px #FFF4",
			borderRadius: "1rem",
			boxShadow: "inset 0 0 1rem 0.5rem #0008",
            background: "#1254",
            marginTop: "2rem",
			"& > h2": {
				margin: 0,
				padding: 0,
                marginBottom: "0.5rem",
                position: "absolute",
                top: "-2rem",
                color: "#ACFD",
                textShadow: "2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 2px #000, 2px -2px 2px #000",

			},
		},
	}),
);

interface Props {
    children: any;
    title?: string;
    className?: string;
}

const Wrapper: FC<Props> = (props) => {
    const classes = useStyles();

    return <div className={`${classes.root} ${props.className || ""}`}>
        {props.title && <h2>{props.title}</h2>}
        {props.children}
    </div>

}

export default Wrapper;