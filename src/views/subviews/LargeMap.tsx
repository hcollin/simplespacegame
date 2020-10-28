import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { KonvaEventObject } from "konva/types/Node";
import React, { FC, useState } from "react";
import { Circle, Group, Image, Layer, Line, Ring, Stage, Star, Text } from "react-konva";
import useSelectedSystem from "../../hooks/useSelectedSystem";
import useWindowSize from "../../hooks/useWIndowResize";
import { SystemModel, FactionModel, UnitModel, Coordinates, GameModel, Report, ReportType } from "../../models/Models";
import { getFactionById } from "../../services/helpers/FactionHelpers";
import useImage from "use-image";
import useCurrentFaction from "../../services/hooks/useCurrentFaction";
import useMyCommands from "../../hooks/useMyCommands";
import { unitIsInFleet } from "../../utils/commandUtils";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../../models/Commands";
import { inSameLocation } from "../../utils/locationUtils";
import useUnitSelection from "../../hooks/useUnitSelection";
import { useService } from "jokits-react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "fixed",
            top: "80px",
            zIndex: 0,
        },
        map: {
            backgroundColor: "#000",
        }
    }))

interface LargeMapProps {
    systems: SystemModel[];
    factions: FactionModel[];
    units: UnitModel[];
}

const LargeMap: FC<LargeMapProps> = (props) => {

    const classes = useStyles();
    const [selectedSystem, setSelectedSystem] = useSelectedSystem();
    const windowSize = useWindowSize();

    const [spaceShip] = useImage("/spaceship.png");
    const [combatReportPng] = useImage("/combatReport.png");

    const faction = useCurrentFaction();
    const commands = useMyCommands();
    const [fleet, fleetActions] = useUnitSelection();
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [game] = useService<GameModel>("GameService");

    if(!game) return null;

    function select(star: SystemModel) {
        setSelectedSystem(star.id)
    }
    function deselect() {
        setSelectedSystem(null);
    }

    function wheelEvent(e: KonvaEventObject<WheelEvent>) {
        setZoomLevel((prev: number) => {
            if (prev <= 0.5 && e.evt.deltaY > 0) return prev;
            if (prev > 3 && e.evt.deltaY < 0) return prev;
            return prev + ((e.evt.deltaY / 1000) * -1);
        })
    }

    const w = windowSize.width;
    const h = windowSize.height - 80;

    const showMoveLine = fleet.length > 0 && selectedSystem && !inSameLocation(selectedSystem.location, fleet[0].location);

    function getLinePoints(fromLoc: Coordinates, toLoc: Coordinates, sizeMod: number, zoom: number): [number, number, number, number] {

        const x = h * (fromLoc.x / 100) * zoom;
        const y = h * (fromLoc.y / 100) * zoom;


        const ax = x + (sizeMod / 2);
        const ay = y + (sizeMod / 2);
        const tx = h * (toLoc.x / 100) * zoom;
        const ty = h * (toLoc.y / 100) * zoom;
        return [ax, ay, tx, ty];
    }

    function getMidPoint(fromLoc: Coordinates, toLoc: Coordinates, sizeMod: number, zoom: number): Coordinates {
        const x = h * (fromLoc.x / 100) * zoom;
        const y = h * (fromLoc.y / 100) * zoom;


        const ax = x + (sizeMod / 2);
        const ay = y + (sizeMod / 2);
        const tx = h * (toLoc.x / 100) * zoom;
        const ty = h * (toLoc.y / 100) * zoom;

        return {
            x: tx - ax / 2,
            y: ty - ay / 2,
        }
    }



    return (<div className={classes.root}>

        <div className={classes.map}>

            <Stage width={w} height={h} draggable={true} onWheel={wheelEvent}>
                <Layer>
                    {props.units.map((um: UnitModel) => {
                        const size = 25 * zoomLevel;
                        const isMyShip = faction && faction.id === um.factionId;
                        const inCommand = unitIsInFleet(um);
                        
                        const onSystem = inCommand ? game.turn === inCommand.turn : true;

                        const x = h * (um.location.x / 100) * zoomLevel - (onSystem ? (inCommand === null ? 0 : size): size/2);
                        const y = h * (um.location.y / 100) * zoomLevel - (onSystem ? (inCommand === null ? size : 0): size/2);


                        // const ax = x + (size / 2);
                        // const ay = y + (size / 2);
                        // const tx = inCommand !== null ? h * (inCommand.target.x / 100) * zoomLevel : 0;
                        // const ty = inCommand !== null ? h * (inCommand.target.y / 100) * zoomLevel : 0;

                        const speed = um.speed;

                        return (
                            <Group key={um.id}>
                                {/* {inCommand !== null && isMyShip && <Line points={[ax, ay, tx, ty]} strokeWidth={2 * zoomLevel} stroke={faction ? faction.color : "white"} dash={[5 * zoomLevel, 5 * zoomLevel]} />} */}
                                {inCommand !== null && isMyShip && <CoordinateLine from={um.location} to={inCommand.target} color={faction ? faction.color : "white"} zoom={zoomLevel} dash={[5, 5]} speed={speed} adjust={0}/>}
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
                    {/* <Line points={getLinePoints(fleet[0].location, selectedSystem.location, 0, zoomLevel)} strokeWidth={2 * zoomLevel} stroke="white" dash={[5, 5]} /> */}
                    {/* <Text text="dist" fill="#FFF" x={selectedSystem.location.x} y={selectedSystem.location.y} /> */}

                </Layer>}

                <Layer>
                    {props.systems.map((star: SystemModel) => {
                        const ownerFaction = getFactionById(props.factions, star.ownerFactionId);
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
                                    width={size*5}
                                    height={size*5}
                                    x={-size*2.5}
                                    y={-size*2.5}
                                    opacity={0.7}
                                />}
                                {isSelected && <Circle radius={size * 2} strokeWidth={2} stroke="#FFF" fill="#888" />}
                                {star.ringWorld && <Ring fill={color} innerRadius={size * 1.5} outerRadius={size * 1.75} />}
                                {ownerFaction && <Star width={size} height={size} fill={color} numPoints={6} innerRadius={size / 1.5} outerRadius={size * 1.25} />}
                                {!ownerFaction && <Circle radius={size} fill={color} />}
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

    const w = windowSize.width;
    const h = windowSize.height - 80;

    const x = h * (props.from.x / 100) * props.zoom;
    const y = h * (props.from.y / 100) * props.zoom;


    const ax = x + (props.adjust ? props.adjust / 2 : 0);
    const ay = y + (props.adjust ? props.adjust / 2 : 0);
    const tx = h * (props.to.x / 100) * props.zoom;
    const ty = h * (props.to.y / 100) * props.zoom;

    const dash = props.dash || [];

    const dist = Math.ceil(Math.sqrt((Math.pow(props.to.x - props.from.x, 2) + Math.pow(props.to.y - props.from.y, 2))))
    const turns = props.speed ? Math.ceil(dist/props.speed) : 0;
    const helpText = `${props.speed ? turns : dist}`;

    return (
        <>
            <Line points={[ax, ay, tx, ty]} dash={dash} stroke={props.color} strokeWidth={2 * props.zoom} />
            {(props.showDist || props.speed ) && <Text text={helpText} fill={props.color} x={(tx + ax )/2 -11} y={(ty + ay)/2 -11} fontSize={22} stroke="black" fontFamily="Impact" strokeWidth={1.5} fontStyle="bold" />}
        </>
    )

}

export default LargeMap;