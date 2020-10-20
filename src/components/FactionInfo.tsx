import React, { FC } from "react";
import { FactionModel } from "../models/Models";
import useCurrentUser from "../services/hooks/useCurrentUser";


interface FactionInfoProps {
    faction: FactionModel;
}

const FactionInfo: FC<FactionInfoProps> = (props: FactionInfoProps) => {
    const [user, send] = useCurrentUser();

    function login() {
        send("switch", props.faction.playerId)
    }

    return (
        <div onClick={login}>
            <h2 style={{color: props.faction.color, border: user && user.id === props.faction.playerId ? "solid 2px black": ""}}>{props.faction.name}</h2>
        </div>
    )

}


export default FactionInfo;