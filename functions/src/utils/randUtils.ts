/**
 * Return a random integer number between two provided values
 *
 * @param min number
 * @param max number
 */
export function rnd(min: number, max: number): number {
    
    return Math.floor(Math.random() * ((max+1) - min)) + min;
}

/**
 * Return a random integer number as a string with leading zeroes.
 *
 * If the random values is requested between 1 and 999, following results would be valid:
 *
 *   13 => "013"
 *   123 => "123"
 *
 * @param min number
 * @param max number
 */
export function prnd(min: number, max: number): string {
    const num = rnd(min, max);
    const maxLen = max.toString().length;
    const numStr: string = num.toString();

    return numStr.padStart(maxLen, "0");
}

/**
 * Return a random value from the provided array
 *
 * @param arr array<T>
 */
export function arnd<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Return a random values from the provided array
 *
 * @param arr array<T>
 * @param amout number Amount of values to return
 */
export function arnds<T>(arr: Array<T>, amount: number, unique = false): T[] {
    if (unique && arr.length <= amount) {
        return [...arr];
    }
    const res: T[] = [];
    if (!unique) {
        for (let i: number = 0; i < amount; i++) {
            if (!unique) {
                res.push(arnd<T>(arr));
            }
        }
    } else {
        while (res.length < amount) {
            const val: T = arnd<T>(arr);
            if (!res.includes(val)) {
                res.push(val);
            }
        }
    }

    return res;
}

export function fnreps<T>(fn: () => T, maxRepeats: number) {
    const reps = rnd(0, maxRepeats);
    const res: T[] = [];
    while (res.length < reps) {
        res.push(fn());
    }
    return res;
}

export function roll(chance: number) {
    const d100Roll: number = Math.floor(Math.random() * 100);
    if (chance > d100Roll) {
        return true;
    }
    return false;
}

export function grnd(mid: number, steps: number, depth: number, minCut?: number, maxCut?:number): number {
    
    function insideCut(val: number) {
        if(typeof minCut === "number" && val < minCut) return false;
        if(typeof maxCut === "number" && val > maxCut) return false;
        return true;
    }

    let res = mid;
    
    
    const maxDepth = depth * 2;
    const mods: Array<number|string> = [];
    for (let i = 0; i < steps; i++) {
        const mod = rnd(0, maxDepth) - depth;
        mods.push(mod);
        
        if(insideCut(res + mod)) {
            res += mod;
        }
        
        // if(typeof maxCut === "number" && res > maxCut) {
        //     // res -= mod;
        //     res = Number(mods[mods.length -1])
        //     mods.push(`>Cut to ${res}`);
        // }
        // if(typeof minCut === "number" && res < minCut) {
        //     res += mod;
        //     mods.push(`<Cut to ${res}`);
        // }
    }

    // if(minCut !== undefined && res < minCut) {
    //     res += rnd(0, depth);
    // }

    // if(maxCut !== undefined && res > maxCut) {
    //     res -= rnd(0, depth);
    //     // res = maxCut;
    // }

    if(typeof minCut === "number" && res < minCut) console.log(mods);
    return res;
}

export function reps(times: number, fn: () => void): void {
    for (let i = 0; i < times; i++) {
        fn();
    }
}


export function shuffle<T>(arr: T[]):T[] {
    
    // const maxLen = arr.length;
    const copyArr = [...arr];
    const newArr: T[] = [];
    
    while(copyArr.length > 0) {
        const ind = rnd(0, copyArr.length - 1);

        newArr.push(copyArr.splice(ind, 1)[0]);
    }

    return newArr;
}


const Characters: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");

export function rndId(): string {
    const ts = Date.now();
    return `${arnd(Characters)}${arnd(Characters)}${arnd(Characters)}${arnd(Characters)}${arnd(Characters)}-${ts}-${arnd(Characters)}${arnd(Characters)}${arnd(Characters)}${arnd(Characters)}`;

}


