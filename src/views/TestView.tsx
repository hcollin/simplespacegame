import { env } from "process";
import React, { FC, useState } from "react";
import DataTable, { ColumnProps } from "../components/DataTable";
import { Planet, PlanetType, SystemModel } from "../models/StarSystem";
import { createRandomMap } from "../tools/mapgenerator/mapGenerator";
import { getSystemDefaultEconomy } from "../tools/mapgenerator/mapUtils";
import { randomNameGenerator } from "../utils/planetUtils";
import { SystemEconomy } from "../utils/systemUtils";

const TestView: FC = () => {
    const [starMap, setMap] = useState<SystemEconomy[]>(() => {
        return createRandomMap(1000, 99, undefined, 4).map((s: SystemModel) => {
            return getSystemDefaultEconomy(s);
        });
    });

    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    const columns: ColumnProps[] = [
        {
            key: "name",
            header: "Name",
            size: 100,
        },
        {
            key: "planetCount",
            header: "P Count",
            size: 30,
            fn: (s: SystemModel) => {
                if (!s.info) return 0;
                return s.info.planets.length;
            },
        },
        {
            key: "totalPop",
            header: "Population",
            size: 50,
            fn: (s: SystemModel) => {
                if(!s.info) return 0;
                return s.info.planets.reduce((pop: number, pl: Planet) => {
                    return pop + pl.maxPopulation;
                }, 0);
            }
        },
        {
            key: "totalFoorProd",
            header: "Food Prod",
            size: 50,
            fn: (s: SystemModel) => {
                if(!s.info) return 0;
                return s.info.planets.reduce((prod: number, pl: Planet) => {
                    return prod + pl.foodProduction;
                }, 0);
            }
        },
        {
            key: "infra",
            header: "Infra",
            size: 100,
            fn: (s: SystemEconomy) => {

                return <span>{s.industryMax} / {s.economyMax} / {s.defenseMax} / {s.welfareMax}</span>
            }
        },
        {
            key: "info",
            header: "Planets",
            size: 200,
            fn: (s: SystemModel) => {
                if (!s.info) return "-";

                return (
                    <div>
                        {s.info.planets.map((p: Planet) => {
                            return (
                                <div key={p.name}>
                                    {p.name}, {p.type}, {p.size}, {p.maxPopulation}, {p.keywords.join(", ")}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
    ];

    const randomNames: string[] = [];
    while(randomNames.length < 150) {
        randomNames.push(randomNameGenerator());
    }

    const stats: Map<PlanetType, number> = new Map<PlanetType, number>();

    const distance: PlanetType[][] = [];

    let totPlanets = 0;
    starMap.forEach((sm: SystemEconomy) => {
        sm.info.planets.forEach((p: Planet) => {
            const val = stats.get(p.type);
            if(!val) {
                stats.set(p.type, 1);
            } else {
                stats.set(p.type, val + 1);
            }
            if(distance[p.distanceFromStar] === undefined) {
                distance[p.distanceFromStar] = [];
            }
            distance[p.distanceFromStar].push(p.type);
            totPlanets++;
        })
    });

    const ptypes : PlanetType[] = [ PlanetType.Terrestrial, PlanetType.Gaia, PlanetType.Ocean, PlanetType.Desert, PlanetType.Lava, PlanetType.IcePlanet, PlanetType.Barren, PlanetType.GasGiant ];


    return (
        <div>
            <h3>Test Area</h3>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>{randomNames.sort().map((n: string, ind: number) => {
                return <div key={`n-${ind}`} style={{margin: "0.5rem 1rem"}}>{n}</div>
            })}</div>
{/* 
            <h4>Statistics for {totPlanets} planets</h4>
            {ptypes.map((pt: PlanetType) => {
                const val = stats.get(pt);
                if(!val) return <p key={pt}>{pt}: 0%</p>;

                const perc = Math.round((val / totPlanets)*1000)/10;
                return <div style={{width: "20rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}key={pt}> <div>{pt}</div> {val} <i>{perc}%</i></div>
            })}

            {distance.map((pls: PlanetType[], ind: number) => {

                return <div key={`dist-${ind}`}>
                    <b>Distance {ind} has {pls.length} planets</b>
                    {ptypes.map((pt: PlanetType) => {
                        const count = pls.filter((ptt: PlanetType) => ptt === pt).length;
                        if(count < 1) return null;
                        const perc = Math.round((count / pls.length)*1000)/10;
                        return (<div key={`${ind}-${pt}`}>{pt}: {count}, {perc}% </div>);
                    })}
                </div>

            })} */}


            <h4>Star Systems</h4>

            {/* <DataTable columns={columns} rows={starMap} /> */}
        </div>
    );
};

export default TestView;
