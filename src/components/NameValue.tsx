import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        nameValue: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            "& > span.value": {
                fontSize: "1.2rem",
                fontWeight: "bold",
            },
        },
        labelName: {
            fontSize: "0.7rem",
            textTransform: "uppercase",
            fontWeight: "bold",
            paddingRight: "0.5rem",
            marginRight: "0.5rem",
            textAlign: "right",
            width: "6rem",
            color: "#FFFD",
            borderRight: "solid 1px #CDFA",
        },
    })
);

const NameValue: FC<{ name: string; value: string | number; className?: string }> = (props) => {
    const classes = useStyles();
    return (
        <div className={`${classes.nameValue} ${props.className || ""}`}>
            <span className={classes.labelName}>{props.name}</span>
            <span className="value">{props.value}</span>
        </div>
    );
};

export default NameValue;
