export function any<T>(elems: readonly T[], predicate: (elem: T) => boolean): boolean {
    for (const elem of elems) {
        if (predicate(elem)) {
            return true;
        }
    }
    return false;
}

export function all<T>(elems: readonly T[], predicate: (elem: T) => boolean): boolean {
    for (const elem of elems) {
        if (!predicate(elem)) {
            return false;
        }
    }
    return true;
}

export function enumerate<T>(elems: readonly T[]): [number, T][] {
    return zip(range(elems.length), elems);
}

export function groupBy<TElem>(elems: readonly TElem[], func: (elem: TElem) => string): { [group: string]: TElem[] } {
    const ret: { [group: string]: TElem[] } = {};

    for (const elem of elems) {
        const key = func(elem);
        ret[key] ? ret[key].push(elem) : (ret[key] = [elem]);
    }

    return ret;
}

export function range(n: number, stop?: number, step?: number): number[] {
    const ret: number[] = [];

    if (step === undefined || step === 0) {
        if ((stop === undefined && n >= 0) || (stop !== undefined && n <= stop)) {
            step = 1;
        } else {
            step = -1;
        }
    }
    if (stop === undefined) {
        stop = n;
        n = 0;
    }

    if (step > 0) {
        for (let i = n; i < stop; i += step) {
            ret.push(i);
        }
    } else {
        for (let i = n; i > stop; i += step) {
            ret.push(i);
        }
    }

    return ret;
}

export function toObject<T, TRes>(elems: readonly T[], keyFunc: (elem: T) => string, valueFunc: (elem: T) => TRes): { [key: string]: TRes } {
    const ret: { [key: string]: TRes } = {}
    for (const elem of elems) {
        ret[keyFunc(elem)] = valueFunc(elem);
    }
    return ret;
}

export function zip<T1, T2>(arr1: readonly T1[], arr2: readonly T2[]): [T1, T2][] {
    const res: [T1, T2][] = [];
    const max = Math.min(arr1.length, arr2.length);

    for (let i = 0; i < max; ++i) {
        res.push([arr1[i], arr2[i]]);
    }
    return res;
}