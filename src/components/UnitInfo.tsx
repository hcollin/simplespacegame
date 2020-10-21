import React, { FC } from "react";
import { UnitModel } from "../models/Models";
import { getFactionById } from "../utils/factionUtils";

interface UnitInfoProps {
    unit: UnitModel;
}

const UnitInfo: FC<UnitInfoProps> = (props: UnitInfoProps) => {
    const faction = getFactionById(props.unit.factionId);

    return (
        <div>
            <h3>
                {props.unit.name} <small>({faction.name})</small>
            </h3>
        </div>
    );
};

export default UnitInfo;
