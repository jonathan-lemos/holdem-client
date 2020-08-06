import {deepEqual} from "./Misc";

type Enumerable<T> = Stream<T> | Iterator<T> | readonly T[];

function* arrayToIterator<T>(e: T[]): Iterator<T> {
    for (const elem of e) {
        yield elem;
    }
}

function toIterator<T>(e: Enumerable<T>): Iterator<T> {
    if (Array.isArray(e)) {
        return arrayToIterator(e);
    }
    if (e instanceof Stream) {
        return e.iterator;
    }
    return e as Iterator<T>;
}

export function s<T>(e: Enumerable<T>): Stream<T> {
    return new Stream(e);
}

export class Stream<T> {
    public readonly iterator: Iterator<T>;
    private done: boolean;

    public constructor(e: Enumerable<T>) {
        this.iterator = toIterator(e);
        this.done = false;
    }

    public any(predicate?: (elem: T) => boolean): boolean {
        if (predicate === undefined) {
            predicate = _ => true;
        }

        let result = this.iterator.next();
        while (!result.done) {
            if (predicate(result.value)) {
                return true;
            }
            result = this.iterator.next();
        }
        return false;
    }

    public argMax(transform: (elem: T) => number): T[] {
        let res = this.iterator.next();
        if (res.done) {
            throw new Error("Cannot call argMax() on an empty Stream");
        }

        let ret = [res.value];
        let max = transform(res.value);

        res = this.iterator.next();
        while (!res.done) {
            const cur = transform(res.value);
            if (cur > max) {
                max = cur;
                ret = [res.value];
            }
            else if (cur === max) {
                ret.push(res.value);
            }

            res = this.iterator.next();
        }

        return ret;
    }

    public argMin(transform: (elem: T) => number): T[] {
        let res = this.iterator.next();
        if (res.done) {
            throw new Error("Cannot call argMin() on an empty Stream");
        }

        let ret = [res.value];
        let min = transform(res.value);

        res = this.iterator.next();
        while (!res.done) {
            const cur = transform(res.value);
            if (cur < min) {
                min = cur;
                ret = [res.value];
            }
            else if (cur === min) {
                ret.push(res.value);
            }

            res = this.iterator.next();
        }

        return ret;
    }

    public all(predicate: (elem: T) => boolean): boolean {
        return this.none(e => !predicate(e));
    }

    public count(): number {
        let result = this.iterator.next();
        let no = 0;
        while (!result.done) {
            no++;
            result = this.iterator.next();
        }

        return no;
    }

    public distinct(equals?: (e1: T, e2: T) => boolean): Stream<T> {
        if (equals === undefined) {
            equals = (e1, e2) => deepEqual(e1, e2);
        }

        const eq: (e1: T, e2: T) => boolean = equals;

        return s((function* (it: Iterator<T>) {
            const seen: T[] = [];

            let res = it.next();
            while (!res.done) {
                const val = res.value;

                if (s(seen).none(e => eq(e, val))) {
                    yield res.value;
                    seen.push(res.value);
                }

                res = it.next();
            }
        })(this.iterator));
    }

    public filter(predicate: (elem: T) => boolean): Stream<T> {
        return s((function* (e: Iterator<T>) {
            let res = e.next();
            while (!res.done) {
                if (predicate(res.value)) {
                    yield res.value;
                }
                res = e.next();
            }
        })(this.iterator));
    }

    public first(predicate?: (elem: T) => boolean): T {
        let res = this.iterator.next();

        if (predicate === undefined) {
            predicate = _ => true;
        }

        while (!res.done) {
            if (predicate(res.value)) {
                return res.value;
            }
            res = this.iterator.next();
        }

        throw new Error("first(): No elements matched the predicate")
    }

    public firstOrUndefined(predicate: (elem: T) => boolean): T | undefined {
        let res = this.iterator.next();

        while (!res.done) {
            if (predicate(res.value)) {
                return res.value;
            }
            res = this.iterator.next();
        }

        return undefined;
    }

    public forEach(action: (elem: T) => void): void {
        let res = this.iterator.next();

        while (!res.done) {
            action(res.value);
            res = this.iterator.next();
        }
    }

    public enumerate(): Stream<{index: number, elem: T}> {
        return s((function* (it: Iterator<T>) {
            let res = it.next();
            let ctr = 0;

            while (!res.done) {
                yield {index: ctr, elem: res.value};
                ctr++;
                res = it.next();
            }
        })(this.iterator));
    }

    public groupBy(keyFunc: (elem: T) => string): { [key: string]: T[] } {
        const ret: { [key: string]: T[] } = {};

        this.forEach(e => {
            const key = keyFunc(e);
            ret[key] ? ret[key].push(e) : (ret[key] = [e]);
        });

        return ret;
    }

    public map<TRet>(transform: (elem: T) => TRet): Stream<TRet> {
        return s((function* (e: Iterator<T>) {
            let res = e.next();
            while (!res.done) {
                yield transform(res.value);
                res = e.next();
            }
        })(this.iterator));
    }

    public none(predicate: (elem: T) => boolean): boolean {
        return !this.any(predicate);
    }

    public reduce(transform: (accumulator: T, elem: T) => T): T {
        let res = this.iterator.next();
        if (res.done) {
            throw new Error("reduce() called on empty sequence");
        }

        let accum = res.value;
        res = this.iterator.next();
        while (!res.done) {
            accum = transform(accum, res.value);
            res = this.iterator.next();
        }
        return accum;
    }

    public reduceInit<TRet>(transform: (accumulator: TRet, elem: T) => TRet, initial: TRet): TRet {
        let res = this.iterator.next();
        while (!res.done) {
            initial = transform(initial, res.value);
            res = this.iterator.next();
        }
        return initial;
    }

    public skip(n: number): Stream<T> {
        return s(function* (it: Iterator<T>) {
            let res = it.next();
            for (let i = 0; i < n; ++i) {
                res = it.next();
            }

            while (!res.done) {
                yield res.value;
                res = it.next();
            }
        }(this.iterator))
    }

    public skipLast(n: number): Stream<T> {
        return s(function* (it: Iterator<T>) {
            const queue = [];
            let res = it.next();

            while (!res.done) {
                queue.push(res.value);
                if (queue.length > n) {
                    yield queue.shift() as T;
                }
                res = it.next();
            }
        }(this.iterator))
    }

    public toArray(): T[] {
        const ret: T[] = [];
        this.forEach(ret.push);
        return ret;
    }

    public toObject<TVal>(keyFunc: (elem: T) => string, valueFunc: (elem: T) => TVal): { [key: string]: TVal } {
        const ret: { [key: string]: TVal } = {};
        this.forEach(e => ret[keyFunc(e)] = valueFunc(e));
        return ret;
    }

    public zip<TOther, TRes>(other: Enumerable<TOther>, combiner: (e1: T, e2: TOther) => TRes): Stream<TRes> {
        return s((function* (it: Iterator<T>) {
            let so = s(other).iterator;

            let e1 = it.next();
            let e2 = so.next();

            while (!e1.done && !e2.done) {
                yield combiner(e1.value, e2.value);
                e1 = it.next();
                e2 = so.next();
            }
        })(this.iterator));
    }
}

export function range(n: number, stop?: number, step?: number): Stream<number> {
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
        return s((function* () {
            for (let i = n; i < stop; i += step) {
                yield i;
            }
        })());
    } else {
        return s((function* () {
            for (let i = n; i > stop; i += step) {
                yield i;
            }
        })());
    }
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
