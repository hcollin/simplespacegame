import React, { FC } from "react";
import { makeStyles, Theme, createStyles, Container, Button } from "@material-ui/core";

import starfieldJpeg from "../images/starfield2.jpg";
import useCurrentUser from "../services/hooks/useCurrentUser";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "radial-gradient(#666F, #555E 15%, #444D 30%, #111D 80%, #000A)",
            color: "#FFFD",
            minHeight: "100vh",
            padding: "1rem",
            margin: 0,
            position: "relative",
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundImage: `url(${starfieldJpeg})`,
                backgroundSize: "cover",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: "-1",
            },

            "& > div": {
                background: "#0124",
                border: "groove 5px #68A8",
                padding: 0,
                boxShadow: "inset 0 0 5rem 2rem #0008",
                borderRadius: "2rem",
                [theme.breakpoints.down("md")]: {
                    border: "none",
                    borderBottom: "groove 5px #68A8",
                    borderRadius: 0,
                },

                "& > section": {
                    padding: "1rem",
                    "& > header": {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    },

                    "&.row": {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-around",

                        
                        [theme.breakpoints.down("md")]: {
                            flexWrap: "wrap",
                            "& > *":{
                                marginRight: 0,
                                marginBottom: "0.5rem",
                                "&:last-child": {
                                    marginBottom: "none",
                                }
                            },
                        },
                        [theme.breakpoints.up("lg")]: {
                            
                            "& > *":{
                                marginRight: "0.5rem",
                                marginBottom: "0.5rem",
                                "&:last-child": {
                                    marginRight: "none",
                                }
                            },
                        }
                    }
                },

                "& > footer": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: "1rem",
                },

                "& > .actions": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "1rem",
                    background: "linear-gradient(180deg, #4688 0, #0008 10%, #0008 80%, transparent)",
                    "& > button": {
                        marginLeft: "1rem",
                    },
                    "& > .divider": {
                        background: "#FFF8",
                        width: "2px",
                        height: "80%",
                        margin: "10% 1rem",
                    },
                    [theme.breakpoints.down("md")]: {
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        "& > button": {
                            flex: "0 0 auto",
                            width: "45%",
                            marginBottom: "0.5rem",
                        }

                        
                        
                    }

                },
            },
            [theme.breakpoints.down("md")]: {
                padding: 0,
            }
        },
        header: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#68A3",
            boxShadow: "inset 0 0 1rem 0.5rem #0004",
            padding: "1rem",
            border: "solid 5px transparent",
            borderBottom: "ridge 5px #68A",
            borderTopLeftRadius: "2rem",
            borderTopRightRadius: "2rem",
            "& > .backbutton": {
                flex: "0 0 auto",
                margin: "0 2rem 0 0",
            },
            "& h1": {
                flex: "1 1 auto",
                margin: 0,
            },
            "& > div.buttons": {
                flex: "0 0 auto",
                width: "20rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
            },
            "& > .userInfo": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                "& > button": {
                    marginLeft: "0.5rem",
                }
            }
        },

        part: {
            margin: "1rem 0",
            padding: "1rem",

            "& .row": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                "& > div": {
                    padding: "0.5rem",
                    flex: "1 1 auto",
                    "& > label": {
                        margin: "0.25rem 0",
                    },
                },
            },

            "& .field": {},
        },
        copy: {
            color: "#FFF8",
            fontSize: "0.8rem",
        }
    })
);

interface MenuPageContainerProps {
    title: string;
    backHandler?: () => void;
    className?: string;
    children?: any;
}

const MenuPageContainer: FC<MenuPageContainerProps> = (props: MenuPageContainerProps) => {
    const classes = useStyles();

    const [user, send] = useCurrentUser();

    function logout() {
        send("logout");
    }

    return (
        <div className={classes.root}>
            <Container className={props.className || ""}>
                <header className={classes.header}>
                    {props.backHandler && (
                        <Button variant="contained" color="default" onClick={props.backHandler} className="backbutton">
                            Back
                        </Button>
                    )}
                    <h1>{props.title}</h1>
                    {user && (
                        <div className="userInfo">
                            <p>Welcome, {user.name}!</p>
                            <Button variant="contained" color="secondary" onClick={logout}><ExitToAppIcon /></Button>
                        </div>
                    )}
                </header>
                {props.children}

                <p className={classes.copy}> &copy; Frost Troll Game Design Studio 2020, version 0.1.1.</p>
            </Container>

        </div>
    );
};

export default MenuPageContainer;
