export function deepEqual(a: any, b: any) {
    if (typeof a !== typeof b) {
        return false;
    }

    if (a === b) {
        return true;
    }

    if (typeof a === "number" && isNaN(a) && isNaN(b)) {
        return true;
    }

    if (typeof a !== "object") {
        return false;
    }

    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }

    for (const key in a) {
        if (!a.hasOwnProperty(key)) {
            continue;
        }

        if (!b.hasOwnProperty(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
}

export function round(n: number, precision: number) {
    return Math.round(n / precision) * precision;
}