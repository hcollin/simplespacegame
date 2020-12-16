import { arnd } from "../../utils/randUtils";

const gn1 = ["War", "Conflict", "Chaos", "Dawn", "Dusk", "The End of", "Space"];
const gn2 = ["Stars", "Imperiums", "Empires", "Races", "Time", "Era"];

export function randomGameName(): string {
	return `${arnd(gn1)} ${arnd(gn2)}`;
}
