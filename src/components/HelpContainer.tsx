import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "0.5rem 1rem",
            textAlign: "center",
            position: "relative",
            border: "ridge 3px #FFF4",
            borderRadius: "1rem",
            background: "#1384",
            boxShadow: "inset 0 0 2rem 1rem #FFF2",
            margin: "0.5rem",
            color: "#FFFE",
            fontWeight: "bold",
            fontSize: "1.1rem",

            "& > .helpIcon": {
                fontSize: "2rem",
                position: "absolute",
                top: "50%",
                marginTop: "-1rem",
                left: "1rem",
                zIndex: 10,
            },
            "&:after": {
                top: "0",
                left: "0",
                width: "4rem",
                bottom: "0",
                content: '""',
                zIndex: "5",
                position: "absolute",
                background: "#0008",
                borderRight: "solid 3px #FFF4",
                borderTopRightRadius: "1rem 50%",
                borderBottomRightRadius: "1rem 50%",
            },
        },
    })
);

interface Props {
    children: any;
}

const HelpContainer: FC<Props> = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <HelpOutlineIcon className="helpIcon" />
            {props.children}
        </div>
    );
};

export default HelpContainer;
