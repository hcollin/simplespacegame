import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { KonvaEventObject } from "konva/types/Node";
import React, { FC, useEffect, useRef, useState } from "react";
import { Circle, Group, Image, Layer, Line, Ring, Stage, Star, Text } from "react-konva";
import useSelectedSystem from "../../hooks/useSelectedSystem";
import useWindowSize from "../../hooks/useWIndowResize";
import { SystemModel, FactionModel, Coordinates, GameModel, Report, ReportType } from "../../models/Models";
import { getFactionFromArrayById } from "../../services/helpers/FactionHelpers";
import useImage from "use-image";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import useMyCommands from "../../hooks/useMyCommands";
import { unitIsInFleet } from "../../utils/commandUtils";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../../models/Commands";
import { inSameLocation } from "../../utils/locationUtils";
import useUnitSelection from "../../hooks/useUnitSelection";
import { useService } from "jokits-react";

import { ShipUnit } from "../../models/Units";

import starfieldJpeg from '../../images/starfield2.jpg';
import { getShipSpeed } from "../../utils/unitUtils";
import Konva from "konva";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
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
            }
        },
        map: {
            // backgroundColor: "#000",
        }
    }))

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

    const [spaceShip] = useImage("/spaceship.png");
    const [combatReportPng] = useImage("/combatReport.png");

    const faction = useCurrentFaction();
    const commands = useMyCommands();
    const [fleet, fleetActions] = useUnitSelection();
    const [zoomLevel, setZoomLevel] = useState<number>(ozoom);
    const [game] = useService<GameModel>("GameService");

    const [mapAdj, setMapAdj] = useState<[number, number]>([ox, oy])

    useEffect(() => {
        ox = mapAdj[0];
        oy = mapAdj[1];
    }, [mapAdj]);

    if (!game) return null;

    function select(star: SystemModel) {
        setSelectedSystem(star.id)
    }
    function deselect() {
        setSelectedSystem(null);
    }

    function calcNewZoom(curZoom: number, dir: number): number {
        if (curZoom <= 0.5 && dir > 0) return 0.5;
        if (curZoom >= 3 && dir < 0) return 3;
        const zoomSpeed = dir > 0 ? 100 : -100;
        return curZoom + ((zoomSpeed / 1000) * -1);
    }

    function wheelEvent(e: KonvaEventObject<WheelEvent>) {
        if (e.evt.deltaY === 0) return;
        const newZoom = calcNewZoom(zoomLevel, e.evt.deltaY);

        if (mapRef.current !== null) {
            const curX = mapRef.current.getAttr("x");
            const curY = mapRef.current.getAttr("y");
            const curWidth = mapRef.current.getAttr("width");
            const curHeight = mapRef.current.getAttr("height");
            const dif = Math.round((curHeight * newZoom) - (curHeight * zoomLevel));

            const mousePosX = e.evt.x / (curWidth);
            const mousePosY = e.evt.y / (curHeight);

            const mouseAdjX = (mousePosX * dif) - dif / 2;
            const mouseAdjY = (mousePosY * dif) - dif / 2;

            mapRef.current.setAttr("x", curX - dif / 2 - mouseAdjX);
            mapRef.current.setAttr("y", curY - dif / 2 - mouseAdjY);
            ozoom = newZoom;
        }

        setZoomLevel(newZoom)
    }

    function selectUnitGroup(ums: ShipUnit[]) {
        // if(fleet.length === 0) {
        fleetActions.set([...ums]);
        // console.log("Group selected", ums);
        // }

    }

    const w = windowSize.width;
    const h = windowSize.height;

    const showMoveLine = fleet.length > 0 && selectedSystem && !inSameLocation(selectedSystem.location, fleet[0].location);


    const unitGroupsMap: Map<string, ShipUnit[]> = new Map<string, ShipUnit[]>();
    props.units.forEach((um: ShipUnit) => {

        const cInd = `${um.location.x}-${um.location.y}`;
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

            setZoomLevel((prev) => prev === 1 ? 1.0001 : 1);

            mapRef.current.setAttr("x", 0);
            mapRef.current.setAttr("y", 0);


        }
    }

    const unitGroups = Array.from(unitGroupsMap.values());
    // console.log("Selected System", selectedSystem);

    const showReset = mapRef.current !== null && (Math.abs(mapAdj[0]) > mapRef.current.getAttr("width") * zoomLevel || Math.abs(mapAdj[1]) > mapRef.current.getAttr("height") * zoomLevel)

    return (<div className={classes.root}>
        {showReset && <Button variant="contained" onClick={reset} className="reset" color="secondary">RESET MAP</Button>}
        <div className={classes.map}>

            <Stage x={mapAdj[0]} y={mapAdj[1]} width={w} height={h} draggable={true} onWheel={wheelEvent} ref={mapRef} onDragEnd={(e: KonvaEventObject<DragEvent>) => setMapAdj([e.currentTarget.getAttr("x"), e.currentTarget.getAttr("y")])}>
                <Layer>
                    {unitGroups.map((umGroup: ShipUnit[]) => {
                        const um = umGroup[0];
                        const size = 25 * zoomLevel;
                        const isMyShip = faction && faction.id === um.factionId;
                        const inCommand = unitIsInFleet(commands, um);

                        const onSystem = inCommand ? game.turn === inCommand.turn : true;

                        const x = h * (um.location.x / 100) * zoomLevel - (onSystem ? (inCommand === null ? 0 : size) : size / 2);
                        const y = h * (um.location.y / 100) * zoomLevel - (onSystem ? (inCommand === null ? size : 0) : size / 2);

                        const speed = getShipSpeed(um, getFactionFromArrayById(game.factions, um.factionId));

                        return (
                            <Group key={um.id} onClick={() => selectUnitGroup(umGroup)}>
                                {inCommand !== null && isMyShip && <CoordinateLine from={um.location} to={inCommand.target} color={faction ? faction.color : "white"} zoom={zoomLevel} dash={[5, 5]} speed={speed} adjust={0} />}
                                <Image
                                    image={spaceShip}
                                    x={x}
                                    y={y}
                                    width={size}
                                    height={size}
                                />

                            </Group>
                        )
                    })}

                </Layer>


                {showMoveLine && selectedSystem && fleet[0].location && <Layer>
                    <CoordinateLine from={fleet[0].location} to={selectedSystem.location} color="#FFF" zoom={zoomLevel} dash={[5, 5]} showDist={true} />
                </Layer>}

                <Layer>
                    {props.systems.map((star: SystemModel) => {
                        const ownerFaction = getFactionFromArrayById(props.factions, star.ownerFactionId);
                        const color = ownerFaction ? ownerFaction.color : star.color;
                        const size = ownerFaction ? 8 * zoomLevel : 5 * zoomLevel;
                        const isSelected = selectedSystem && selectedSystem.id === star.id;
                        const x = h * (star.location.x / 100) * zoomLevel;
                        const y = h * (star.location.y / 100) * zoomLevel;

                        const hasReport = star.reports.filter((r: Report) => r.type === ReportType.COMBAT).length > 0;

                        const hasTargetedCommand = commands.find((cmd: Command) => {
                            switch (cmd.type) {
                                case CommandType.SystemBuild:
                                    const cb = cmd as BuildUnitCommand;
                                    return inSameLocation(cb.target, star.location);
                                case CommandType.FleetMove:
                                    return false;
                                default:
                                    const cs = cmd as SystemPlusCommand;
                                    return cs.targetSystem === star.id;
                            }
                        });

                        return (
                            <Group key={star.id} x={x} y={y} onClick={() => isSelected ? deselect() : select(star)}>
                                {hasReport && <Image
                                    image={combatReportPng}
                                    width={size * 5}
                                    height={size * 5}
                                    x={-size * 2.5}
                                    y={-size * 2.5}
                                    opacity={0.7}
                                />}
                                {isSelected && <Circle radius={size * 2} strokeWidth={2} stroke="#FFF" fill="#888" />}
                                {star.ringWorld && <Ring fill={color} innerRadius={size * 1.5} outerRadius={size * 1.75} />}
                                {ownerFaction && <Star 
                                    width={size} 
                                    height={size} 
                                    // fill={color} 
                                    fillRadialGradientStartPoint={{x: 0, y:0 }}
                                    fillRadialGradientStartRadius={0}
                                    fillRadialGradientEndPoint={ { x: 0, y: 0 }}
                                    fillRadialGradientEndRadius={size}
                                    fillRadialGradientColorStops={[0, 'white', 0.3, `${color}`, 0.9, `${color}`,1, '#000']}
                                    numPoints={6} 
                                    innerRadius={size / 1.5} 
                                    outerRadius={size * 1.25} 
                                />}
                                {!ownerFaction && <Circle
                                    radius={size}
                                    // fill={color}
                                    fillRadialGradientStartPoint={{x: 0, y:0 }}
                                    fillRadialGradientStartRadius={0}
                                    fillRadialGradientEndPoint={ { x: 0, y: 0 }}
                                    fillRadialGradientEndRadius={size}
                                    fillRadialGradientColorStops={[0, 'white', 0.8, `${color}`, 1, 'black']}
                                />}
                                {hasTargetedCommand && <Text text="!" fill="white" width={size} align="center" x={size * -0.5} y={-0.8 * size} fontSize={20 * zoomLevel} strokeWidth={1} stroke="black" />}
                                {zoomLevel > 1.3 && <Text text={star.name} fill="#FFF" align="center" opacity={0.8} x={-70} y={10 * zoomLevel} width={140} />}
                            </Group>
                        )
                    })}
                </Layer>


            </Stage>

        </div>



    </div>)
}

interface CoordinateLineProps {
    from: Coordinates;
    to: Coordinates;
    zoom: number;
    color: string;
    adjust?: number;
    dash?: number[];
    showDist?: boolean;
    speed?: number;

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

    const dist = Math.ceil(Math.sqrt((Math.pow(props.to.x - props.from.x, 2) + Math.pow(props.to.y - props.from.y, 2))))
    const turns = props.speed ? Math.ceil(dist / props.speed) : 0;
    const helpText = `${props.speed ? turns : `${dist} ly`}`;

    return (
        <>
            <Line points={[ax, ay, tx, ty]} dash={dash} stroke={props.color} strokeWidth={2 * props.zoom} />
            {(props.showDist || props.speed) && <Text text={helpText} fill={props.color} x={(tx + ax) / 2 - 11} y={(ty + ay) / 2 - 11} fontSize={22} stroke="black" fontFamily="Impact" strokeWidth={1.5} fontStyle="bold" />}
        </>
    )

}

export default LargeMap;