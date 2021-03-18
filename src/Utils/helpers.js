export const compose = (f, g) => x => f(g(x));
export const pipe = (f, g) => x => g(f(x));
export const isArrayB = a => Array.isArray(a);
// export const isObjectB = a => a.constructor.name === 'Object'
export const isObjectB = a => a.constructor.name !== 'Number' && a.constructor.name !== 'String' && a.constructor.name !== 'Array'
export const arrayOrObject = (f1, f2) => collection => {
    if(collection){
        if(isArrayB(collection)) {
            return f1(collection)
        } else 
        if(isObjectB(collection)) {
            return f2(collection)
        } 
    }
}    
export const lenghtOnObject = collection => Object.keys(collection).length
export const lengthOnArray = collection => collection.length
export const length = arrayOrObject(lengthOnArray, lenghtOnObject)
export const isArrayEmptyB = collection => collection.length === 0; 
export const isObjectEmptyB = collection => Object.keys(collection).length === 0;
export const isUndefined = a => a === undefined
// export const arrayOrObjectB = (f1, f2) => arrayOrObject(f1, f2) ? true : false
export const empty = arrayOrObject(isArrayEmptyB, isObjectEmptyB) 
export const getKeys = collection => collection ? Object.keys(collection) : []
export const firstArrayItem = collection => collection[0] 
export const firstObjectsKey = collection => getKeys(collection)[0]
export const firstAndRestOnArray = collection => {
    const [first, ...rest] = collection
    return [first, rest]
}
export const firstAndRestOnObject = collection => {
    const key = firstObjectsKey(collection)
    const {[key]: item, ...rest} = collection;
    return [[key,item], rest]
}

export const firstObjectItem = collection => {
    const keys = getKeys(collection)
    const key = keys[0];
    return [key, collection[key]];
} 
export const firstAndRest = arrayOrObject(firstAndRestOnArray, firstAndRestOnObject)

export const first = arrayOrObject(firstArrayItem, firstObjectItem) // ???

export const last  = collection => collection[collection.length-1];

export const restOnArray = collection => collection.slice(1);
export const restOnObject = collection => firstAndRest(collection)[1] // ???
export const rest = collection => collection.slice(1);

export const consOnArray  = (item, collection) => [item, ...collection];
export const consOnObject = (item, collection) => ({...collection, ...item})
export const cons = arrayOrObject(consOnArray, consOnObject) 

export const objToArray = obj => Object.keys(obj).map(d=>obj[d])
export const copyNodes = (nodes) => {
    if(empty(nodes)) return {}
    
    const keys = getKeys(nodes)
    const key = keys[0];
    const {[key]: item, ...rest} = nodes;

    return {[key]: item, ...copyNodes(rest) }
}

export const updateNodes = (nodes, update) => {
    if(empty(nodes)) return {}
    
    const keys = getKeys(nodes)
    const key = keys[0];
    const {[key]: item, ...rest} = nodes;
    return {[key]: {...item, ...update}, ...updateNodes(rest, update) }
}

export const map = (f, collection) => {
    if(empty(collection)){
        return []
    } 

    const firstItem = first(collection);
    const result = f(firstItem);

    return cons( result, map( f, rest(collection) ) )
    
} 

export const filter = (f, collection) => {
    if(empty(collection)) return[]

    const firstItem = first(collection);
    
    if(f(firstItem)) {
        return  cons( firstItem, filter(f, rest(collection)) )
    } else {
        return filter(f, rest(collection))
    }
}

// export const reduce = (f, collection, val) => {
 
//     if(empty(collection)) return val;

//     const item = first(collection);

//     if( typeof val === "undefined") return reduce(f, rest(collection), item)
    
//     const result = f(val, item);
//     return reduce(f, rest(collection), result);

// }
export const reduce = (...args) => {
    const [f, collection, val] = args
 
    if(empty(collection)) return val;

    const item = first(collection);

    if( args.length < 3) return reduce(f, rest(collection), item)
    
    const result = f(val, item);
    return reduce(f, rest(collection), result);

}

export const plus = (...args) => {
    return reduce((acc, curr) => acc + curr, args, 0);
}

export const map_reduced = (f, collection) => {
    return reduce((acc, curr) => {
        return [ ...acc, f(curr) ]
    }, collection, []);
}

export const filter_reduced = (f, collection) => {
    return reduce( (acc, curr) => {
        if(f(curr)){
            return [...acc, curr];
        } else {
            return acc;
        }
    }, collection, []);
}

const zero = n => n === 0;
const dec = n => n - 1;

const repeat = (a, b) => {

    if(zero(a)) return [];

    return cons( b, repeat(dec(a), b) );

}

const times = (a, b) => {
    return reduce(plus, repeat(a, b), 0);
}

const iterate = (f, x, n) => {
    if(zero(n)) return []

    return cons(x, iterate(f, f(x), dec(n)));
}

export const identity = x => x;

export const repeat_iterated = (a, b) => {

    return iterate(identity, b, a)

}

const reverse = collection => reduce((acc, curr) => [curr, ...acc], collection, []);

const count = collection => collection.length;

const inc = n => n + 1;

const mapMany = (f, ...collections) => {
   if(empty(first(collections))) return [];

   const vals = map(first, collections);
   const result = f(...vals);

   return cons(result, mapMany(f, ...map(rest, collections)));
}

export const toDecimal = (base, digits) => {
    const reverseDigits = reverse(digits);
    const implicitValues = map(x=>Math.pow(base, x), iterate(inc, 0, count(reverseDigits)) );

    return reduce(plus, mapMany(times, reverseDigits, implicitValues))
}

export const toDecimalRecursive = (
    base, 
    digits, 
    result = 0, 
    exp = dec(count(digits))
    ) => {

        if(empty(digits)) return result;

        const digit = first(digits);
        const new_result = result + digit * Math.pow(base, exp);

        return toDecimalRecursive(base, rest(digits), new_result, dec(exp))

}

const isColl = x => Array.isArray(x);

const thread = type => {
    return (val, ...exprs) => {
        return reduce((acc, curr) => {
            if(isColl(curr)) {
                const [f, ...args] = curr;
                
                if(type === 'first') return f(acc, ...args);

                return f(...args, acc);    
            } 
    
            return curr(acc);
    
        }, exprs, val)
    }
}

export const _  = thread('first')
export const __ = thread('last')

const get = (item, key) => item[key]

const assoc = (item, key, val) => {
    if(isColl(item)) {
        return [...item, {[key]: val}]
    }
    return {...item, [key]: val }
}

export const update = (item, key, f, ...args) => {
    return assoc(item, key, f(get(item, key), ...args));
}

export const runtime = (f) => {
    const start = Date.now()

    const result = f()

    const end = Date.now()

    return {result, time: end - start}
}