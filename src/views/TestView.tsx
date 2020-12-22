import { env } from "process";
import React, { FC, useState } from "react";
import DataTable, { ColumnProps } from "../components/DataTable";
import { Planet, SystemModel } from "../models/StarSystem";
import { createRandomMap } from "../tools/mapgenerator/mapGenerator";
import { SystemEconomy } from "../utils/systemUtils";

const TestView: FC = () => {
    const [starMap, setMap] = useState<SystemModel[]>(() => {
        return createRandomMap(100, 100, undefined, 4);
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

    return (
        <div>
            <h3>Test Area</h3>

            <DataTable columns={columns} rows={starMap} />
        </div>
    );
};

export default TestView;
