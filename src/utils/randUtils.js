"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/**
 * Return a random integer number between two provided values
 *
 * @param min number
 * @param max number
 */
function rnd(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
}
exports.rnd = rnd;
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
function prnd(min, max) {
    var num = rnd(min, max);
    var maxLen = max.toString().length;
    var numStr = num.toString();
    return numStr.padStart(maxLen, "0");
}
exports.prnd = prnd;
/**
 * Return a random value from the provided array
 *
 * @param arr array<T>
 */
function arnd(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.arnd = arnd;
/**
 * Return a random values from the provided array
 *
 * @param arr array<T>
 * @param amout number Amount of values to return
 */
function arnds(arr, amount, unique) {
    if (unique === void 0) { unique = false; }
    if (unique && arr.length <= amount) {
        return __spreadArrays(arr);
    }
    var res = [];
    if (!unique) {
        for (var i = 0; i < amount; i++) {
            if (!unique) {
                res.push(arnd(arr));
            }
        }
    }
    else {
        while (res.length < amount) {
            var val = arnd(arr);
            if (!res.includes(val)) {
                res.push(val);
            }
        }
    }
    return res;
}
exports.arnds = arnds;
function fnreps(fn, maxRepeats) {
    var reps = rnd(0, maxRepeats);
    var res = [];
    while (res.length < reps) {
        res.push(fn());
    }
    return res;
}
exports.fnreps = fnreps;
function roll(chance) {
    var d100Roll = Math.floor(Math.random() * 100);
    if (chance > d100Roll) {
        return true;
    }
    return false;
}
exports.roll = roll;
function grnd(mid, steps, depth, minCut, maxCut) {
    function insideCut(val) {
        if (typeof minCut === "number" && val < minCut)
            return false;
        if (typeof maxCut === "number" && val > maxCut)
            return false;
        return true;
    }
    var res = mid;
    var maxDepth = depth * 2;
    var mods = [];
    for (var i = 0; i < steps; i++) {
        var mod = rnd(0, maxDepth) - depth;
        mods.push(mod);
        if (insideCut(res + mod)) {
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
    if (typeof minCut === "number" && res < minCut)
        console.log(mods);
    return res;
}
exports.grnd = grnd;
function reps(times, fn) {
    for (var i = 0; i < times; i++) {
        fn();
    }
}
exports.reps = reps;
function shuffle(arr) {
    // const maxLen = arr.length;
    var copyArr = __spreadArrays(arr);
    var newArr = [];
    while (copyArr.length > 0) {
        var ind = rnd(0, copyArr.length - 1);
        newArr.push(copyArr.splice(ind, 1)[0]);
    }
    return newArr;
}
exports.shuffle = shuffle;
