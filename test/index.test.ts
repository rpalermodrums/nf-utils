import { describe, it, expect } from 'bun:test';

import { pick, pickBy, isEqual, escapeRegExp, uniq, uniqBy, uniqId, has, omit, last, debounce, xor, cloneDeep } from '../src/utils';

describe('pick', () => {
    it('should pick specified properties from an object', () => {
        const object = { 'a': 1, 'b': '2', 'c': 3 };
        expect(pick(object, ['a', 'c'])).toEqual({ 'a': 1, 'c': 3 });
    });

    it('should ignore non-existent properties', () => {
        const object = { 'a': 1, 'b': '2' };
        expect(pick(object, ['a', 'c'])).toEqual({ 'a': 1 });
    });

    it('should return an empty object if no properties match', () => {
        expect(pick({ 'a': 1, 'b': '2' }, ['c', 'd'])).toEqual({});
    });

    it('should handle an empty object', () => {
        expect(pick({}, ['a', 'b'])).toEqual({});
    });
});

describe('pickBy', () => {
    it('should pick properties that match the predicate', () => {
        const object = { 'a': 1, 'b': '2', 'c': 3 };
        expect(pickBy(object, x => typeof x === 'number')).toEqual({ 'a': 1, 'c': 3 });
    });

    it('should return an empty object if no properties match the predicate', () => {
        expect(pickBy({ 'a': '1', 'b': '2', 'c': '3' }, x => typeof x === 'number')).toEqual({});
    });

    it('should handle an empty object', () => {
        expect(pickBy({}, x => x)).toEqual({});
    });
});

describe('escapeRegExp', () => {
    it('should correctly escape special characters including hyphens in character sets', () => {
        expect(escapeRegExp('^[a-z]*$^')).toEqual('\\^\\[a-z\\]\\*\\$\\^');
    });

    it('should return the same string if no special characters are present', () => {
        expect(escapeRegExp('abc')).toEqual('abc');
    });

    it('should escape multiple instances of special characters', () => {
        expect(escapeRegExp('^a*b+c?d{e}f|g[h]i\\j')).toEqual('\\^a\\*b\\+c\\?d\\{e\\}f\\|g\\[h\\]i\\\\j');
    });
});

describe('uniq', () => {
    it('should remove duplicate numbers from an array', () => {
        expect(uniq([1, 2, 1, 3])).toEqual([1, 2, 3]);
    });

    it('should remove duplicate strings from an array', () => {
        expect(uniq(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });

    it('should handle an empty array', () => {
        expect(uniq([])).toEqual([]);
    });

    it('should handle an array of objects', () => {
        const obj = {};
        expect(uniq([obj, obj])).toEqual([obj]);
    });
});

describe('uniqBy', () => {
    it('should remove duplicates based on iteratee function', () => {
        const array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }];
        expect(uniqBy(array, o => o.x)).toEqual([{ 'x': 1 }, { 'x': 2 }]);
    });

    it('should handle an array with all unique values based on iteratee', () => {
        expect(uniqBy([{'x': 1}, {'x': 2}], o => o.x)).toEqual([{'x': 1}, {'x': 2}]);
    });

    it('should handle an empty array', () => {
        expect(uniqBy([], o => o.x)).toEqual([]);
    });
});

describe('uniqId', () => {
    it('should generate unique IDs', () => {
        const id1 = uniqId();
        const id2 = uniqId();
        expect(id1).not.toEqual(id2);
    });

    it('should prepend provided prefix', () => {
        expect(uniqId('test_')).toMatch(/^test_\d+$/);
    });

    it('should generate incrementing IDs', () => {
        const id1 = parseInt(uniqId(), 10);
        const id2 = parseInt(uniqId(), 10);
        expect(id2).toBeGreaterThan(id1);
    });
});

describe('has', () => {
    it('should return true if path exists', () => {
        const object = { 'a': { 'b': { 'c': 3 } } };
        expect(has(object, 'a.b.c')).toBe(true);
    });

    it('should return false if path does not exist', () => {
        const object = { 'a': { 'b': { 'c': 3 } } };
        expect(has(object, 'a.b.d')).toBe(false);
    });

    it('should return false for an empty object', () => {
        expect(has({}, 'a')).toBe(false);
    });

    it('should handle nested arrays', () => {
        const object = { 'a': [{ 'b': { 'c': 3 } }] };
        expect(has(object, 'a[0].b.c')).toBe(true);
    });
});

describe('omit', () => {
    it('should omit specified properties from an object', () => {
        const object = { 'a': 1, 'b': '2', 'c': 3 };
        expect(omit(object, ['a', 'c'])).toEqual({ 'b': '2' });
    });

    it('should return the same object if no properties are omitted', () => {
        const object = { 'a': 1, 'b': 2 };
        expect(omit(object, ['c'])).toEqual(object);
    });

    it('should handle an empty object', () => {
        expect(omit({}, ['a', 'b'])).toEqual({});
    });
});

describe('last', () => {
    it('should return the last element of an array', () => {
        expect(last([1, 2, 3, 4])).toBe(4);
    });

    it('should return undefined for an empty array', () => {
        expect(last([])).toBeUndefined();
    });

    it('should return the only element in a single-element array', () => {
        expect(last([1])).toBe(1);
    });
});

describe('debounce', () => {
    it('should only execute the function once after the wait time', async () => {
        let counter = 0;
        const debouncedFn = debounce(() => counter++, 50);
        debouncedFn();
        debouncedFn();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(counter).toBe(1);
    });

    it('should not execute the function immediately if leading is not set', async () => {
        let counter = 0;
        const debouncedFn = debounce(() => counter++, 50);
        debouncedFn();
        expect(counter).toBe(0);
        await new Promise(resolve => setTimeout(resolve, 100));
    });
});

describe('xor', () => {
    it('should return elements present in only one of the arrays', () => {
        expect(xor([2, 1], [2, 3])).toEqual([1, 3]);
    });

    it('should return an empty array if all elements are present in both arrays', () => {
        expect(xor([1, 2], [1, 2])).toEqual([]);
    });
});

describe('cloneDeep', () => {
    it('should deeply clone an object', () => {
        const obj = { a: { b: { c: 1 } } };
        const clonedObj = cloneDeep(obj);
        expect(clonedObj).toEqual(obj);
        expect(clonedObj).not.toBe(obj);
    });

    it('should deeply clone an array', () => {
        const arr = [[1], [2], [3]];
        const clonedArr = cloneDeep(arr);
        expect(clonedArr).toEqual(arr);
        expect(clonedArr).not.toBe(arr);
    });

    it('should handle primitive types', () => {
        expect(cloneDeep(1)).toBe(1);
        expect(cloneDeep('abc')).toBe('abc');
    });

    it('should handle null and undefined', () => {
        expect(cloneDeep(null)).toBeNull();
        expect(cloneDeep(undefined)).toBeUndefined();
    });
});

