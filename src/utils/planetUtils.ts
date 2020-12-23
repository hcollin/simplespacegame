import { Planet, PlanetType } from "../models/StarSystem";
import { arnd, rnd, roll } from "./randUtils";

export function planetStyle(planet: Planet): [React.CSSProperties, string] {
	const size = 1 + planet.size / 2;

	let additionalClasses = "";

	const style: React.CSSProperties = {
		height: `${size}rem`,
		width: `${size}rem`,
		background: "radial-gradient(white, black)",
	};
	switch (planet.type) {
		case PlanetType.Ocean:
			// style.background = `radial-gradient(white, blue, deepblue)`;
			style.background = `radial-gradient(blue, black)`;
			additionalClasses = "blurclouds";
			break;
		case PlanetType.Desert:
			style.background = `radial-gradient(peru, black)`;
			additionalClasses = "ridges";
			break;
		case PlanetType.Lava:
			style.background = `radial-gradient(#F00 10%, #800 50%, #840 80%, black)`;
			additionalClasses = "cracked";
			break;
		case PlanetType.IcePlanet:
			style.background = `radial-gradient(white 20%, #88F 60%, blue 90%, black 100%)`;
			additionalClasses = "cracked";
			break;
		case PlanetType.GasGiant:
			style.background = `radial-gradient(brown, black)`;
			additionalClasses = "gas";
			break;
		case PlanetType.Barren:
			style.background = `radial-gradient(gray, black)`;
			additionalClasses = "ridges";
			break;
		case PlanetType.Terrestrial:
			style.background = `radial-gradient(green 30%, blue 60%, black)`;
			additionalClasses = "ridges";
			break;
		case PlanetType.Gaia:
			style.background = `radial-gradient(green 10%, blue 30%, green 60%, black)`;
			additionalClasses = "ridges";
			break;

		default:
			break;
	}

	return [style, additionalClasses];
}

const consonants: string[] = "bccdfffghhhjkllmmmnnpqrrssstvwxz".split("");
const vowels: string[] = "aaaaeeeeiiiioouy".split("");

const consonantStart: string[] = [
	...consonants,

	"bh",
	"bl",
	"br",
	"bw",

	"ch",
	"cl",
	"cr",
	// "cs",
	"ct",

	"dh",
	"dj",
	"dl",
	"dr",
	"dv",
	"dw",

	"fh",
	// "fj",

	"fl",

	"fr",
	"fs",
	"v",
	"fw",

	// "gf",
	"gh",
	// "gj",
	"gl",
	// "gn",
	"gr",
	// "gs",
	"gw",

	// "hj",
	// "hl",
	"hr",
	// "hs",

	"kh",
	// "kj",
	"k",
	"kl",
	"kn",
	"kr",
	"ks",
	// "kv",
	// "kw",

	// "lh",
	// "lj",
	// "ll",

	"mf",
	"mh",
	// "mj",
	// "ml",
	"mr",
	"ms",
	// "mv",
	// "mw",

	"pf",
	"ph",
	// "pj",
	"pl",
	"pn",
	"pr",
	"ps",

	"rh",
	"rj",

	"sc",
	"sh",
	"sj",
	"sk",
	"sl",
	"sm",
	"sn",
	"sp",
	"sq",
	"sr",
	"st",
	"sv",
	"sw",

	"th",
	"tj",
	"tr",
	"ts",
	"tv",
	"tw",

	"vh",
	"vl",
	"vr",

	"wh",
	"wr",

	"xc",
	"xs",
];

const consonantEndings: string[] = [
    "b",
    "bo",
    "ba",
    "borg",
    
    "c",
    "ch",
    
    "d",
    "do",
    
    "fil",
    
    "g",
    "go",
    "gun",




    "nd",
    "nto",
    "nro",
	"nk",
    
    "mn",
    "mmo",
    "mil",
    "mol",

    
    "rt",
    "rd",

	"sh",
	"st",
	
	
	"wn",
    "x",
    "xx",
];

const vowelEnding: string[] = [
    "a",
    "ai",
    "ae",
    "ar",
    "ab",
    "am",
    "and",
    "ast",
    
    "e",
    "ed",
    "em",
    "end",
    "est",
   
    "i",
    "in",
    "ish",
    "it",
    "im",

    "o",
    "ost",
    "or",
    "old",
    "ord",


    "u",
    "uh",
    "um",

    "y",
    "yh",
    "yk",
];

const vowelParts: string[] = [
	...vowels,
	...vowels,

	"aa",
	"ae",
	"ai",
	"au",
	"aio",

	"ea",
	"ee",
	"ei",
	"eio",
	"eia",

	"ia",
	"ie",
	"ii",
	"io",
	"iu",
	"iao",
	"iua",

	"oa",
	"oe",
	"oi",
	"oo",
	"ou",
	"oy",
	"oae",

	"ua",
	"ue",
	"ui",
	"uu",
	"uy",
	"uye",

	"ye",
	"yi",
];

export function randomNameGenerator(secondPart = false): string {
	let len = rnd(3, secondPart ? 6 : 9);

	let weight = 0;
	let prevCharType: "C" | "V" | null = null;
	let prevChar: string = "";
	let name = "";
	let i = 0;
	while (name.length < len) {
		let newCharType: "C" | "V" = "C";

		const lastChar = name.length + 1 >= len;

		switch (prevCharType) {
			case null:
				newCharType = arnd(["C", "C", "C", "V"]);
				break;
			case "C":
				newCharType = "V";
				break;
			case "V":
				if (roll(weight * 33)) {
					newCharType = "C";
				} else {
					newCharType = "V";
				}
				break;
		}

		let newChar: string = "";
		switch (newCharType) {
			case "C":
				if (prevCharType === null) {
					newChar = arnd(consonantStart);
				} else {
					if (lastChar) {
						newChar = arnd(consonantEndings);
					} else {
						roll(100 - Math.round((name.length / len) * 100)) ? (newChar = arnd(consonantStart)) : (newChar = arnd(consonants));
					}
				}
				weight = 0;
				break;
			case "V":
                if(lastChar) {
                    newChar = arnd(vowelEnding);
				    weight = 4;
                } else {
                    newChar = arnd(vowelParts);
                    weight = 4;
                }
				
				// weight++;
				// if(newChar === prevChar) weight++;
				// if(newChar === "y" || newChar === "u" ) weight += 3;
				break;
		}

		name = `${name}${newChar}`;
		prevChar = newChar;
		prevCharType = newCharType;
		i++;

		if (i > 100) {
			console.log("FAIL", name, newChar);
			return "FAIL";
		}
	}

	if (secondPart === false && roll(80 - name.length * 10)) {
		name = `${name} ${randomNameGenerator(true)}`;
	}

	return name.charAt(0).toUpperCase() + name.slice(1);
}
