import React, { FC, useEffect, useRef, useState } from "react";

import Konva from "konva";
import { Arc, Arrow, Circle, Group, Image, Layer, Line, Stage, Star, Text } from "react-konva";
import { KonvaEventObject } from "konva/types/Node";
import useImage from "use-image";

import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";

import useSelectedSystem from "../../hooks/useSelectedSystem";
import useWindowSize from "../../hooks/useWIndowResize";
import { FactionModel, Coordinates, GameModel, Report } from "../../models/Models";

import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import useMyCommands from "../../hooks/useMyCommands";
import { unitIsInFleet } from "../../utils/commandUtils";
import { BuildUnitCommand, Command, CommandType, FleetCommand, SystemPlusCommand } from "../../models/Commands";
import { inSameLocation, warpGateBetweenSystems } from "../../utils/locationUtils";
import useUnitSelection from "../../hooks/useUnitSelection";
import { useService } from "jokits-react";
import { ShipUnit } from "../../models/Units";
import { getShipSpeed } from "../../utils/unitUtils";
import { Building } from "../../models/Buildings";
import { DetailReportType } from "../../models/Report";

import starfieldJpeg from "../../images/starfield2.jpg";
import { getSystemByCoordinates } from "../../utils/systemUtils";
import { SERVICEID } from "../../services/services";
import { angleBetweenCoordinates, travelingBetweenCoordinates } from "../../utils/MathUtils";
import { convertHexRgbToComponents } from "../../utils/generalUtils";

import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import LayersIcon from "@material-ui/icons/Layers";
import SubMenuButton from "../../components/SubMenuButton";

import StarIcon from "@material-ui/icons/Star";
import { IconShipBlack } from "../../components/Icons";
import { SystemModel } from "../../models/StarSystem";
import { getFactionFromArrayById } from "../../utils/factionUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            backgroundImage: `url(${starfieldJpeg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            "& >button.reset": {
                position: "absolute",
                top: "1rem",
                right: "20rem",
                zIndex: 1000,
            },
            "&> .controls": {
                left: "0.5rem",

                position: "absolute",
                zIndex: "30",
                display: "flex",
                flexDirection: "column",
                height: "auto",
                alignItems: "center",
                justifyContent: "flex-end",
                "& > button": {
                    position: "relative",
                    marginTop: "0.5rem",
                },
                "& .submenu": {
                    "& button img": {
                        height: "24px",
                    },
                },
                [theme.breakpoints.down("md")]: {
                    bottom: "4rem",
                },
                [theme.breakpoints.up("lg")]: {
                    bottom: "6rem",
                },
            },
        },
        map: {
            // backgroundColor: "#000",
        },
    })
);

interface LargeMapProps {
    systems: SystemModel[];
    factions: FactionModel[];
    units: ShipUnit[];
}

let ozoom: number = 1;
let ox: number = 0;
let oy: number = 0;

const LargeMap: FC<LargeMapProps> = (props) => {
    const mapRef = useRef<Konva.Stage>(null);

    const classes = useStyles();
    const [selectedSystem, setSelectedSystem] = useSelectedSystem();
    const windowSize = useWindowSize();

    const [] = useImage("/spaceship.png");
    const [combatReportPng] = useImage("/combatReport.png");

    const faction = useCurrentFaction();
    const [commands] = useMyCommands<FleetCommand>(CommandType.FleetMove);
    const [fleet, fleetActions] = useUnitSelection();
    const [zoomLevel, setZoomLevel] = useState<number>(ozoom);
    const [game] = useService<GameModel>("GameService");

    const [options, setOptions] = useState<string[]>(["Systems", "Ships"]);

    const [mapAdj, setMapAdj] = useState<[number, number]>([ox, oy]);

    useEffect(() => {
        ox = mapAdj[0];
        oy = mapAdj[1];
    }, [mapAdj]);

    if (!game || !faction) return null;

    function select(star: SystemModel) {
        setSelectedSystem(star.id);
    }
    function deselect() {
        setSelectedSystem(null);
    }

    function calcNewZoom(curZoom: number, dir: number): number {
        if (curZoom <= 0.5 && dir > 0) return 0.5;
        if (curZoom >= 3 && dir < 0) return 3;
        const zoomSpeed = dir > 0 ? 100 : -100;
        return curZoom + (zoomSpeed / 1000) * -1;
    }

    function wheelEvent(e: KonvaEventObject<WheelEvent>) {
        if (e.evt.deltaY === 0) return;
        const newZoom = calcNewZoom(zoomLevel, e.evt.deltaY);

        if (mapRef.current !== null) {
            const curX = mapRef.current.getAttr("x");
            const curY = mapRef.current.getAttr("y");
            const curWidth = mapRef.current.getAttr("width");
            const curHeight = mapRef.current.getAttr("height");
            const dif = Math.round(curHeight * newZoom - curHeight * zoomLevel);

            const mousePosX = e.evt.x / curWidth;
            const mousePosY = e.evt.y / curHeight;

            const mouseAdjX = mousePosX * dif - dif / 2;
            const mouseAdjY = mousePosY * dif - dif / 2;

            mapRef.current.setAttr("x", curX - dif / 2 - mouseAdjX);
            mapRef.current.setAttr("y", curY - dif / 2 - mouseAdjY);
            ozoom = newZoom;
        }

        setZoomLevel(newZoom);
    }

    function zoomInButton() {
        setZoomLevel(calcNewZoom(zoomLevel, -1));
    }

    function zoomOutButton() {
        setZoomLevel(calcNewZoom(zoomLevel, 1));
    }

    const w = windowSize.width;
    const h = windowSize.height;

    const showMoveLine =
        fleet.length > 0 && selectedSystem && !inSameLocation(selectedSystem.location, fleet[0].location);

    const unitGroupsMap: Map<string, ShipUnit[]> = new Map<string, ShipUnit[]>();
    props.units.forEach((um: ShipUnit) => {
        const fltCmd = unitIsInFleet(commands, um);
        const flId = fltCmd ? fltCmd.id : "";
        const cInd = `${um.location.x}-${um.location.y}-${flId}`;

        if (!unitGroupsMap.has(cInd)) {
            unitGroupsMap.set(cInd, []);
        }
        const unitsInLoc = unitGroupsMap.get(cInd);
        if (unitsInLoc) {
            unitsInLoc.push(um);
            unitGroupsMap.set(cInd, unitsInLoc);
        }
    });

    function reset() {
        if (mapRef.current) {
            setMapAdj([0, 0]);

            setZoomLevel((prev) => (prev === 1 ? 1.0001 : 1));

            mapRef.current.setAttr("x", 0);
            mapRef.current.setAttr("y", 0);
        }
    }

    function setOption(opt: string) {
        setOptions((prev: string[]) => {
            if (prev.includes(opt)) {
                return prev.filter((s: string) => s !== opt);
            }
            return [...prev, opt];
        });
    }

    // console.log("Selected System", selectedSystem);

    const possibleOptions: [string, JSX.Element][] = [
        // ["InfluenceRings", <FiberManualRecord />],
        ["Systems", <StarIcon />],
        ["Ships", <IconShipBlack />],
    ];

    const showReset =
        mapRef.current !== null &&
        (Math.abs(mapAdj[0]) > mapRef.current.getAttr("width") * zoomLevel ||
            Math.abs(mapAdj[1]) > mapRef.current.getAttr("height") * zoomLevel);

    return (
        <div className={classes.root}>
            {showReset && (
                <Button variant="contained" onClick={reset} className="reset" color="secondary">
                    RESET MAP
                </Button>
            )}
            <div className="controls">
                <SubMenuButton icon={<LayersIcon />}>
                    {possibleOptions.map((opt: [string, JSX.Element]) => {
                        return (
                            <Button
                                variant="contained"
                                onClick={() => setOption(opt[0])}
                                color={options.includes(opt[0]) ? "primary" : "default"}
                                key={opt[0]}
                            >
                                {opt[1]}
                            </Button>
                        );
                    })}
                </SubMenuButton>

                <Button variant="contained" onClick={zoomInButton}>
                    <ZoomInIcon />
                </Button>
                <Button variant="contained" onClick={zoomOutButton}>
                    <ZoomOutIcon />
                </Button>
            </div>
            <div className={classes.map}>
                <Stage
                    x={mapAdj[0]}
                    y={mapAdj[1]}
                    width={w}
                    height={h}
                    draggable={true}
                    onWheel={wheelEvent}
                    ref={mapRef}
                    onDragEnd={(e: KonvaEventObject<DragEvent>) =>
                        setMapAdj([e.currentTarget.getAttr("x"), e.currentTarget.getAttr("y")])
                    }
                >
                    {options.includes("Ships") && <FleetLayer zoom={zoomLevel} />}

                    {showMoveLine && selectedSystem && fleet[0].location && (
                        <Layer>
                            <CoordinateLine
                                game={game}
                                from={fleet[0].location}
                                to={selectedSystem.location}
                                color="#FFF"
                                zoom={zoomLevel}
                                dash={[5, 5]}
                                showDist={true}
                                showArrow={true}
                            />
                        </Layer>
                    )}

                    {/* Influence Rings */}
                    {options.includes("InfluenceRings") && (
                        <Layer>
                            {props.systems.map((star: SystemModel) => {
                                const ownerFaction = getFactionFromArrayById(props.factions, star.ownerFactionId);
                                if (!ownerFaction) return null;

                                const x = h * (star.location.x / 100) * zoomLevel;
                                const y = h * (star.location.y / 100) * zoomLevel;

                                return (
                                    <Group key={star.id} x={x} y={y} opacity={0.2}>
                                        <Circle
                                            radius={(star.welfare + star.economy + star.industry) * 10 * zoomLevel}
                                            fill={ownerFaction.color}
                                            opacity={1}
                                        />
                                    </Group>
                                );
                            })}
                        </Layer>
                    )}

                    {/* Star Systems */}
                    {options.includes("Systems") && (
                        <Layer>
                            {props.systems.map((star: SystemModel) => {
                                const ownerFaction = getFactionFromArrayById(props.factions, star.ownerFactionId);
                                const color = ownerFaction ? ownerFaction.color : star.color;
                                const size = ownerFaction ? 8 * zoomLevel : 5 * zoomLevel;
                                const isSelected = selectedSystem && selectedSystem.id === star.id;
                                const x = h * (star.location.x / 100) * zoomLevel;
                                const y = h * (star.location.y / 100) * zoomLevel;

                                const hasReport =
                                    star.reports.filter((r: Report) => r.type === DetailReportType.Combat).length > 0;

                                const hasTargetedCommand = commands.find((cmd: Command) => {
                                    switch (cmd.type) {
                                        case CommandType.SystemBuildUnit:
                                            const cb = cmd as BuildUnitCommand;
                                            return cb.targetSystem === star.id;
                                        case CommandType.FleetMove:
                                            return false;
                                        default:
                                            const cs = cmd as SystemPlusCommand;
                                            return cs.targetSystem === star.id;
                                    }
                                });

                                return (
                                    <Group
                                        key={star.id}
                                        x={x}
                                        y={y}
                                        onClick={() => (isSelected ? deselect() : select(star))}
                                        onTap={() => (isSelected ? deselect() : select(star))}
                                    >
                                        {hasReport && (
                                            <Image
                                                image={combatReportPng}
                                                width={size * 5}
                                                height={size * 5}
                                                x={-size * 2.5}
                                                y={-size * 2.5}
                                                opacity={0.7}
                                            />
                                        )}
                                        {isSelected && (
                                            <Circle radius={size * 2} strokeWidth={2} stroke="#FFF" fill="#888" />
                                        )}
                                        {ownerFaction && (
                                            <Star
                                                width={size}
                                                height={size}
                                                // fill={color}
                                                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                                                fillRadialGradientStartRadius={0}
                                                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                                                fillRadialGradientEndRadius={size}
                                                fillRadialGradientColorStops={[
                                                    0,
                                                    "white",
                                                    0.3,
                                                    `${color}`,
                                                    0.9,
                                                    `${color}`,
                                                    1,
                                                    "#000",
                                                ]}
                                                numPoints={6}
                                                innerRadius={size / 1.5}
                                                outerRadius={size * 1.25}
                                            />
                                        )}
                                        {!ownerFaction && (
                                            <Circle
                                                radius={size}
                                                // fill={color}
                                                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                                                fillRadialGradientStartRadius={0}
                                                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                                                fillRadialGradientEndRadius={size}
                                                fillRadialGradientColorStops={[0, "white", 0.8, `${color}`, 1, "black"]}
                                            />
                                        )}

                                        {zoomLevel > 1.3 &&
                                            ownerFaction &&
                                            star.buildings.map((b: Building, ind: number) => {
                                                return (
                                                    <Arc
                                                        key={b.id}
                                                        fill="white"
                                                        innerRadius={size * 1.3}
                                                        outerRadius={size * 1.7}
                                                        strokeWidth={1}
                                                        stroke="#888"
                                                        angle={20}
                                                        rotationDeg={160 + ind * 25}
                                                    />
                                                );
                                            })}
                                        {hasTargetedCommand && (
                                            <Text
                                                text="!"
                                                fill="white"
                                                width={size}
                                                align="center"
                                                x={size * -0.5}
                                                y={-0.8 * size}
                                                fontSize={20 * zoomLevel}
                                                strokeWidth={1}
                                                stroke="black"
                                            />
                                        )}
                                        {zoomLevel > 1.3 && (
                                            <Text
                                                text={star.name}
                                                fill="#FFF"
                                                align="center"
                                                opacity={0.8}
                                                x={-70}
                                                y={10 * zoomLevel}
                                                width={140}
                                            />
                                        )}
                                    </Group>
                                );
                            })}
                        </Layer>
                    )}
                </Stage>
            </div>
        </div>
    );
};

interface CoordinateLineProps {
    from: Coordinates;
    to: Coordinates;
    zoom: number;
    color: string;
    adjust?: number;
    dash?: number[];
    showDist?: boolean;
    speed?: number;
    game: GameModel;
    showArrow?: boolean;
}

const CoordinateLine: FC<CoordinateLineProps> = (props) => {
    const windowSize = useWindowSize();

    // const w = windowSize.width;
    const h = windowSize.height;

    const x = h * (props.from.x / 100) * props.zoom;
    const y = h * (props.from.y / 100) * props.zoom;

    const ax = x + (props.adjust ? props.adjust / 2 : 0);
    const ay = y + (props.adjust ? props.adjust / 2 : 0);
    const tx = h * (props.to.x / 100) * props.zoom;
    const ty = h * (props.to.y / 100) * props.zoom;

    const dash = props.dash || [];

    const dist = Math.ceil(Math.sqrt(Math.pow(props.to.x - props.from.x, 2) + Math.pow(props.to.y - props.from.y, 2)));
    const turns = props.speed ? Math.ceil(dist / props.speed) : 0;
    let helpText = `${props.speed ? turns : `${dist} ly`}`;

    if (warpGateBetweenSystems(props.game, props.from, props.to)) {
        helpText = `Gateway (${dist}ly)`;
    }

    return (
        <>
            {props.showArrow === true && (
                <Arrow
                    points={[ax, ay, tx, ty]}
                    pointerLength={20 * props.zoom}
                    pointerWidth={20 * props.zoom}
                    stroke={props.color}
                    strokeWidth={2 * props.zoom}
                    fill={props.color}
                    opacity={0.75}
                    dash={dash}
                />
            )}
            {props.showArrow !== true && (
                <Line points={[ax, ay, tx, ty]} dash={dash} stroke={props.color} strokeWidth={2 * props.zoom} />
            )}
            {(props.showDist || props.speed) && (
                <Text
                    text={helpText}
                    fill={props.color}
                    x={(tx + ax) / 2 - 11}
                    y={(ty + ay) / 2 - 11}
                    fontSize={22}
                    stroke="black"
                    fontFamily="Impact"
                    strokeWidth={1.5}
                    fontStyle="bold"
                />
            )}
        </>
    );
};

interface MapFleet {
    units: ShipUnit[];
    factionId: string;
    fleetId: string;
    state: "INORBIT" | "MOVING" | "LOST";
    location: Coordinates;
    selected: boolean;
}

interface MapFleetOnOrbit extends MapFleet {
    systemId: string;
}

interface MapFleetMoving extends MapFleet {
    commandId: string;
    toCoord: Coordinates;
    speed: number;
    stillInOrbit: boolean;
    color: string;
}

interface FleetLayerProps {
    zoom: number;
}

const FleetLayer: FC<FleetLayerProps> = (props) => {
    const [fleets, setFleets] = useState<MapFleet[]>([]);

    const [game] = useService<GameModel>(SERVICEID.GameService);
    const [commands] = useMyCommands<FleetCommand>(CommandType.FleetMove);
    const faction = useCurrentFaction();
    // const [spaceShip] = useImage("/spaceship.png");
    const windowSize = useWindowSize();
    const [fleetUnits, fleetActions] = useUnitSelection();

    const [selFleet, setSelFleet] = useState<string>("");
    const [star] = useSelectedSystem();

    useEffect(() => {
        if (game && faction) {
            const newFleets = new Map<string, MapFleet>();
            let unitsInFleets: string[] = [];
            commands.forEach((cmd: FleetCommand) => {
                const cmdUnits = game.units.filter((s: ShipUnit) => cmd.unitIds.includes(s.id));

                if (cmdUnits.length > 0) {
                    const targetLoc = cmdUnits[0].location;
                    const commandFaction = getFactionFromArrayById(game.factions, cmd.factionId);
                    const mfm: MapFleetMoving = {
                        commandId: cmd.id,
                        factionId: cmd.factionId,
                        fleetId: cmd.id,
                        state: "MOVING",
                        units: cmdUnits,
                        location: targetLoc,
                        toCoord: cmd.target,
                        speed: cmdUnits.reduce((s: number, sh: ShipUnit) => {
                            const shipSpeed = getShipSpeed(sh, commandFaction);
                            return shipSpeed < s ? shipSpeed : s;
                        }, 99999),
                        selected: false,
                        stillInOrbit: cmd.turn === game.turn,
                        color: commandFaction ? commandFaction.color : "white",
                    };

                    unitsInFleets = [...unitsInFleets, ...cmd.unitIds];

                    newFleets.set(cmd.id, mfm);
                }
            });

            game.units.forEach((ship: ShipUnit) => {
                if (!unitsInFleets.includes(ship.id)) {
                    const star = getSystemByCoordinates(game, ship.location);
                    if (!star) {
                        const lostId = `LOSTFLEET-${ship.location.x}-${ship.location.y}-${ship.factionId}`;
                        const lostFleet = newFleets.get(lostId);
                        if (lostFleet) {
                            lostFleet.units.push(ship);
                        } else {
                            const mf: MapFleet = {
                                factionId: ship.factionId,
                                location: ship.location,
                                state: "LOST",
                                units: [ship],
                                fleetId: lostId,
                                selected: false,
                            };
                            newFleets.set(lostId, mf);
                        }
                    } else {
                        const orbitId = `ORBIT-${star.id}-${ship.factionId}`;
                        const orbitFleet = newFleets.get(orbitId);
                        if (orbitFleet) {
                            orbitFleet.units.push(ship);
                            newFleets.set(orbitId, orbitFleet);
                        } else {
                            const of: MapFleetOnOrbit = {
                                fleetId: orbitId,
                                factionId: ship.factionId,
                                location: star.location,
                                state: "INORBIT",
                                units: [ship],
                                systemId: star.id,
                                selected: false,
                            };
                            newFleets.set(orbitId, of);
                        }
                    }
                }
            });

            setFleets(Array.from(newFleets.values()));
        }
    }, [game, commands, faction]);

    useEffect(() => {
        if (fleetUnits && fleetUnits.length === 0) {
            setSelFleet("");
        }
    }, [fleetUnits]);

    if (!game || !faction) return null;

    const h = windowSize.height;

    function selectFleet(fleet: MapFleet) {
        if (selFleet === fleet.fleetId) {
            setSelFleet("");
            fleetActions.clr();
        } else {
            setSelFleet(fleet.fleetId);
            fleetActions.set([...fleet.units]);
        }
    }

    // console.log("FLEETS", fleets);

    // return null;

    return (
        <>
            <Layer>
                {fleets.map((fleet: MapFleet) => {
                    // const um = umGroup[0];
                    // const size = 20 * props.zoom;
                    // const inCommand = unitIsInFleet(commands, um);

                    // const onSystem = inCommand ? game.turn === inCommand.turn : true;

                    // const x = h * (um.location.x / 100) * zoomLevel - (onSystem ? (inCommand === null ? 0 : size) : size / 2);
                    // const y = h * (um.location.y / 100) * zoomLevel - (onSystem ? (inCommand === null ? size : 0) : size / 2);

                    // const speed = getShipSpeed(um, getFactionFromArrayById(game.factions, um.factionId));

                    const shipFaction = getFactionFromArrayById(game.factions, fleet.factionId);
                    const shipColor = shipFaction ? shipFaction.color : "#FFF";

                    const isSelected = selFleet === fleet.fleetId;

                    if (fleet.state === "INORBIT") {
                        const size = 25 * props.zoom;
                        const x = h * (fleet.location.x / 100) * props.zoom + (star && isSelected ? 0 : size / 2);
                        const y = h * (fleet.location.y / 100) * props.zoom - (star && isSelected ? 0 : size / 2);
                        const ang =
                            star && isSelected ? angleBetweenCoordinates(star.location, fleet.location, false) : 0;
                        return (
                            <Group
                                key={fleet.fleetId}
                                onClick={() => selectFleet(fleet)}
                                onTap={() => selectFleet(fleet)}
                            >
                                <ShipSprite
                                    x={x}
                                    y={y}
                                    size={size}
                                    angle={ang}
                                    selected={isSelected}
                                    color={shipColor}
                                />
                                {/* <Image image={spaceShip} x={x} y={y} width={size} height={size} fill="" {...selPorps}/> */}
                            </Group>
                        );
                    }

                    if (fleet.state === "MOVING") {
                        const size = 25 * props.zoom;
                        const moveFleet = fleet as MapFleetMoving;

                        let x = h * (fleet.location.x / 100) * props.zoom;
                        let y = h * (fleet.location.y / 100) * props.zoom;
                        if (moveFleet.stillInOrbit) {
                            const posCor: Coordinates = travelingBetweenCoordinates(
                                moveFleet.location,
                                moveFleet.toCoord,
                                2
                            );
                            x = h * (posCor.x / 100) * props.zoom;
                            y = h * (posCor.y / 100) * props.zoom;
                        }

                        const ang = angleBetweenCoordinates(moveFleet.toCoord, moveFleet.location, false);

                        return (
                            <Group
                                key={fleet.fleetId}
                                onClick={() => selectFleet(fleet)}
                                onTap={() => selectFleet(fleet)}
                            >
                                <CoordinateLine
                                    game={game}
                                    from={moveFleet.location}
                                    to={moveFleet.toCoord}
                                    color={moveFleet.color}
                                    zoom={props.zoom}
                                    dash={[5, 5]}
                                    speed={moveFleet.speed}
                                    adjust={0}
                                />
                                <ShipSprite
                                    x={x}
                                    y={y}
                                    size={size}
                                    angle={ang}
                                    selected={isSelected}
                                    color={shipColor}
                                />
                                {/* <Image image={spaceShip} x={x} y={y} width={size} height={size} rotation={ang} offsetX={size / 2} offsetY={size / 2}/> */}
                            </Group>
                        );
                    }

                    if (fleet.state === "LOST") {
                        const size = 20 * props.zoom;
                        const x = h * (fleet.location.x / 100) * props.zoom;
                        const y = h * (fleet.location.y / 100) * props.zoom - size;
                        return (
                            <Group
                                key={fleet.fleetId}
                                onClick={() => selectFleet(fleet)}
                                onTap={() => selectFleet(fleet)}
                            >
                                {/* <Image image={spaceShip} x={x} y={y} width={size} height={size} /> */}
                                <ShipSprite x={x} y={y} size={size} angle={0} selected={isSelected} color={shipColor} />
                            </Group>
                        );
                    }

                    return (
                        <></>
                        // <Group key={um.id} onClick={() => selectUnitGroup(umGroup)}>
                        // 	{inCommand !== null && isMyShip && (
                        // 		<CoordinateLine
                        // 			game={game}
                        // 			from={um.location}
                        // 			to={inCommand.target}
                        // 			color={faction ? faction.color : "white"}
                        // 			zoom={zoomLevel}
                        // 			dash={[5, 5]}
                        // 			speed={speed}
                        // 			adjust={0}
                        // 		/>
                        // 	)}
                        // 	<Image image={spaceShip} x={x} y={y} width={size} height={size} />
                        // </Group>
                    );
                })}
            </Layer>
        </>
    );
};

interface ShipSpriteProps {
    x: number;
    y: number;
    angle: number;
    size: number;
    selected?: boolean;
    color?: string;
}

const ShipSprite: FC<ShipSpriteProps> = (props) => {
    const [spaceShip] = useImage("/spaceship.png");

    const [hovering, setHovering] = useState<boolean>(false);

    const imageRef = useRef<any>();
    const imageRef2 = useRef<any>();

    const [ang, setAng] = useState<number>(0);

    useEffect(() => {
        if (spaceShip && imageRef && imageRef.current) {
            imageRef2.current.cache();
            imageRef2.current.getLayer().batchDraw();
        }
    }, [spaceShip, props]);

    useEffect(() => {
        if (spaceShip && imageRef && imageRef.current) {
            imageRef.current.cache();
            imageRef.current.getLayer().batchDraw();
        }
    }, [spaceShip, props]);

    useEffect(() => {
        if (props.selected) {
            const clear = setInterval(() => {
                setAng((prev: number) => prev + 1);
            }, 32);

            return () => {
                clearInterval(clear);
            };
        }
    }, [props.selected]);

    const col = props.color || "#FFFFFF";

    const colorParts = col.charAt(0) === "#" ? convertHexRgbToComponents(col) : [255, 255, 255];
    const shadowColor = 16; //getColorSum(col) >= 50 ? 16 : 128;

    return (
        <Group onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            {/* {props.selected === true && <Circle x={props.x} y={props.y} radius={props.size*0.75} fill={col} opacity={0.3} />} */}
            <Image
                ref={imageRef2}
                image={spaceShip}
                x={props.x}
                y={props.y}
                width={props.size}
                height={props.size}
                rotation={props.angle}
                offsetX={props.size / 2}
                offsetY={props.size / 2}
                opacity={0.8}
                scaleX={1.2}
                scaleY={1.2}
                filters={[Konva.Filters.RGB]}
                red={shadowColor}
                green={shadowColor}
                blue={shadowColor}
            />
            {props.selected === true && (
                <>
                    <Arc
                        x={props.x}
                        y={props.y}
                        innerRadius={props.size * 0.4}
                        outerRadius={props.size * 0.8}
                        fill={"#FFF"}
                        opacity={0.7}
                        angle={60}
                        rotation={ang}
                    />
                    <Arc
                        x={props.x}
                        y={props.y}
                        innerRadius={props.size * 0.4}
                        outerRadius={props.size * 0.8}
                        fill={"#FFF"}
                        opacity={0.7}
                        angle={60}
                        rotation={ang + 120}
                    />
                    <Arc
                        x={props.x}
                        y={props.y}
                        innerRadius={props.size * 0.4}
                        outerRadius={props.size * 0.8}
                        fill={"#FFF"}
                        opacity={0.7}
                        angle={60}
                        rotation={ang - 120}
                    />
                </>
            )}

            {hovering && (
                <Circle
                    x={props.x}
                    y={props.y}
                    radius={props.size / 1.8}
                    opacity={0.5}
                    stroke="white"
                    strokeWidth={0.1 * props.size}
                />
            )}
            <Image
                ref={imageRef}
                image={spaceShip}
                x={props.x}
                y={props.y}
                width={props.size}
                height={props.size}
                rotation={props.angle}
                offsetX={props.size / 2}
                offsetY={props.size / 2}
                filters={[Konva.Filters.RGB]}
                red={colorParts[0]}
                green={colorParts[1]}
                blue={colorParts[2]}
            />
        </Group>
    );
};

export default LargeMap;
