import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { Planet, SystemModel } from "../models/StarSystem";
import { planetStyle } from "../utils/planetUtils";

import crackedPng from "../images/texture/cracked.png";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        planet: {
            borderRadius: "50%",
            position: "relative",
            overflow: "hidden",
            "&.cracked:after": {
                content: '""',
                background: `url(${crackedPng})`,
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundSize: "contain",
                opacity: "0.6",
                filter: "blur(0.5px) sepia(7) hue-rotate(35deg)",
            },
        },
    })
);

interface PlanetProps {
    star: SystemModel;
    planet: Planet;
}

const PlanetDiv: FC<PlanetProps> = (props) => {
    const classes = useStyles();
    const p = props.planet;
    const [style, addClasses] = planetStyle(p);
    return <div className={`${classes.planet} ${addClasses}`} key={p.name} style={style} />;
};

export default PlanetDiv;
