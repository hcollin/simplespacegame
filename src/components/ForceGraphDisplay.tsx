import { makeStyles, Theme, createStyles } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { threadId } from "worker_threads";
import { DATATECHNOLOGY, TECHIDS } from "../data/dataTechnology";
import { Technology } from "../models/Models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            width: "1000px",
            height: "1000px",
        },
        item: {
            position: "absolute",
            background: "#000",
            width: "70px",
            height: "70px",
            fontSize: "0.6rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            margin: "-35px",
        },
    })
);

interface LinkObject {
    source: string;
    target: string;
}

const ForceGraphDisplay: FC = () => {
    const classes = useStyles();

    // const [layout, setLayout] = useState<Vector2D[]>(() => {
    // const techGraph: AdjacencyMatrix = DATATECHNOLOGY.reduce((graph: AdjacencyMatrix, tech: Technology) => {
    //     const edges = DATATECHNOLOGY.reduce((edg: (-1 | 0 | 1)[], t: Technology) => {
    //         if (tech.techprereq.includes(t.id)) {
    //             edg.push(1);
    //         } else {
    //             if (t.level === tech.level) {
    //                 edg.push(-1);
    //             } else {
    //                 edg.push(0);
    //             }
    //         }

    //         return edg;
    //     }, []);
    //     graph.push(edges);
    //     return graph;
    // }, []);
    // // return forceDirectedGraph(techGraph, 1000, 1000, 4, 50);
    // return forceDirectedGraph([
    //     [0, 1, 1, 1, 1],
    //     [1, 0, 0, 0, 0],
    //     [1, 0, 0, 0, 0],
    //     [1, 0, 0, 0, 0],
    //     [1, 0, 0, 0, 0],
    // ], 1000, 1000);
    // });

    // console.table(techGraph);
    // const graph: AdjacencyMatrix = [
    //     [1, 1, 0],
    //     [1, 1, 1],
    //     [1, 1, 1],
    // ];

    // console.log(layout);

    const nodes = [...DATATECHNOLOGY];

    const edges = DATATECHNOLOGY.reduce((links: LinkObject[], t: Technology) => {
        t.techprereq.forEach((tid: TECHIDS) => {
            links.push({
                source: tid,
                target: t.id,
            });
        });

        return links;
    }, []);

    return (
        <div className={classes.root}>
            <ForceGraph2D
                graphData={{
                    nodes: nodes,
                    links: edges,
                }}
                width={1000}
                height={1000}
                // nodeRelSize={10}
                nodeLabel="name"
                nodeCanvasObject={({ id, x, y, ...tech }, ctx: CanvasRenderingContext2D) => {
                    if (x && y && id && tech) {
                        const t = tech as Technology;
                        ctx.fillStyle = "#222222";
                        ctx.beginPath();
                        ctx.arc(x, y, 12, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.font = "3px Sans-Serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        const lines = getLines(ctx, t.name, 20);
                        // console.log(lines);

                        ctx.fillStyle = "#FFFFFF";
                        const startY = -2.5 * (lines.length - 1);
                        lines.forEach((t: string, i: number) => {
                            ctx.fillText(t, x, y + startY + 5 * i);
                        });
                    }
                }}
                nodeVisibility={(node: any) => {
                    const t = node as Technology;
                    if (t.techprereq.length === 0) {
                        return false;
                    }

                    return true;
                }}
                linkWidth={5}
                linkColor="#FFFFFF"
                warmupTicks={100}
                enableNodeDrag={false}
                onNodeClick={(a: any) => {
                    console.log("CLICK!", a);
                }}
            />
            {/* {layout.map((item: Vector2D, i: number) => {
                const css: React.CSSProperties = {
                    left: `${item.x + 500}px`,
                    top: `${item.y + 500}px`,
                };
                return (
                    <div className={classes.item} style={css}>
                        {DATATECHNOLOGY[i].name}
                    </div>
                );
            })} */}
        </div>
    );
};

function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

export default ForceGraphDisplay;
