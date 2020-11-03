import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC, useMemo } from "react";
import useCurrentFaction from "../services/hooks/useCurrentFaction";

interface PageContainerProps {
    color: string;
    image: string;
}

const PageContainer: FC<PageContainerProps> = (props) => {
    // const classes = useStyles("#B7D8");
    
    const styles = useMemo(() => {
        const classes = makeStyles((theme: Theme) => {
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
                            fontFamily: "Averia Serif Libre",
                            fontWeight: "normal",
                        },
                    },
                },
            });
        });
        return classes();
    }, [props]);

    return <div className={styles.page}>{props.children}</div>;
};

export default PageContainer;
