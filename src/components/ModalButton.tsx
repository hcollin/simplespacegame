import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modalbtn: {
			width: "3rem",
			cursor: "pointer",
			height: "3rem",
			zIndex: 1200,
			position: "absolute",
			boxShadow: "0 0 0.5rem 0.1rem #0008, inset 0 0 0.5rem 0.25rem #FFF3",
			fontWeight: "bold",
			borderRadius: "1.5rem",
			background: "#210C",
			border: "ridge 3px #FFF8",
			fontSize: "1.6rem",
			color: "#FFFA",
			transition: "all 0.2s ease",
			padding: 0,
            margin: 0,
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
			"&:hover": {
				backgroundColor: "#630C",
				color: "#FFFD",
            },
            "&.disabled": {
                filter: "grayscale(0.8)",
                opacity: 0.5,
            }
		},
	}),
);

interface Props {
	className?: string;
	children: any;
	onClick: () => void;
	disabled?: boolean;
}

const ModalButton: FC<Props> = (props) => {
	const classes = useStyles();

	return (
		<button disabled={props.disabled || false} className={`${classes.modalbtn} ${props.disabled === true ? "disabled" : ""} ${props.className || ""}`} onClick={props.onClick}>
			{props.children}
		</button>
	);
};

export default ModalButton;
