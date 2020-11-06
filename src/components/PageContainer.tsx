import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";

interface PageContainerProps {
    color: string;
    image: string;
    font?: string;
}

const useStyles = (props: PageContainerProps) => {
    return makeStyles((theme: Theme) => {
        return createStyles({
        page: {
            position: "relative",
            zIndex: 10,
            marginTop: "4rem",
            padding: "1rem",
            background:
                "linear-gradient(180deg, #000 0, #555 1.5rem, #999 3rem, #555 4.5rem, #444 94%, #555 96%, #444 98%, #000 100%)",
            color: "#FFFE",
            borderRadius: "1rem",
            width: "calc(100% - 18rem)",
            marginBottom: "6rem",
            // border: "ridge 5px #DDD8",
            border: `ridge 5px ${props.color}`,
            "& > header": {
                position: "relative",
                height: "10rem",
                background: "#000",
                backgroundImage: `url(${props.image})`,
                width: "100%",
                backgroundPosition: "center",
                boxShadow: "inset 0 0 2em 1rem #000",
                border: `ridge 5px ${props.color}`,
                borderBottom: "none",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2rem 2rem 2rem",
                "&:after": {
                    content: '""',
                    background: "linear-gradient(to bottom, transparent 75%, #0008 80%, #777E 97%, #555 100%)",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "-5px",
                    right: "-5px",
                    zIndex: 0,
                    pointerEvents: "none",
                },
                "&>h1": {
                    padding: "2rem",
                    fontSize: "2.75rem",
                    color: "#FFFD",
                    letterSpacing: "0.25rem",
                    textShadow:
                        "0 0 1rem #BD7, 2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 4px #000,2px -2px 2px #000",
                    fontFamily: props.font || "Averia Serif Libre",
                    fontWeight: "normal",
                },
                "& > div.pointValue": {
                    border: `ridge 5px ${props.color}`,
                    display: "flex",
                    padding: "0.5rem 1rem",
                    boxShadow: "inset 0 0 2rem 0.15rem #000",
                    alignItems: "center",
                    borderRadius: "1rem",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    background: "#0005",

                    "& > h1": {
                        fontSize: "2rem",
                        padding: "0 1rem",
                        margin: 0,
                    },
                    "& > span": {
                        fontSize: "1rem",
                        fontWeight: "bold",
                        padding: "0",
                        color: "#FFFA",
                    },
                },
            },
        }
        })})();
}

const PageContainer: FC<PageContainerProps> = (props) => {
    const classes = useStyles(props);
    
    return <div className={classes.page}>{props.children}</div>;
};

export default PageContainer;
