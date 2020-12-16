import { v4 } from "uuid";
import { BASEACTIONPOINTCOUNT } from "../../configs";
import { FactionSetup, FactionModel, TechnologyField, FactionState } from "../../models/Models";


export function createFactionFromSetup(setup: FactionSetup): FactionModel {
	const fm: FactionModel = {
		id: v4(),
		money: 3,
		technologyFields: [
			{ field: TechnologyField.BIOLOGY, points: 0, priority: 0 },
			{ field: TechnologyField.MATERIAL, points: 0, priority: 0 },
			{ field: TechnologyField.INFORMATION, points: 0, priority: 0 },
			{ field: TechnologyField.CHEMISTRY, points: 0, priority: 0 },
			{ field: TechnologyField.PHYSICS, points: 0, priority: 0 },
		],
		state: FactionState.PLAYING,
		name: setup.name,
		playerId: setup.playerId,
		color: setup.color,
		iconFileName: setup.iconFileName,
		style: {
			fontFamily: setup.fontFamily,
		},
		technology: [],
		debt: 0,
		aps: BASEACTIONPOINTCOUNT,
		shipDesigns: [],
	};

	return fm;
}