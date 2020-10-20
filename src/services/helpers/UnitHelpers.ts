import { v4 } from "uuid";
import DATASHIPS from "../../data/dataShips";
import { UnitModel, Ship, Coordinates } from "../../models/Models";

export function createUnitFromShip(shipName: string, factionId: string, location: Coordinates): UnitModel {
    const ship = DATASHIPS.find((s: Ship) => s.name === shipName);

    if (!ship) {
        throw new Error(`Unknown ship name ${shipName}`);
    }

    const unit: UnitModel = {
        ...ship,
        location: location,
        factionId: factionId,
        damage: 0,
        id: v4(),
    };

    return unit;
}
