import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-evenly",

			"& > div.dot": {
				borderRadius: "50%",
				backgroundColor: "#888",
				width: "0.75rem",
				height: "0.75rem",
				boxShadow: "inset 0 0 6px 2px #0008",

				"&.on": {
					backgroundColor: "#4C4",
					boxShadow: "inset 0 0 6px 2px #0004",
				},
			},

			"&.sm": {
				"& > div.dot": {
					width: "0.5rem",
					height: "0.5rem",
                    boxShadow: "inset 0 0 2px 1px #0008",
                    "&.on": {
                        boxShadow: "inset 0 0 2px 1px #0004",
                    },
				},
			},

			"&.lg": {
				"& > div.dot": {
					width: "1rem",
					height: "1rem",
                    boxShadow: "inset 0 0 0.25rem 3px #0008",
                    "&.on": {
                        boxShadow: "inset 0 0 0.25rem 3px #0004",
                    },
				},
			},

			"&.xl": {
				"& > div.dot": {
					width: "1.5rem",
					height: "1.5rem",
                    boxShadow: "inset 0 0 0.5rem 0.25rem #0008",
                    "&.on": {
                        boxShadow: "inset 0 0 0.5rem 0.25rem #0004",
                    },
				},
			},
		},
	}),
);

interface Props {
	max: number;
	dots: number;
    size?: "sm" | "md" | "lg" | "xl";
    color?: string;
	className?: string;
	style?: any;
}

const Dots: FC<Props> = (props) => {
	const classes = useStyles();

	const dots: boolean[] = [];

	for (let i = 0; i < props.max; i++) {
		dots.push(i < props.dots);
	}

    const size = props.size || "md";
    
    const onColor = props.color || "#4C4";
    const offColor = "#888";

	return (
		<div className={`${classes.root} ${size} ${props.className}`} style={props.style || {}}>
			{dots.map((d: boolean, ind: number) => {
				return <div className={`dot ${d ? "on" : "off"}`} key={`dot-${ind}`} style={{backgroundColor: d ? onColor : offColor}}/>;
			})}
		</div>
	);
};

export default Dots;
