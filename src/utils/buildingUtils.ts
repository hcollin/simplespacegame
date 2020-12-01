import { v4 } from "uuid";
import { buildBuildingRules } from "../buildings/buildingRules";
import { BUILDINGTYPE, DATABUILDINGS } from "../data/dataBuildings";
import { TECHIDS } from "../data/dataTechnology";
import { Building, BuildingDesign, BuildingUnderConstruction } from "../models/Buildings";
import { BuildBuildingCommand, Command, CommandType } from "../models/Commands";
import { FactionModel, GameModel } from "../models/Models";
import { SystemModel } from "../models/StarSystem";

export function buildingCanBeBuiltOnSystem(building: BuildingDesign, star: SystemModel, faction: FactionModel): boolean {
	if (building.minEconomy > star.economy) return false;
	if (building.minIndustry > star.industry) return false;
	if (building.minWelfare > star.welfare) return false;
	if (building.cost > faction.money) return false;

	let techPreReqsMet = true;
	building.techPreqs.forEach((req: TECHIDS) => {
		if (faction.technology.includes(req) === false) {
			techPreReqsMet = false;
		}
	});

	if (!techPreReqsMet) return false;

	return buildBuildingRules(star, building.type);
}

export function getBuildingDesignByType(btype: BUILDINGTYPE): BuildingDesign {
	const bd = DATABUILDINGS.find((bd: BuildingDesign) => bd.type === btype);
	if (!bd) {
		throw new Error(`Unknown building type ${btype}. Cannot build.`);
	}

	return bd;
}

export function getBuildingTime(buildingType: BUILDINGTYPE): number {
	const bd = DATABUILDINGS.find((bd: BuildingDesign) => bd.type === buildingType);
	if (!bd) {
		throw new Error(`Invalid building type ${buildingType}`);
	}

	return bd.buildTime;
}

export function getBuildingUnderConstruction(commands: Command[], star: SystemModel, game: GameModel): BuildingUnderConstruction | null {
	const buildingCommand = commands.find((cmd: Command) => {
		if (cmd.type === CommandType.SystemBuildingBuild) {
			const bCmd = cmd as BuildBuildingCommand;
			if (bCmd.targetSystem === star.id) {
				return true;
			}
		}
		return false;
	});
	if (!buildingCommand) {
		return null;
	}
	const bCmd = buildingCommand as BuildBuildingCommand;
	const design = DATABUILDINGS.find((bd: BuildingDesign) => bd.type === bCmd.buildingType);

	if (!design) {
		return null;
	}

	return { ...design, turnsLeft: bCmd.turnsLeft, cmdId: bCmd.id, cancellable: bCmd.turn === game.turn };
}

export function createBuildingFromDesign(bdesign: BuildingDesign): Building {
	return { ...bdesign, id: v4() };
}

export function systemHasBuilding(star: SystemModel, bt: BUILDINGTYPE): boolean {
	return star.buildings.find((b: Building) => b.type === bt) !== undefined;
}
