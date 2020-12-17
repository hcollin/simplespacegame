import { Button, ButtonGroup, MenuItem, Select } from "@material-ui/core";
import { joki, useService } from "jokits-react";
import React, { FC, useState } from "react";
import DATASHIPS from "../data/dataShips";
import { DATATECHNOLOGY } from "../data/dataTechnology";
import useSelectedSystem from "../hooks/useSelectedSystem";
import { FactionModel, FactionTechSetting, GameModel, Technology, TechnologyField } from "../models/Models";
import { ShipDesign } from "../models/Units";

import useCurrentFaction from "../services/hooks/useCurrentFaction";
import { SERVICEID } from "../services/services";
import { getTechById } from "../utils/techUtils";
import { createShipFromDesign } from "../utils/unitUtils";
// import useCurrentFaction from "../services/hooks/useCurrentFaction";
// import FactionInfo from "./FactionInfo";

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         cheats: {
//             position: "fixed",
//             top: 0,
//             right: 0,
//             bottom: 0,
//             width: "14rem",
//             backgroundColor: "#333",
//             padding: "0.5rem",
//             zIndex: 20,
//             "& > h1": {
//                 color: "#FFFD",
//                 fontSize: "0.8rem",
//                 textTransform: "uppercase",
//                 margin: "1rem 0 0.25rem 0",
//                 width: "100%",
//                 borderTop: "solid 1px #FFF8",
//             }
//         },
//         rows: {
//             marginTop: "5rem",
//             display: "flex",
//             flexDirection: "row",
//         },
//         nextTurn: {
//             position: "absolute",
//             bottom: "1rem",
//             right: "1rem",
//             zIndex: 100,
//         },
//     })
// );

const CheatView: FC = () => {
    // const classes = useStyles();
    const [game] = useService<GameModel>("GameService");
    const faction = useCurrentFaction();

    const [star] = useSelectedSystem();

    if (!game || !faction) return null;

    function researchTech(techId: string) {
        const tech = getTechById(techId);

        if (faction && tech) {
            console.log("RESEARCH!", tech);
            if (!faction.technology.includes(tech.id)) {
                faction.technology.push(tech.id);
                updateFaction(faction);
            }
        }
    }

    function moreMoney() {
        if (faction) {
            faction.money += 10;
            updateFaction(faction);
        }
    }

    function moreTech(f: TechnologyField) {
        if (faction) {
            faction.technologyFields = faction.technologyFields.map((fts: FactionTechSetting) => {
                if (fts.field === f) {
                    fts.points += 10;
                    return { ...fts };
                }
                return fts;
            });
            updateFaction(faction);
        }
    }

    function updateFaction(f: FactionModel) {
        joki.trigger({
            to: "GameService",
            action: "updateFaction",
            data: { ...f },
        });
    }

    function autoBuildShip(sn: string) {
        console.log("Build ship", sn);
        const sd = DATASHIPS.find((d: ShipDesign) => d.name === sn);
        if (star && sd && faction && game) {
            const ship = createShipFromDesign(sd, faction.id, star.location);
            game.units.push(ship);
            joki.trigger({
                to: SERVICEID.GameService,
                action: "devUpdateGame",
                data: { ...game },
            });
        }
    }

    function moreActionPoints() {
        if(faction && game) {
            const ng = {...game};
            ng.factions = ng.factions.map((f: FactionModel) => {
                if(f.id === faction.id) {
                    f.aps++;
                }
                return f;
            });
            joki.trigger({
                to: SERVICEID.GameService,
                action: "devUpdateGame",
                data: { ...game },
            });
        }
    }
    // function readyAllFactions() {
    //     console.log("Ready all factions");
    //     if(game) {
    //         game.factions.forEach((fm: FactionModel) => {
    //             if(!game.factionsReady.includes(fm.id)) {

    //                 joki.trigger({
    //                     to: "GameService",
    //                     action: "ready",
    //                     data: fm.id
    //                 });
    //             }
    //         });
    //     }
    // }

    // function loginFaction(fm: FactionModel) {
    //     joki.trigger({
    //         to: "UserService",
    //         action: "switch",
    //         data: fm.playerId,
    //     });
    // }

    return (
        <>
            <h1>Dev Commands</h1>
            {/* <Button variant="contained" onClick={readyAllFactions}>Ready all factions</Button> */}
            <div style={{ padding: "1rem" }}>
                <h4>Auto Research</h4>
                <Picker<Technology>
                    list={DATATECHNOLOGY}
                    valKey="id"
                    textKey="name"
                    onConfirm={researchTech}
                    buttonText="research"
                />

                <h4>Auto build</h4>
                {star && (
                    <Picker<ShipDesign>
                        list={DATASHIPS}
                        valKey="name"
                        textKey="name"
                        onConfirm={autoBuildShip}
                        buttonText="build"
                    />
                )}

                <h4>Money</h4>
                <Button onClick={moreMoney} variant="contained">
                    +10 Money
                </Button>

                <h3>Actions</h3>
                <Button onClick={moreActionPoints} variant="contained">
                    +1 Action Point
                </Button>

                <br />

                <h4>Tech points (+10)</h4>
                <Button onClick={() => moreTech(TechnologyField.BIOLOGY)} variant="contained">
                    {TechnologyField.BIOLOGY.slice(0, 3)}
                </Button>
                <Button onClick={() => moreTech(TechnologyField.MATERIAL)} variant="contained">
                    {TechnologyField.MATERIAL.slice(0, 3)}
                </Button>
                <Button onClick={() => moreTech(TechnologyField.BUSINESS)} variant="contained">
                    {TechnologyField.BUSINESS.slice(0, 3)}
                </Button>
                <Button onClick={() => moreTech(TechnologyField.INFORMATION)} variant="contained">
                    {TechnologyField.INFORMATION.slice(0, 3)}
                </Button>
                <Button onClick={() => moreTech(TechnologyField.CHEMISTRY)} variant="contained">
                    {TechnologyField.CHEMISTRY.slice(0, 3)}
                </Button>
                <Button onClick={() => moreTech(TechnologyField.PHYSICS)} variant="contained">
                    {TechnologyField.PHYSICS.slice(0, 3)}
                </Button>
            </div>
        </>
    );
};

interface PickerProps<T> {
    list: T[];
    valKey: keyof T;
    textKey: keyof T;
    onConfirm: (val: string) => void;
    buttonText?: string;
}

function Picker<T extends object>(props: PickerProps<T>) {
    const [val, setVal] = useState<string>("");

    return (
        <div >
            <Select
                value={val}
                onChange={(e: any) => {
                    console.log(e.target.value);
                    setVal(e.target.value);
                }}
            >
                {props.list.map((item: T, ind: number) => {
                    const val = item[props.valKey];
                    const valStr = (val as unknown) as string;
                    return (
                        <MenuItem key={`item-${ind}`} value={valStr}>
                            {item[props.textKey]}
                        </MenuItem>
                    );
                })}
            </Select>

            <Button variant="contained" onClick={() => props.onConfirm(val)} style={{marginLeft: "1rem"}}>
                {props.buttonText || "Confirm"}
            </Button>
        </div>
    );
}

export default CheatView;
