type KeyedObject = {[key: string]: unknown};

export function pick(object: KeyedObject, paths: string[]) {
    const result: KeyedObject = {};
    paths.forEach(path => {
        if (object.hasOwnProperty(path)) {
            result[path] = object[path];
        }
    });
    return result;
}

export function pickBy(object: KeyedObject, predicate: (x: unknown, key: string) => unknown) {
    const result: {[key: string]: unknown} = {};
    for (const [key, value] of Object.entries(object)) {
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}

export function isEqual<T, U>(value: T, other: U): boolean {
    if ((value as unknown) === (other as unknown)) return true;
    if (typeof value !== 'object' || typeof other !== 'object' || value === null || other === null) return false;

    const keysValue = Object.keys(value as any);
    const keysOther = Object.keys(other as any);

    if (keysValue.length !== keysOther.length) return false;

    for (const key of keysValue) {
        if (!isEqual((value as any)[key], (other as any)[key])) return false;
    }

    return true;
}

export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export function uniq<T>(array: T[]): T[] {
    return [...new Set(array)];
}

export function uniqBy<T, K>(array: T[], iteratee: (item: T) => K): T[] {
    const seen = new Map<K, boolean>();
    return array.filter(item => {
        const computed = iteratee(item);
        return !seen.has(computed) && seen.set(computed, true);
    });
}

let idCounter = 0;
export function uniqId(prefix: string = ''): string {
    return `${prefix}${++idCounter}`;
}

export function has(object: KeyedObject, path: string): boolean {
    if (!object || typeof object !== 'object') return false;

    const keys = path.replace(/\[(\w+)]/g, '.$1').split('.');
    let current: unknown = object;

    for (const key of keys) {
        if (typeof current !== 'object' || current === null || !(key in current)) return false;
        current = (current as KeyedObject)[key];
    }

    return true;
}

export function omit(object: KeyedObject, paths: string[]): KeyedObject {
    const result = { ...object };
    paths.forEach(path => delete result[path]);
    return result;
}

export function last<T>(array: T[]): T | undefined {
    return array[array.length - 1];
}

export interface DebounceOptions {
    leading?: boolean;
}

export function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number,
    options: DebounceOptions = {}
): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
        const later = () => {
            timeoutId = null;
            if (!options.leading) func.apply(this, args);
        };
        const callNow = options.leading && !timeoutId;
        clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
        timeoutId = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

export function xor<T>(...arrays: T[][]): T[] {
    const combined = arrays.flat();
    return combined.filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item));
}

export function cloneDeep<T>(value: T): T {
    if (typeof value !== 'object' || value === null) return value;

    let clone: any = Array.isArray(value) ? [] : {};
    Object.keys(value).forEach(key => {
        clone[key] = cloneDeep((value as any)[key]);
    });

    return clone as T;
}
