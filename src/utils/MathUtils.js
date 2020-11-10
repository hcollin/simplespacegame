"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
function distanceBetweenCoordinates(a, b) {
    return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
}
exports.distanceBetweenCoordinates = distanceBetweenCoordinates;
function travelingBetweenCoordinates(from, to, distance) {
    var v1 = getVectorFromCoords(from, to);
    var len = Vectors.length(v1);
    if (distance > len)
        return __assign({}, to);
    var norm = Vectors.normalize(v1);
    var x = from.x + distance * norm[0];
    var y = from.y + distance * norm[1];
    return { x: x, y: y };
}
exports.travelingBetweenCoordinates = travelingBetweenCoordinates;
function angleBetweenCoordinates(a, b) {
    return 0;
}
exports.angleBetweenCoordinates = angleBetweenCoordinates;
function findClosestCoordinate(coords, point) {
    var closest = { x: 0, y: 0 };
    var distance = 1000000;
    coords.forEach(function (c, i) {
        var d = Math.pow(c.x - point.x, 2) + Math.pow(c.y - point.y, 2);
        if (d < distance) {
            distance = d;
            closest = c;
        }
    });
    return closest;
}
exports.findClosestCoordinate = findClosestCoordinate;
function getVectorFromCoords(a, b) {
    return [b.x - a.x, b.y - a.y];
}
exports.getVectorFromCoords = getVectorFromCoords;
function normalize(vec) {
    var len = length(vec);
    return [vec[0] / len, vec[1] / len];
}
function length(vec) {
    return Math.sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]));
}
var Vectors = {
    normalize: normalize,
    length: length
};
exports.Vectors = Vectors;
