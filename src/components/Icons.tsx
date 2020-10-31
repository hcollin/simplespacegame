import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

import iconCreditSvg from '../images/iconCredit.svg';
import IconResearchPointSvg from '../images/iconResearchPoint.svg';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {


            height: "1rem",
            width: "1rem",
            "&.lg": {
                height: "2rem",
                width: "2rem",
            },
            "&.sm": {
                height: "0.7rem",
                width: "0.7rem",
            },
            "&.xl": {
                height: "3rem",
                width: "3rem",
            },
            "&.xxl": {
                height: "5rem",
                width: "5rem",
            },
            "&.wrapper": {

                borderRadius: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: "solid 1px #0004",
                background: "#FFF4",
                boxShadow: "inset 0 0 0.5rem 3px #0004",
                "&.dark": {
                    border: "solid 1px #0004",
                    background: "#0004",
                    boxShadow: "inset 0 0 0.5rem 3px #0004",
                },
                "& > img.image": {
                    height: "80%",
                }
            },


        },


    }));


interface IconProps {
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    className?: string;
    wrapper?: "light" | "dark";
}

const IconCredit: FC<IconProps> = (props) => {
    const classes = useStyles();
    const size = props.size || "md";

    return (<IconWrapper {...props}>
        <img src={iconCreditSvg} alt="Credit" className={`${classes.root} image ${size} ${props.className || ""}`} />
    </IconWrapper>);
    // }
    // return <img src={iconCreditSvg} alt="Credit" className={`${classes.root} ${size} ${props.className || ""}`} />
}

const IconResearchPoint: FC<IconProps> = (props) => {
    const classes = useStyles();
    const size = props.size || "md";

    return (<IconWrapper {...props}>
        <img src={IconResearchPointSvg} alt="Research Point" className={`${classes.root} image ${size} ${props.className || ""}`} />
    </IconWrapper>);

    // return <img src={IconResearchPointSvg} alt="Research Point" className={`${classes.root} ${size} ${props.className || ""}`} />
}

const IconWrapper: FC<IconProps> = (props) => {
    const classes = useStyles();
    if (!props.wrapper) return <>{props.children}</>;

    return <div className={`${classes.root} wrapper ${props.wrapper || "light"} ${props.size || "md"}`}>
        {props.children}
    </div>
}

export { IconCredit, IconResearchPoint };