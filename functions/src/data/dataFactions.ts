import { FactionModel } from "../models/Models";
import { createNewFaction } from "../services/helpers/FactionHelpers";
import { arnd, arnds } from "../utils/randUtils";

const DATAFACTIONS: FactionModel[] = [];

const playerCount = 6;

for (let i = 0; i < playerCount; i++) {
    DATAFACTIONS.push(createNewFaction());
}


export default DATAFACTIONS;


