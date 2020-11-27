import React, { FC } from "react";
import { Command, CommandType } from "../models/Commands";

import iconBuildSvg from "../images/iconUnderConstruction.svg";
import iconScienceSvg from "../images/iconScience.svg";
import iconFleetSvg from "../images/iconUnits.svg";
import { IconCommand, IconDefense, IconEconomy, IconIndustry, IconWelfare } from "./Icons";

interface Props {
    command: Command;
    className?: string;
}

const CommandIcon: FC<Props> = (props) => {
    switch (props.command.type) {
        case CommandType.FleetMove:
            return <img src={iconFleetSvg} className={props.className || ""} alt="Fleet Icon" />;
        case CommandType.TechnologyResearch:
            return <img src={iconScienceSvg} className={props.className || ""} alt="Science Icon" />;
        case CommandType.SystemBuildingBuild:
        case CommandType.SystemBuildUnit:
        case CommandType.SystemBuildingRemove:
            return <img src={iconBuildSvg} className={props.className || ""} alt="Science Icon" />;
        case CommandType.SystemIndustry:
            return <IconIndustry className={props.className || ""} />;
        case CommandType.SystemEconomy:
            return <IconEconomy className={props.className || ""} />;
        case CommandType.SystemWelfare:
            return <IconWelfare className={props.className || ""} />;
        case CommandType.SystemDefense:
            return <IconDefense className={props.className || ""} />;
        default:
            return <IconCommand className={props.className || ""} />;
    }
};

export default CommandIcon;
