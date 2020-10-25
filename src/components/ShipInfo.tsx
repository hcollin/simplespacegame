import React, { FC } from "react";
import { Ship } from "../models/Models";


interface ShipInfoProps {
    ship: Ship;

}

const ShipInfo: FC<ShipInfoProps> = (props) => {

    return <div>
        {props.ship.name}
    </div>
}


export default ShipInfo;