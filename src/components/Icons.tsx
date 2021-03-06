import { makeStyles, Theme, createStyles, Tooltip } from "@material-ui/core";
import React, { FC } from "react";

import iconCreditSvg from '../images/iconCredit.svg';
import IconResearchPointSvg from '../images/iconResearchPoint.svg';
import iconScoreSvg from '../images/iconScore.svg';
import iconCommandSvg from '../images/iconCommand.svg';
import iconIndustrySvg from '../images/iconIndustry.svg';

import iconAccuracySvg from '../images/iconAccuracy.svg';
import iconShieldsSvg from '../images/iconShields.svg';
import iconHullSvg from '../images/iconHull.svg';
import iconAgilitySvg from '../images/iconAgility.svg';
import iconArmorSvg from '../images/iconArmor.svg';
import iconDamageSvg from '../images/iconDamage.svg';
import iconCooldownSvg from '../images/iconCooldown.svg';
import iconSpeedSvg from '../images/iconSpeed.svg';
import iconWelfareSvg from '../images/iconWelfare.svg';
import iconDefenseSvg from '../images/iconDefense.svg';
import iconUnderConstructionSvg from '../images/iconUnderConstruction.svg';
import IconEconomySvg from '../images/iconEconomy.svg';
import IconDurationSvg from '../images/iconDuration.svg';
import IconReportSvg from '../images/iconReport.svg';
import IconTroopsSvg from '../images/iconTroops.svg';
import IconFighterSvg from '../images/iconFighter.svg';

import IconTechBiologySvg from '../images/techBiology.svg';
import IconTechMaterialSvg from '../images/techMaterial.svg';
import IconTechBusinessSvg from '../images/techBusiness.svg';
import IconTechInformationSvg from '../images/techInformation.svg';
import IconTechChemistrySvg from '../images/techChemistry.svg';
import IconTechPhysicsSvg from '../images/techPhysics.svg';

import IconShipSvg from '../images/iconShip.svg';
import IconShipBlackSvg from '../images/iconShipBlack.svg';
import iconActionPointSvg from '../images/iconActionPoint.svg';

import iconRecycleSvg from '../images/iconRecycle.svg';
import iconTrashSvg from '../images/iconTrash.svg';

import iconBombardmentSvg from '../images/iconBombardment.svg';
import iconSkullSvg from '../images/iconSkull.svg';
import iconMaintenanceCostSvg from '../images/iconMaintenanceCost.svg';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {


            height: "1rem",
            width: "1rem",

            "&.sm": {
                height: "0.7rem",
                width: "0.7rem",
            },
            "&.lg": {
                height: "1.8rem",
                width: "1.8rem",
            },
            "&.xl": {
                height: "3rem",
                width: "3rem",
            },
            "&.xxl": {
                height: "5rem",
                width: "5rem",
            },
            "&.wrapper": {

                borderRadius: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: "solid 1px #0004",
                background: "#FFF4",
                boxShadow: "inset 0 0 0.5rem 3px #0004",
                "&.dark": {
                    border: "solid 1px #0004",
                    background: "#0004",
                    boxShadow: "inset 0 0 0.5rem 3px #0004",
                },
                "& > img.image": {
                    height: "80%",
                }
            },


        },


    }));


interface IconProps {
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    className?: string;
    wrapper?: "light" | "dark";
}

const IconCredit: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Credits" iconSvg={iconCreditSvg} />;
}

const IconResearchPoint: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Research Point" iconSvg={IconResearchPointSvg} />;
}

const IconScore: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Score" iconSvg={iconScoreSvg} />;
}

const IconCommand: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Command" iconSvg={iconCommandSvg} />;
}

const IconIndustry: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Industry" iconSvg={iconIndustrySvg} />;
}

const IconAccuracy: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Weapon Accuracy" iconSvg={iconAccuracySvg} />;
}

const IconDamage: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Weapon Damage" iconSvg={iconDamageSvg} />;
}

const IconShields: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship Shields" iconSvg={iconShieldsSvg} />;
}

const IconHull: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship Hull" iconSvg={iconHullSvg} />;
}

const IconAgility: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship Agility" iconSvg={iconAgilitySvg} />;
}

const IconArmor: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship Armor" iconSvg={iconArmorSvg} />;
}

const IconCooldown: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Weapon Cooldown" iconSvg={iconCooldownSvg} />
}

const IconSpeed: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship FTL Speed" iconSvg={iconSpeedSvg} />
}

const IconWelfare: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Welfare" iconSvg={iconWelfareSvg} />
}


const IconEconomy: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Economy" iconSvg={IconEconomySvg} />
}

const IconDefense: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Defense" iconSvg={iconDefenseSvg} />
}

const IconUnderConstruction: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Under Construction" iconSvg={iconUnderConstructionSvg} />
}

const IconDuration: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Duration" iconSvg={IconDurationSvg} />
}

const IconReport: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Report" iconSvg={IconReportSvg} />
}

const IconTroops: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Troops" iconSvg={IconTroopsSvg} />
}

const IconFighter: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Fighter" iconSvg={IconFighterSvg} />
}

const IconTechBiology: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Biology" iconSvg={IconTechBiologySvg} />
}

const IconTechMaterial: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Material" iconSvg={IconTechMaterialSvg} />
}
const IconTechBusiness: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Economy" iconSvg={IconTechBusinessSvg} />
}
const IconTechInformation: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Information" iconSvg={IconTechInformationSvg} />
}
const IconTechChemistry: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Chemistry" iconSvg={IconTechChemistrySvg} />
}
const IconTechPhysics: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Physics" iconSvg={IconTechPhysicsSvg} />
}
const IconShip: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship" iconSvg={IconShipSvg} />
}
const IconShipBlack: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Ship" iconSvg={IconShipBlackSvg} />
}
const IconActionPoint: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Action Point" iconSvg={iconActionPointSvg} />
}
const IconRecycle: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Recycle" iconSvg={iconRecycleSvg} />
}
const IconTrash: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Trash" iconSvg={iconTrashSvg} />
}
const IconBombardment: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Bombardment" iconSvg={iconBombardmentSvg} />
}
const IconSkull: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="Skull" iconSvg={iconSkullSvg} />
}
const IconMaintenanceCost: FC<IconProps> = (props) => {
    return <GeneralIcon {...props} tooltip="MaintenanceCost" iconSvg={iconMaintenanceCostSvg} />
}


export {
    IconCredit,
    IconResearchPoint,
    IconScore,
    IconCommand,
    IconIndustry,
    IconAccuracy, 
    IconShields, 
    IconHull, 
    IconAgility, 
    IconArmor, 
    IconDamage, 
    IconCooldown, 
    IconSpeed, 
    IconWelfare, 
    IconDefense,
    IconUnderConstruction,
    IconEconomy,
    IconDuration,
    IconReport,
    IconTroops,
    IconFighter,
    IconTechBiology,
    IconTechMaterial,
    IconTechBusiness,
    IconTechInformation,
    IconTechChemistry,
    IconTechPhysics,
    IconShip,
    IconShipBlack,
    IconActionPoint,
    IconRecycle,
    IconTrash,
    IconBombardment,
    IconSkull,
    IconMaintenanceCost,
};

interface GeneralIcon extends IconProps {
    tooltip: string;
    iconSvg: string;
}


const GeneralIcon: FC<GeneralIcon> = (props) => {
    const classes = useStyles();
    const { tooltip, iconSvg } = props;

    if (props.wrapper) {
        return (
            <Tooltip title={tooltip}>
                <div className={`${classes.root} wrapper ${props.wrapper || "light"} ${props.size || "md"}`}>
                    <img src={iconSvg} alt={tooltip} className={`${classes.root} image ${props.size} ${props.className || ""}`} />
                </div>
            </Tooltip>);
    }

    return (
        <Tooltip title={tooltip}>
            <img src={iconSvg} alt={tooltip} className={`${classes.root} image ${props.size} ${props.className || ""}`} />
        </Tooltip>)
}