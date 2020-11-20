

export function mapAdd<K>(m: Map<K, number>, k: K, v: number): Map<K, number> {
    if(m.has(k)) {
        const cur = m.get(k);
        if(cur) {
            m.set(k, cur + v);
        }
    } else {
        m.set(k, v);
    }
    return new Map(m);
}