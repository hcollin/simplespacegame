import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC, useState } from "react";

import LayersIcon from "@material-ui/icons/Layers";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: "relative",
			margin: 0,
			width: "auto",
			height: "auto",
		},

		btn: {
			position: "relative",
			margin: 0,
			width: "100%",
		},
		sub: {
			position: "absolute",
			// left: "calc(100% + 1rem)",
			// top: 0,
			display: "flex",
			// flexDirection: "row",
			"& > *": {
				marginRight: "0.5rem",
			},
			"&.up": {
				left: 0,
				bottom: "calc(100% + 1rem)",
				flexDirection: "column",
			},
			"&.down": {
				left: 0,
				top: "calc(100% + 1rem)",
				flexDirection: "column",
			},
			"&.right": {
				left: "calc(100% + 1rem)",
				top: 0,
				flexDirection: "row",
			},
			"&.left": {
				right: "calc(100% + 1rem)",
				top: 0,
				flexDirection: "row",
			},
		},
	}),
);

interface Props {
	children: any;
	icon?: JSX.Element | null;
	text?: string;
	direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
	className?: string;
	color?: "primary" | "secondary" | "default";
	variant?: "outlined" | "contained" | "text";
}

const SubMenuButton: FC<Props> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState<boolean>(false);

	const dir = props.direction ? props.direction.toLowerCase() : "right";

	return (
		<div className={classes.root}>
			<Button
				onClick={() => setOpen((prev: boolean) => !prev)}
				className={`subMenuButton ${props.className || ""}`}
				color={props.color || "default"}
				variant={props.variant || "contained"}
			>
				{props.icon === null ? "" : props.icon ? props.icon : <MenuIcon />}
				{props.text || ""}
			</Button>
			{open && <div className={`submenu ${classes.sub} ${dir}`}>{props.children}</div>}
		</div>
	);
};

export default SubMenuButton;
