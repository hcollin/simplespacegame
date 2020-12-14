import {
    makeStyles,
    Theme,
    createStyles,
    Button,
    ButtonGroup,
    TextField,
    InputLabel,
    Grid,
    Select,
    MenuItem,
} from "@material-ui/core";
import { AddCircle, Delete } from "@material-ui/icons";
import { useAtom, useSetAtom } from "jokits-react";
import React, { FC, Reducer, useReducer, useState } from "react";
import { v4 } from "uuid";
import { IconAccuracy, IconCooldown, IconDamage } from "../../components/Icons";
import PageContainer from "../../components/PageContainer";
import RandomizeButton from "../../components/RandomizeButton";
import {
    DATASHIPENGINES,
    DATASHIPWEAPONS,
	getDesignSpecByShipClass,
    shipClassNameGenerator,
	ShipDesignSpecs,
    SHIPENGINEIDS,
    shipNameGenerator,
} from "../../data/dataShips";

import spaceStationJpg from "../../images/art/SpaceStation.jpg";
import { SHIPCLASS, ShipCustomDesign, ShipDesign, ShipEngine, ShipWeapon } from "../../models/Units";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import { convertShipDesignerSpecToShipDesign } from "../../utils/unitUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            // width: "100%",
            // height: "100vh",
            color: "#FFFD",
            background: "repeating-linear-gradient(0deg, #000 0, #024 4px, #012 16px)",
            padding: "2rem",
            overflowY: "auto",

            [theme.breakpoints.down("md")]: {
                padding: 0,
            },
        },
        nav: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderBottom: "ridge 3px #0008",
            margin: "1rem 0",
            padding: "0.5rem",
            "& > button": {
                marginRight: "1rem",
            },
        },

        designer: {
            "& div.plusminus": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-between",

                "& >label": {
                    flex: "1 1 auto",
                    minWidth: "6rem",
                    paddingRight: "0.5rem",
                    textAlign: "right",
                },

                "& > button": {
                    flex: "0 0 auto",
                    fontWeight: "bold",
                },

                "& > h3": {
                    padding: "0 1rem",
                    flex: "0 0 auto",
                    textAlign: "center",
                    width: "4rem",
                },
            },
            "& div.labelvalue": {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-between",

                "& >label": {
                    flex: "0 0 auto",
                    minWidth: "6rem",
                    paddingRight: "0.5rem",
                    textAlign: "right",
                },

                "& > div.value": {
                    flex: "2 2 auto",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    "& > *": {
                        marginRight: "0.5rem",
                    },
                },

                "& > div.extra": {
                    flex: "0 0 auto",
                    width: "5rem",
                },
            },
            "& > footer": {
                margin: "2rem 0",
                display: "flex",
                flexDirection: "row",
                aligItems: "center",
                justifyContent: "flex-end",
            },
        },
        labelName: {
            fontSize: "0.7rem",
            textTransform: "uppercase",
            fontWeight: "bold",
            paddingRight: "0.5rem",
            marginRight: "0.5rem",
            textAlign: "right",
            width: "6rem",
            color: "#FFFD",
            borderRight: "solid 1px #CDFA",
        },
        nameValue: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            "& > span.value": {
                fontSize: "1.2rem",
                fontWeight: "bold",
            },
        },
        row: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            height: "100%",
            [theme.breakpoints.down("sm")]: {
                flexWrap: "wrap",
            },
            [theme.breakpoints.up("md")]: {
                flexWrap: "nowrap",
            },
        },
    })
);

const UnitsView: FC = () => {
    const classes = useStyles();
    const faction = useCurrentFaction();

    const [unitView, setUnitview] = useAtom<string>("UnitViewDisplay", "ships");

    if (!faction) return null;

    return (
        <div className={classes.root}>
            <PageContainer color="#DD4" image={spaceStationJpg} font={faction.style.fontFamily}>
                <header>
                    <h1>Units</h1>

                    <div className="pointValue">Units</div>
                </header>

                <nav className={classes.nav}>
                    <Button
                        variant="contained"
                        color={unitView === "ships" ? "primary" : "default"}
                        onClick={() => setUnitview("ships")}
                    >
                        Ships
                    </Button>
                    <Button
                        variant="contained"
                        color={unitView === "designs" ? "primary" : "default"}
                        onClick={() => setUnitview("designs")}
                    >
                        Designs
                    </Button>
                    <Button
                        variant="contained"
                        color={unitView === "parts" ? "primary" : "default"}
                        onClick={() => setUnitview("parts")}
                    >
                        Parts
                    </Button>
                </nav>

                {unitView === "ships" && <ShipsView />}
                {unitView === "designs" && <DesignsView />}
                {unitView === "designer" && <ShipDesigner />}
                {unitView === "parts" && <PartsView />}
            </PageContainer>
        </div>
    );
};

const ShipsView: FC = () => {
    return (
        <div>
            <h2>Ships</h2>
        </div>
    );
};

const DesignsView: FC = () => {
    const [designs, setDesigns] = useState<ShipCustomDesign[]>([]);
    const setUnitview = useSetAtom<string>("UnitViewDisplay");

    return (
        <div>
            <h2>Designs</h2>

            <Button variant="contained" startIcon={<AddCircle />} onClick={() => setUnitview("designer")}>
                New Design
            </Button>
        </div>
    );
};

const PartsView: FC = () => {
    return (
        <div>
            <h2>Parts</h2>
        </div>
    );
};


type ShipDesignerReducerAction =
    | { type: "ChangeHull"; data: SHIPCLASS }
    | { type: "ChangeName"; data: string }
    | { type: "RandomName" }
    | { type: "HullPlus" }
    | { type: "HullMinus" }
    | { type: "ArmorPlus" }
    | { type: "ArmorMinus" }
    | { type: "ShieldsPlus" }
    | { type: "ShieldsMinus" }
    | { type: "ShieldsRegenPlus" }
    | { type: "ShieldsRegenMinus" }
    | { type: "TroopsPlus" }
    | { type: "TroopsMinus" }
    | { type: "FightersPlus" }
    | { type: "FightersMinus" }
    | { type: "AddWeapon"; data: ShipWeapon }
    | { type: "RemoveWeapon"; data: ShipWeapon }
    | { type: "ChangeEngine"; data: ShipEngine };

interface ShipDesignerState {
    ship: ShipCustomDesign;
    valid: boolean;
}

function validateDesign(design: ShipCustomDesign): boolean {
    if (design.pointsUsed > design.pointsMax) return false;
    if (design.shieldAdjustment < 0) return false;
	if (design.shieldAdjustment === 0 && design.shieldRegenAdjust > 0) return false;
	const nSpec = getDesignSpecByShipClass(design.hullType);
	if(nSpec.hull + design.hullAdjustment * 5 < 0) return false;
	

    return true;
}

function calculatePointsUsed(design: ShipCustomDesign): ShipCustomDesign {
    const ship = { ...design };
    const nSpec = getDesignSpecByShipClass(ship.hullType);

    ship.pointsMax = nSpec.points;
    ship.pointsUsed = ship.weapons.reduce((p: number, w: ShipWeapon) => {
        return p + w.part.points;
	}, 0);
	ship.pointsUsed += ship.hullAdjustment; 
	ship.pointsUsed += ship.shieldAdjustment * (Math.max(nSpec.sizeModifier/2, 1)); 
	ship.pointsUsed += (ship.shieldRegenAdjust*nSpec.sizeModifier);
	ship.pointsUsed += (ship.armor * nSpec.sizeModifier);
    ship.pointsUsed += ship.troops * 8;
    ship.pointsUsed += ship.fighters * 12;

    ship.pointsUsed += ship.engine.part.points * nSpec.sizeModifier;

    ship.cost = 3 * nSpec.sizeModifier + Math.round(ship.pointsUsed / 10);

    return ship;
}

const shipDesignerReducer: Reducer<ShipDesignerState, ShipDesignerReducerAction> = (
    state: ShipDesignerState,
    action: ShipDesignerReducerAction
): ShipDesignerState => {
    let draft: ShipCustomDesign = { ...state.ship };
    switch (action.type) {
        case "ChangeName":
            draft.name = action.data;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "RandomName":
            draft.name = shipClassNameGenerator();
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ChangeHull":
            draft.hullType = action.data;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "AddWeapon":
            draft.weapons.push({ ...action.data, id: v4() });
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "RemoveWeapon":
            draft.weapons = draft.weapons.filter((w: ShipWeapon) => w.id !== action.data.id);
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ChangeEngine":
            draft.engine = action.data;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "HullMinus":
            draft.hullAdjustment--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "HullPlus":
            draft.hullAdjustment++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ArmorMinus":
            draft.armor--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ArmorPlus":
            draft.armor++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ShieldsMinus":
            draft.shieldAdjustment--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ShieldsPlus":
            draft.shieldAdjustment++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ShieldsRegenMinus":
            draft.shieldRegenAdjust--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "ShieldsRegenPlus":
            draft.shieldRegenAdjust++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "TroopsMinus":
            draft.troops--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "TroopsPlus":
            draft.troops++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "FightersMinus":
            draft.fighters--;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        case "FightersPlus":
            draft.fighters++;
            draft = calculatePointsUsed(draft);
            return { ship: { ...draft }, valid: validateDesign(draft) };
        default:
            return state;
    }
};

const ShipDesigner: FC = () => {
    const classes = useStyles();
    const [selectedWeapon, setSelectedWeapon] = useState<ShipWeapon>(DATASHIPWEAPONS[0]);
    const [{ ship, valid }, dispatch] = useReducer<Reducer<ShipDesignerState, ShipDesignerReducerAction>>(
        shipDesignerReducer,
        {
            ship: {
                name: shipClassNameGenerator(),
                cost: 0,
                buildTime: 0,
                pointsMax: ShipDesignSpecs[0].points,
                pointsUsed: 0,
                weapons: [],
                hullType: ShipDesignSpecs[0].shipClass,
                hullAdjustment: 0,
                armor: 0,
                shieldAdjustment: 0,
                shieldRegenAdjust: 0,
                troops: 0,
                fighters: 0,
                engine: DATASHIPENGINES[0],
            },
            valid: false,
		}
	);


	function saveDesign() {
		const design = convertShipDesignerSpecToShipDesign(ship);
		console.log(design);
	}

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "ChangeName", data: event.target.value });
    };

    const availableTypes: SHIPCLASS[] = [
        SHIPCLASS.PATROL,
        SHIPCLASS.CORVETTE,
        SHIPCLASS.FRIGATE,
        SHIPCLASS.DESTROYER,
        SHIPCLASS.CRUISER,
        SHIPCLASS.CARRIER,
        SHIPCLASS.BATTLESHIP,
    ];

    const availableEngines = [...DATASHIPENGINES];
    const availableWeapons = DATASHIPWEAPONS.filter(
        (w: ShipWeapon) => !w.part.notAvailableInClasses.includes(ship.hullType)
    );

    const currentSpec = getDesignSpecByShipClass(ship.hullType);

    const currentHull = currentSpec.hull + ship.hullAdjustment * 5;
    const currentShield = ship.shieldAdjustment * 3;

    const currentAgility =
        currentSpec.baseAgility + ship.engine.agility < 0 ? 0 : currentSpec.baseAgility + ship.engine.agility;

    return (
        <div className={classes.designer}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <h2>
                        {ship.name} class {ship.hullType}
                    </h2>
                </Grid>
                <Grid item xs={12} md={3}>
                    <NameValue name="Points" value={`${ship.pointsMax - ship.pointsUsed} / ${ship.pointsMax}`} />
                    <NameValue name="Valid" value={valid ? "VALID" : "INVALID"} />
                </Grid>

                <Grid item xs={12} md={3}>
                    <NameValue name="Credit Cost" value={ship.cost} />
                    <NameValue name="Build Time" value={ship.buildTime} />
                </Grid>

                <Grid item xs={12} md={3}>
                    <NameValue name="Agility" value={currentAgility} />
                    <NameValue name="Speed" value={ship.engine.speed} />
                    <NameValue name="Range" value={ship.engine.range} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <NameValue name="Shields" value={currentShield} />
                    <NameValue name="Shield Regen" value={ship.shieldRegenAdjust} />
                    <NameValue name="Hull" value={currentHull} />
                    <NameValue name="Armor" value={ship.armor} />
                </Grid>

                <Grid item xs={12}>
                    <h3>Chassis and Engine</h3>
                </Grid>

                <Grid item xs={12} md={4}>
                    <div className="labelvalue">
                        <InputLabel className={classes.labelName}>Ship Class Name</InputLabel>
                        <div className="value">
                            <TextField value={ship.name} variant="outlined" onChange={handleNameChange} fullWidth />
                            <RandomizeButton
                                onClick={() => dispatch({ type: "RandomName" })}
                                variant="contained"
                                toolTip="Random name"
                            />
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <div className="labelvalue">
                        <InputLabel className={classes.labelName}>Hull Type</InputLabel>
                        <div className="value">
                            <Select
                                fullWidth
                                value={ship.hullType}
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    dispatch({ type: "ChangeHull", data: e.target.value as SHIPCLASS });
                                }}
                                variant="outlined"
                            >
                                {availableTypes.map((sc: SHIPCLASS) => {
                                    return (
                                        <MenuItem key={sc} value={sc}>
                                            {sc}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={4}>
                    <div className="labelvalue">
                        <InputLabel className={classes.labelName}>Engine</InputLabel>
                        <div className="value">
                            <Select
                                fullWidth
                                value={ship.engine.id}
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    const eng = DATASHIPENGINES.find(
                                        (eng: ShipEngine) => eng.id === (e.target.value as SHIPENGINEIDS)
                                    );
                                    if (eng) {
                                        dispatch({ type: "ChangeEngine", data: eng });
                                    }
                                }}
                                variant="outlined"
                            >
                                {availableEngines.map((engine: ShipEngine) => {
                                    return (
                                        <MenuItem key={engine.id} value={engine.id}>
                                            {engine.name} {engine.part.points * currentSpec.sizeModifier}p
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                </Grid>

				<Grid item xs={12}>
                    <h3>Hull and Shields</h3>
                </Grid>

                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Hull</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "HullMinus" })}
                            disabled={ship.hullAdjustment <= -10}
                        >
                            -
                        </Button>
                        <h3>{ship.hullAdjustment}</h3>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "HullPlus" })}
                            disabled={ship.hullAdjustment >= 10}
                        >
                            +
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Armor</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "ArmorMinus" })}
                            disabled={ship.armor <= 0}
                        >
                            -
                        </Button>
                        <h3>{ship.armor}</h3>
                        <Button variant="contained" onClick={() => dispatch({ type: "ArmorPlus" })}>
                            +
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Shields</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "ShieldsMinus" })}
                            disabled={ship.shieldAdjustment <= 0}
                        >
                            -
                        </Button>
                        <h3>{ship.shieldAdjustment}</h3>
                        <Button variant="contained" onClick={() => dispatch({ type: "ShieldsPlus" })}>
                            +
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Shield Regen</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "ShieldsRegenMinus" })}
                            disabled={ship.shieldRegenAdjust <= 0}
                        >
                            -
                        </Button>
                        <h3>{ship.shieldRegenAdjust}</h3>
                        <Button variant="contained" onClick={() => dispatch({ type: "ShieldsRegenPlus" })}>
                            +
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <h3>Troops and Fighters</h3>
                </Grid>

                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Fighters 15p</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "FightersMinus" })}
                            disabled={ship.fighters <= 0}
                        >
                            -
                        </Button>
                        <h3>{ship.fighters}</h3>
                        <Button variant="contained" onClick={() => dispatch({ type: "FightersPlus" })}>
                            +
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={12} md={3}>
                    <div className="plusminus">
                        <InputLabel className={classes.labelName}>Troops 8p</InputLabel>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: "TroopsMinus" })}
                            disabled={ship.troops <= 0}
                        >
                            -
                        </Button>
                        <h3>{ship.troops}</h3>
                        <Button variant="contained" onClick={() => dispatch({ type: "TroopsPlus" })}>
                            +
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <h3>Weapons</h3>

                    {ship.weapons.length === 0 && <p>No weapons installed yet</p>}
                </Grid>
                {ship.weapons.map((w: ShipWeapon) => {
                    return (
                        <Grid item xs={12} key={w.id}>
                            <div className={classes.row}>
                                <div>{w.name}</div>
                                <div>
                                    <IconAccuracy /> {selectedWeapon.accuracy}
                                </div>
                                <div>
                                    <IconDamage />{" "}
                                    {Array.isArray(selectedWeapon.damage)
                                        ? `${selectedWeapon.damage[0]} - ${selectedWeapon.damage[1]}`
                                        : selectedWeapon.damage}
                                </div>
                                <div>
                                    <IconCooldown /> {selectedWeapon.cooldown} {selectedWeapon.cooldownTime}
                                </div>
                                <div>{selectedWeapon.part.points}p</div>
                                <div>{selectedWeapon.type}</div>
                                <div>{selectedWeapon.special}</div>
								<div><Button variant="contained" color="secondary" onClick={() => dispatch({type: "RemoveWeapon", data: w})}><Delete /></Button></div>
                            </div>
                        </Grid>
                    );
                })}

                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                            <Select
                                variant="outlined"
                                fullWidth
                                value={selectedWeapon.name}
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    const weapon = availableWeapons.find(
                                        (aw: ShipWeapon) => aw.name === e.target.value
                                    );
                                    if (weapon) {
                                        setSelectedWeapon(weapon);
                                    }
                                }}
                            >
                                {availableWeapons.map((w: ShipWeapon) => {
                                    return (
                                        <MenuItem key={w.name} value={w.name}>
                                            {w.name} ({w.part.points}p)
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className={classes.row}>
                                <div>
                                    <IconAccuracy /> {selectedWeapon.accuracy}
                                </div>
                                <div>
                                    <IconDamage />{" "}
                                    {Array.isArray(selectedWeapon.damage)
                                        ? `${selectedWeapon.damage[0]} - ${selectedWeapon.damage[1]}`
                                        : selectedWeapon.damage}
                                </div>
                                <div>
                                    <IconCooldown /> {selectedWeapon.cooldown} {selectedWeapon.cooldownTime}
                                </div>
                                <div>{selectedWeapon.part.points}p</div>
                                <div>{selectedWeapon.type}</div>
                                <div>{selectedWeapon.special}</div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                color="default"
                                onClick={() => dispatch({ type: "AddWeapon", data: selectedWeapon })}
                            >
                                Add Weapon
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <footer>
                <Button disabled={!valid} variant="contained" color="primary" onClick={saveDesign}>
                    Create Design!
                </Button>
            </footer>
        </div>
    );
};

const NameValue: FC<{ name: string; value: string | number; className?: string }> = (props) => {
    const classes = useStyles();
    return (
        <div className={`${classes.nameValue} ${props.className || ""}`}>
            <span className={classes.labelName}>{props.name}</span>
            <span className="value">{props.value}</span>
        </div>
    );
};

export default UnitsView;
