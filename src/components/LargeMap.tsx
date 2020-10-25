import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { KonvaEventObject } from "konva/types/Node";
import React, { FC, useState } from "react";
import { Circle, Group, Image, Layer, Line, Stage, Star, Text } from "react-konva";
import useSelectedSystem from "../hooks/useSelectedSystem";
import useWindowSize from "../hooks/useWIndowResize";
import { SystemModel, FactionModel, UnitModel } from "../models/Models";
import { getFactionById } from "../services/helpers/FactionHelpers";
import useImage from "use-image";
import useCurrentFaction from "../services/hooks/useCurrentFaction";
import useMyCommands from "../hooks/useMyCommands";
import { unitIsInFleet } from "../utils/commandUtils";
import { BuildUnitCommand, Command, CommandType, SystemPlusCommand } from "../models/Commands";
import { inSameLocation } from "../utils/locationUtils";

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

    const faction = useCurrentFaction();
    const commands = useMyCommands();

    const [zoomLevel, setZoomLevel] = useState<number>(1);

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




    return (<div className={classes.root}>

        <div className={classes.map}>

            <Stage width={w} height={h} draggable={true} onWheel={wheelEvent}>
                <Layer>
                    {props.units.map((um: UnitModel) => {
                        const size = 25 * zoomLevel;
                        const isMyShip = faction && faction.id === um.factionId;
                        const inCommand = unitIsInFleet(um);
                        const x = h * (um.location.x / 100) * zoomLevel - (inCommand === null ? 0 : size);
                        const y = h * (um.location.y / 100) * zoomLevel - (inCommand === null ? size : 0);


                        const ax  = x + (size/2);
                        const ay =  y+ (size/2);
                        const tx = inCommand !== null ? h*(inCommand.target.x / 100)*zoomLevel : 0;
                        const ty = inCommand !== null ? h*(inCommand.target.y / 100)*zoomLevel : 0;
                        return (
                            <Group key={um.id}>
                                {inCommand !== null && isMyShip && <Line points={[ax,ay,tx, ty]} strokeWidth={2*zoomLevel} stroke={faction ? faction.color : "white"} dash={[5*zoomLevel,5*zoomLevel]}/>}
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
                <Layer>
                    {props.systems.map((star: SystemModel) => {
                        const ownerFaction = getFactionById(props.factions, star.ownerFactionId);
                        const color = ownerFaction ? ownerFaction.color : star.color;
                        const size = ownerFaction ? 8 * zoomLevel : 5 * zoomLevel;
                        const isSelected = selectedSystem && selectedSystem.id === star.id;
                        const x = h * (star.location.x / 100) * zoomLevel;
                        const y = h * (star.location.y / 100) * zoomLevel;

                        const hasTargetedCommand = commands.find((cmd: Command) => {
                            switch(cmd.type) {
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

                                {isSelected && <Circle radius={size * 2} strokeWidth={2} stroke="#FFF" />}

                                {ownerFaction && <Star width={size} height={size} fill={color} numPoints={6} innerRadius={size / 1.5} outerRadius={size * 1.25} />}
                                {!ownerFaction && <Circle radius={size} fill={color} />}
                                {hasTargetedCommand && <Text text="!" fill="white" width={size} align="center" x={size*-0.5} y={-0.8 * size} fontSize={20*zoomLevel} strokeWidth={1} stroke="black" />}
                                {zoomLevel > 1.3 && <Text text={star.name} fill="#FFF" align="center" opacity={0.8} x={-70} y={10 * zoomLevel} width={140} />}
                            </Group>
                        )
                    })}
                </Layer>


            </Stage>

        </div>



    </div>)
}

export default LargeMap;