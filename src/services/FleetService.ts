import { JokiEvent, JokiService, JokiServiceApi } from "jokits";
import { Coordinates, Fleet, SystemModel, UnitModel } from "../models/Models";
import { hasGameObject } from "../utils/arrUtils";
import { moveUnits } from "./commands/UnitCommands";

export default function createFleetService(serviceId: string, api: JokiServiceApi): JokiService<Fleet | null> {
    let fleet: Fleet | null = null;

    function eventHandler(event: JokiEvent) {
        if (event.to === serviceId) {
            switch (event.action) {
                case "addUnit":
                    addUnit(event.data as UnitModel);
                    break;
                case "removeUnit":
                    removeUnit(event.data as UnitModel | string);
                    break;
                case "setTarget":
                    setTarget(event.data as Coordinates|null);
                    break;
                case "confirm":
                    confirm();
                    break;
                case "cancel":
                    cancel();
                    break;
            }
        }

        if(event.from === "useSelectedSystem" && event.action ==="systemSelected") {
            if(event.data === null) {
                setTarget(null);
            } else {
                const sm = event.data as SystemModel;
                setTarget(sm.location);
                
            }
            
        }
    }

    function addUnit(u: UnitModel) {
        _initFleet();
        if (fleet) {
            if (!hasGameObject(fleet.units, u.id)) {
                fleet.units.push(u);
                sendUpdate();
            }
        }
    }

    function removeUnit(u: UnitModel | string) {
        if (!fleet) return;
        const uid = typeof u === "string" ? u : u.id;
        if (hasGameObject(fleet.units, uid)) {
            fleet.units = fleet.units.filter((um: UnitModel) => um.id !== uid);
            sendUpdate();
        }
    }

    function setTarget(coord: Coordinates|null) {
        _initFleet();
        if(fleet) {
            fleet.target = coord;
            sendUpdate();
        }
    }

    function confirm() {
        if(fleet && fleet.target !== null && fleet.units.length > 0) {

            moveUnits(fleet.units, fleet.target);

            fleet = null;
            sendUpdate();
        }
    }

    function cancel() {
        fleet = null;
        sendUpdate();
    }

    

    function getState(): Fleet | null {
        return fleet;
    }

    function _initFleet() {
        if (fleet === null) {
            const f: Fleet = {
                target: null,
                units: [],
            };
            fleet = f;
            sendUpdate();
        }
    }

    function sendUpdate() {
        api.updated(fleet === null ? null : { ...fleet });
    }

    return {
        eventHandler,
        getState,
    };
}
