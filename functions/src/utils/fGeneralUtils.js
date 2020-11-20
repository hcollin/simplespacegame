"use strict";
exports.__esModule = true;
exports.mapAdd = void 0;
function mapAdd(m, k, v) {
    if (m.has(k)) {
        var cur = m.get(k);
        if (cur) {
            m.set(k, cur + v);
        }
    }
    else {
        m.set(k, v);
    }
    return new Map(m);
}
exports.mapAdd = mapAdd;
