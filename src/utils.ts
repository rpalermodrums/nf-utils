export function pick(object, paths) {
    const result = {};
    paths.forEach(path => {
        if (object.hasOwnProperty(path)) {
            result[path] = object[path];
        }
    });
    return result;
}

export function pickBy(object, predicate) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}

export function isEqual(value, other) {
    if (value === other) return true;
    if (typeof value !== 'object' || typeof other !== 'object' || value === null || other === null) return false;
    const keysValue = Object.keys(value);
    const keysOther = Object.keys(other);
    if (keysValue.length !== keysOther.length) return false;
    for (const key of keysValue) {
        if (!isEqual(value[key], other[key])) return false;
    }
    return true;
}

export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function uniq(array) {
    return [...new Set(array)];
}

export function uniqBy(array, iteratee) {
    const seen = new Map();
    return array.filter(item => {
        const computed = iteratee(item);
        return !seen.has(computed) && seen.set(computed, true);
    });
}

let idCounter = 0;
export function uniqId(prefix = '') {
    return `${prefix}${++idCounter}`;
}

export function has(object, path) {
    if (!object || typeof object !== 'object') return false;

    const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let current = object;

    for (const key of keys) {
        if (current[key] === undefined) return false;
        current = current[key];
    }

    return true;
}

export function omit(object, paths) {
    const result = { ...object };
    paths.forEach(path => delete result[path]);
    return result;
}

export function last(array) {
    return array[array.length - 1];
}

export function debounce(func, wait, options = {}) {
    let timeoutId;
    return function(...args) {
        const later = () => {
            timeoutId = null;
            if (!options.leading) func.apply(this, args);
        };
        const callNow = options.leading && !timeoutId;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

export function xor(...arrays) {
    const combined = arrays.flat();
    return combined.filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item));
}

export function cloneDeep(value) {
    if (typeof value !== 'object' || value === null) return value;
    let clone = Array.isArray(value) ? [] : {};
    for (const key in value) {
        clone[key] = cloneDeep(value[key]);
    }
    return clone;
}

