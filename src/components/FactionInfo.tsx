import React, { FC } from "react";
import { FactionModel } from "../models/Models";


interface FactionInfoProps {
    faction: FactionModel;
}

const FactionInfo: FC<FactionInfoProps> = (props: FactionInfoProps) => {

    return (
        <div>
            <h2 style={{color: props.faction.color}}>{props.faction.name}</h2>
        </div>
    )

}


export default FactionInfo;