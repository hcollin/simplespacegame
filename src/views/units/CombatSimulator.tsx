import { Button, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import CombatViewer from "../../components/CombatViewer";
import MiniUnitInfo from "../../components/MiniUnitInfo";
import useCurrentGame from "../../hooks/useCurrentGame";
import { FactionModel, SpaceCombat } from "../../models/Models";
import { CombatReport } from "../../models/Report";
import { SystemModel } from "../../models/StarSystem";
import { ShipDesign, ShipUnit } from "../../models/Units";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { resolveCombat, spaceCombatMain } from "../../tools/combat/combatResolver";
import { createShipFromDesign } from "../../utils/unitUtils";

const CombatSimulator: FC = () => {
    const [selectedDesign, setSelectedDesign] = useState<ShipDesign | null>(null);
    const [system, setSelectedSystem] = useState<SystemModel | null>(null);

    const [myUnits, setMyUnits] = useState<ShipUnit[]>([]);
    const [enemyUnits, setEnemyUnits] = useState<ShipUnit[]>([]);

    const [reports, setReports] = useState<CombatReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<CombatReport|null>(null);

    const faction = useCurrentFaction();
    const game = useCurrentGame();

    useEffect(() => {
        if (system === null && game) {
            setSelectedSystem(game.systems[0]);
        }
    }, [system, game]);

    if (!faction || !game) return null;

    const enemyFaction = game.factions.find((f: FactionModel) => f.id !== faction.id);

    function addToMyUnits() {
        if (faction && selectedDesign && system) {
            const unit = createShipFromDesign(selectedDesign, faction.id, system.location);
            console.log("unit", unit);
            setMyUnits((prev: ShipUnit[]) => [...prev, unit]);
        }
    }

    function addToEnemyUnits() {
        if (enemyFaction && selectedDesign && system) {
            const unit = createShipFromDesign(selectedDesign, enemyFaction.id, system.location);
            console.log("unit", unit);
            setEnemyUnits((prev: ShipUnit[]) => [...prev, unit]);
        }
    }

    function fight() {
        if (game && system) {
            const cmb: SpaceCombat = {
                units: [...myUnits, ...enemyUnits],
                origUnits: [...myUnits, ...enemyUnits],
                system: system,
                round: 0,
                done: false,
                roundLog: [],
                currentRoundLog: {
                    attacks: [],
                    messages: [],
                    round: 0,
                    status: [],
                },
            };
            const report = resolveCombat(game, cmb);
            // const combat = spaceCombatMain(game, [...myUnits, ...enemyUnits], system);
            setReports((prev: CombatReport[]) => [...prev, report]);
        }
    }


    return (
        <div>
            <h1>Combat simulator</h1>

            <Grid container>
                <Grid xs={12} md={12}>
                    <InputLabel>Select unit</InputLabel>
                    <Select
                        variant="outlined"
                        fullWidth
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            const unit = faction.shipDesigns.find((s: ShipDesign) => s.id === e.target.value);
                            if (unit) {
                                setSelectedDesign(unit);
                            }
                        }}
                        value={selectedDesign ? selectedDesign.id : ""}
                    >
                        {faction.shipDesigns.map((sd: ShipDesign) => {
                            return (
                                <MenuItem key={sd.id} value={sd.id}>
                                    {sd.typeClassName}
                                </MenuItem>
                            );
                        })}
                    </Select>

                    {selectedDesign && (
                        <div
                            style={{
                                margin: "1rem 0",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-around",
                            }}
                        >
                            <Button variant="contained" onClick={addToMyUnits}>
                                To My fleet
                            </Button>
                            {myUnits.length > 0 && enemyUnits.length > 0 && (
                                <Button variant="contained" color="primary" size="large" onClick={fight}>
                                    FIGHT!
                                </Button>
                            )}
                            <Button variant="contained" onClick={addToEnemyUnits}>
                                To Enemy Fleet
                            </Button>
                        </div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <h2>Reports <Button variant="contained" color="secondary" onClick={() => setReports([])}><Delete /></Button></h2>
                    {reports.map((report: CombatReport, i: number) => {
                        return <Button variant="contained" style={{margin: "0.5rem"}} onClick={() => setSelectedReport(report)}>Open Report {i}</Button>
                    })}
                </Grid>

                <Grid xs={12} md={6} style={{ padding: "0.5rem" }}>
                    <h2>My Units <Button variant="contained" color="secondary" onClick={() => setMyUnits([])}><Delete /></Button></h2>

                    {myUnits.map((ship: ShipUnit) => {
                        return <MiniUnitInfo key={ship.id} unit={ship} />;
                    })}
                </Grid>

                <Grid xs={12} md={6} style={{ padding: "0.5rem" }}>
                    <h2>Enemy Units <Button variant="contained" color="secondary" onClick={() => setEnemyUnits([])}><Delete /></Button></h2>

                    {enemyUnits.map((ship: ShipUnit) => {
                        return <MiniUnitInfo key={ship.id} unit={ship} />;
                    })}
                </Grid>

                {selectedReport && <CombatViewer combatReport={selectedReport} close={() => setSelectedReport(null)} />}
            </Grid>
        </div>
    );
};

export default CombatSimulator;
