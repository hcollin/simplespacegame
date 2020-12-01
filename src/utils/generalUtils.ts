import { rnd } from "./randUtils";

export function mapAdd<K>(m: Map<K, number>, k: K, v: number): Map<K, number> {
    if (m.has(k)) {
        const cur = m.get(k);
        if (cur) {
            m.set(k, cur + v);
        }
    } else {
        m.set(k, v);
    }
    return new Map(m);
}

export async function asyncMapForeach<K, T>(
    m: Map<K, T>,
    callback: (value: T, key: K) => Promise<void> | void
): Promise<void> {
    const iter = m.entries();
    let res = iter.next();
    while (!res.done) {
        const [key, value] = res.value;
        await callback(value, key);
        res = iter.next();
    }
}

export async function asyncArrayForeach<T>(
    arr: T[],
    callback: (value: T, index?: number) => Promise<void> | void
): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
        await callback(arr[i], i);
    }
}

export async function asyncArrayMap<T>(arr: T[], callback: (value: T, index?: number) => Promise<T>): Promise<T[]> {
    const newArr: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        const val = await callback(arr[i], i);
        newArr.push(val);
    }
    return newArr;
}

export function convertHexRgbToComponents(colorAsRGBHex: string): [number, number, number, number] {
    const hex = colorAsRGBHex.charAt(0) === "#" ? colorAsRGBHex.slice(1).toUpperCase() : colorAsRGBHex.toUpperCase();

    const validLengths = [3, 4, 6, 8];
    if (!validLengths.includes(hex.length)) throw new Error(`Provided hex color ${colorAsRGBHex} value is invalid`);

    const m = hex.match(/[^0-9A-F]/gi);
    if (m) {
        console.log(m);
        throw new Error(`Provided hex color ${colorAsRGBHex} has invalid characters`);
    }

    const hexParts: [number, number, number, number] = [0, 0, 0, 1];

    if (hex.length <= 4) {
        hexParts[0] = Number.parseInt(hex.slice(0, 1).repeat(2), 16);
        hexParts[1] = Number.parseInt(hex.slice(1, 2).repeat(2), 16);
        hexParts[2] = Number.parseInt(hex.slice(2, 3).repeat(2), 16);
    }

    if (hex.length === 4) {
        hexParts[3] = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
    }

    if (hex.length === 6 || hex.length === 8) {
        hexParts[0] = Number.parseInt(`${hex.slice(0, 2)}`, 16);
        hexParts[1] = Number.parseInt(`${hex.slice(2, 4)}`, 16);
        hexParts[2] = Number.parseInt(`${hex.slice(4, 6)}`, 16);
    }

    if (hex.length === 8) {
        hexParts[3] = Number.parseInt(`${hex.slice(6, 8)}`, 16) / 255;
    }

    return hexParts;
}

export function getColorSum(hexColor: string, bgisdark = true): number {
    const color = convertHexRgbToComponents(hexColor);

    const total = color.reduce((tot: number, cur: number) => {
        return tot + cur;
    }, 0);

    return Math.round((total / 3 / 255) * 100);
}


export function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    
    const randomEnumValue = enumValues[rnd(0, enumValues.length)]
    return randomEnumValue;
  }