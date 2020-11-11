import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC } from "react";
import { Circle, Layer, Stage } from "react-konva";
import { SystemModel } from "../models/Models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "400px",
        },
        map: {
            boxShadow: "0 0 1rem 0.5rem #FFF3",
        },
    })
);

interface Props {
    stars: SystemModel[];
    size: number;
    distances: number;
}

const MiniMap: FC<Props> = (props) => {
    const classes = useStyles();
    console.log("SIZE", props.size);
    
    // style={{ height: `${props.size * 1.1}px`, width: `${props.size * 1.1}px` }}
    return (
        <div className={classes.root}>
            <Stage width={props.size} height={props.size} draggable={false} className={classes.map}>
                <Layer>
                    {props.stars.map((star: SystemModel, index: number) => {
                        const x = props.size * (star.location.x / props.distances);
                        const y = props.size * (star.location.y / props.distances);
                        // console.log(index, ":", x, y, props.size, star.location);
                        return (
                            <Circle x={x} y={y} key={star.id} radius={3} strokeWidth={1} stroke="#0008" fill="#fff" />
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
};

export default MiniMap;
