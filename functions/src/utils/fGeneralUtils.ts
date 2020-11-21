

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


export async function asyncMapForeach<K, T>(m: Map<K, T>, callback: (value: T, key: K) => Promise<void>|void): Promise<void> {
	const iter = m.entries();
	let res = iter.next();
	while (!res.done) {
		const [key, value] = res.value;
		await callback(value, key);
		res = iter.next();
	}
}

export async function asyncArrayForeach<T>(arr: T[], callback: (value: T, index?: number) => Promise<void>|void): Promise<void> {
    for(let i=0; i < arr.length; i++) {
        await callback(arr[i], i);
    }
}

export async function asyncArrayMap<T>(arr: T[], callback: (value: T, index?: number) => Promise<T>): Promise<T[]> {
    const newArr: T[] = [];
    for(let i=0; i < arr.length; i++) {
        const val = await callback(arr[i], i);
        newArr.push(val);
    }
    return newArr;
}
