export function any<T>(elems: readonly T[], predicate: (elem: T) => boolean): boolean {
    for (const elem of elems) {
        if (predicate(elem)) {
            return true;
        }
    }
    return false;
}

export function argMax<T>(elems: readonly T[], transform: (elem: T) => number): T[] {
    let ret = [elems[0]];
    let max = transform(elems[0]);

    for (let i = 1; i < elems.length; ++i) {
        const res = transform(elems[i]);
        if (res > max) {
            max = res;
            ret = [elems[i]];
        }
        else if (res === max) {
            ret.push(elems[i]);
        }
    }

    return ret;
}

export function argMin<T>(elems: readonly T[], transform: (elem: T) => number): T[] {
    let ret = [elems[0]];
    let min = transform(elems[0]);

    for (let i = 1; i < elems.length; ++i) {
        const res = transform(elems[i]);
        if (res < min) {
            min = res;
            ret = [elems[i]];
        }
        else if (res === min) {
            ret.push(elems[i]);
        }
    }

    return ret;
}

export function all<T>(elems: readonly T[], predicate: (elem: T) => boolean): boolean {
    for (const elem of elems) {
        if (!predicate(elem)) {
            return false;
        }
    }
    return true;
}

export function first<T>(elems: readonly T[], predicate: (elem: T) => boolean): T {
    for (const elem of elems) {
        if (predicate(elem)) {
            return elem;
        }
    }
    throw new Error("No elements match the predicate");
}

export function firstOrUndefined<T>(elems: readonly T[], predicate: (elem: T) => boolean): T | undefined {
    for (const elem of elems) {
        if (predicate(elem)) {
            return elem;
        }
    }
    return undefined;
}

export function enumerate<T>(elems: readonly T[]): {index: number, elem: T}[] {
    return zip(range(elems.length), elems, (i, e) => ({index: i, elem: e}));
}

export function groupBy<TElem>(elems: readonly TElem[], func: (elem: TElem) => string): { [group: string]: TElem[] } {
    const ret: { [group: string]: TElem[] } = {};

    for (const elem of elems) {
        const key = func(elem);
        ret[key] ? ret[key].push(elem) : (ret[key] = [elem]);
    }

    return ret;
}

export function none<T>(elems: readonly T[], predicate: (elem: T) => boolean): boolean {
    return !any(elems, predicate);
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

export function valueMap<TIn, TOut>(obj: Readonly<{[key: string]: TIn}>, transform: (elem: TIn) => TOut): { [key: string]: TOut } {
    const ret: { [key: string]: TOut } = {};

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        ret[key] = transform(obj[key]);
    }

    return ret;
}

export function zip<T1, T2, TRet>(arr1: readonly T1[], arr2: readonly T2[], func: (e1: T1, e2: T2) => TRet): TRet[] {
    const res: TRet[] = [];
    const max = Math.min(arr1.length, arr2.length);

    for (let i = 0; i < max; ++i) {
        res.push(func(arr1[i], arr2[i]));
    }
    return res;
}