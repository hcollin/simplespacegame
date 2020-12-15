const fs = require("fs");
const { argv } = require("process");

const fnRoot = "./functions/src";
const uxRoot = "./src";
const folders = [`/buildings/`, `/data/`, `/models/`, "/tech/", "/utils/"];

function compareLine(line1, line2) {
    const l1Type = typeof line1;
    const l2Type = typeof line2;
    if (l1Type === "string" && l2Type === "string") {
        return line1.trim() == line2.trim();
    }
    if (l1Type === l2Type) return true;
    return false;
}

function skipImports(lines) {
    let i = 0;
    while (lines[i].slice(0, 6).toLowerCase() === "import") {
        i++;
    }
    return i;
}

function removeComments(lines) {
    let skipping = false;
    const newLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (!skipping && line.slice(0, 2) === "/*") skipping = true;
        let nLine = line.replace(/\/\*[.+?]\*\//, "");

        nLine = nLine.replace(/\/\/.+/gi, "");

        if (!skipping) {
            newLines.push(nLine);
        }
        if (skipping && line.includes("*/")) skipping = false;
    }

    return newLines;
}

function removeEmptyLines(lines) {
    return lines.filter((l) => {
        if (l.replace(/[\ \t]+/gi, "").length === 0) return false;
        return true;
    });
}

function tuneLines(lines) {
    return removeComments(removeEmptyLines(lines));
}

function showLineError(ind1, ind2, lines1, lines2, spread = 1, highlight = false) {
    let ind1Start = ind1 - spread <= 0 ? 0 : spread * -1;
    console.log("\nIn functions");
    for (let i = ind1Start; i <= spread; i++) {
        const l = lines1[ind1 + i];
        if (i === 0) {
            console.log(ind1, "\x1b[31m", l);
        } else {
            console.log(ind1 + i, "\x1b[0m", l);
        }
    }

    let ind2Start = ind2 - spread <= 0 ? 0 : spread * -1;
    console.log("\nIn React");
    for (let i = ind2Start; i <= spread; i++) {
        const l = lines2[ind2 + i];
        if (highlight !== false) {
            if (ind2 + i === highlight) {
                console.log(ind2, "\x1b[31m", l);
            } else {
                console.log(ind2 + i, "\x1b[0m", l);
            }
        } else {
            if (i === 0) {
                console.log(ind2, "\x1b[31m", l);
            } else {
                console.log(ind2 + i, "\x1b[0m", l);
            }
        }
    }
}

function getExports(lines) {
    const exps = lines.reduce((exps, l) => {
        if (l.includes("export")) {
            const def = l.includes(" default ");
            const el = def ? l.replace(" default ", " ") : l;
            const fnExp = el.match(/export function ([\w\d]+?)\(/i);
            if (fnExp !== null) {
                exps.push(["function", fnExp[1], def]);
                return exps;
            }
            const constExp = el.match(/export const ([\w\d]+?) /i);
            if (constExp !== null) {
                exps.push(["const", constExp[1], def]);
                return exps;
            }
            const enumExp = el.match(/export enum ([\w\d]+?)\ *?\{/i);
            if (enumExp !== null) {
                exps.push(["enum", enumExp[1], def]);
                return exps;
            }
            const anyExp = el.match(/export ([\w\d]+)/);

            if (anyExp !== null) {
                exps.push(["unknown", anyExp[1], def]);
                return exps;
            }

            const expBrac = el.match(/export {(.*)}/);
            if (expBrac !== null) {
                expBrac[1].split(",").forEach((e) => {
                    exps.push(["unknown", e.trim(), false]);
                });
                return exps;
            }
        }
        return exps;
    }, []);

    return exps;
}

function compareFiles(fileName, fnData, uxData, silent = false) {
    !silent && console.log("\nCompare file", fileName);
    let differences = 0;
    const fnLines = tuneLines(fnData.split(/[\r\n]+/));
    const uxLines = tuneLines(uxData.split(/[\r\n]+/));

    if (fnLines.length !== uxLines.length && !silent)
        console.log(`Different row counts on files ${fileName}: ${fnLines.length} vs ${uxLines.length}`);

    let ind1 = skipImports(fnLines);
    let ind2 = skipImports(uxLines);

    const target = Math.max(fnLines.length, uxLines.length);

    for (let i = 0; i < target; i++) {
        const line1 = fnLines[ind1];
        const line2 = uxLines[ind2];

        if (!compareLine(line1, line2)) {
            let shown = false;

            if (compareLine(line1, uxLines[ind2 + 1])) {
                !silent && showLineError(ind1, ind2, fnLines, uxLines, 3, ind2 + 1);
                ind2++;
                shown = true;
            }

            if (compareLine(line1, uxLines[ind2 - 1])) {
                !silent && showLineError(ind1, ind2, fnLines, uxLines, 3, ind2 - 1);
                ind2--;
                shown = true;
            }

            if (!shown) {
                !silent && showLineError(ind1, ind2, fnLines, uxLines);
            }
            differences++;
        }

        ind1++;
        ind2++;
    }

    const fnExports = getExports(fnLines);
    const uxExports = getExports(uxLines);

    const missingFns = [];
    fnExports.forEach((fne) => {
        const uxHas = uxExports.find((uxe) => uxe[1] === fne[1]);
        if (!uxHas) {
            // console.log("\x1b[0m", fne[0], fne[1]);
            missingFns.push(["UX", ...fne]);
            // console.log("\x1b[31m", fne[0], fne[1]);
        }
    });
    uxExports.forEach((uxe) => {
        const fnHas = fnExports.find((fne) => fne[1] === uxe[1]);
        if (!fnHas) {
            // console.log("\x1b[0m", fne[0], fne[1]);
            missingFns.push(["FN", ...uxe]);
            // console.log("\x1b[31m", fne[0], fne[1]);
        }
    });
    if (!silent && missingFns.length > 0) {
        console.log("\nMissing functions");
        missingFns.forEach((ms) => {
            console.log(`${ms[0]} is missing ${ms[1]} ${ms[2]}`);
        });
    }

    differences += missingFns.length;
    !silent && console.log("\nTotal differences:", differences, "\n\n");

    return differences;
}

function readFile(fileNameAndPath, silent = false) {
    try {
        !silent && console.log("Load Contents: ", fileNameAndPath);
        if (fs.existsSync(fileNameAndPath)) {
            return fs.readFileSync(fileNameAndPath, "utf-8");
        } else {
            throw new Error(`Unknown path ${fileNameAndPath}`);
        }
    } catch (e) {
        console.error("Could not load file", fileNameAndPath);
        console.error(e);
    }
}

function createFileComparisons() {
    const targetFiles = [];
    folders.forEach((dirPath) => {
        const fnDir = `${fnRoot}${dirPath}`;

        const res = fs.readdirSync(fnDir);

        res.forEach((fn) => {
            if (fn.slice(-3) === ".ts") {
                targetFiles.push([dirPath, fn]);
            }
        });
    });

    return targetFiles;
}

function createFilesFromArgs(fns) {
    const targetFiles = [];
    fns.map(fn => {
        if(fn.slice(-3) !== ".js") return fn;
        return fn.slice(0, -3) + ".ts";
    }).forEach((fn) => {
        
        if (fs.existsSync(fn)) {
            const rfn = fn.replace(/\\/gi, "/");
            console.log("adding file", rfn);
            const arFn = rfn
                .replace(/.+?\/src/, "")
                .trim()
                .split("/");
            const realFn = arFn.pop();
            const path = arFn.join("/") + "/";
            targetFiles.push([path, realFn]);
        }
    });

    return targetFiles;
}

const fileArgs = argv.slice(2).filter((a) => a.slice(0, 1) !== "-");
const opts = argv.slice(2).filter((a) => a.slice(0, 1) === "-");

const files = fileArgs.length > 0 ? createFilesFromArgs(fileArgs) : createFileComparisons();

const fileDiffs = [];

files.forEach(([path, fFn]) => {
    const uxFn = fFn.charAt(1).toLowerCase() + fFn.slice(2);
    const data1 = readFile(`${fnRoot}${path}${fFn}`, opts.includes("-s"));
    const data2 = readFile(`${uxRoot}${path}${uxFn}`, opts.includes("-s"));

    const diffs = compareFiles(fFn, data1, data2, opts.includes("-s"));

    fileDiffs.push([path, fFn, diffs]);
});

console.table(fileDiffs);

// console.log(targetFiles);
