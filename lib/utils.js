// Load modules


// Declare internals

var internals = {};


exports.arrayToObject = function (source) {

    var obj = {};
    for (var i = 0, il = source.length; i < il; ++i) {
        if (typeof source[i] !== 'undefined') {

            obj[i] = source[i];
        }
    }

    return obj;
};


exports.merge = function (target, source) {

    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        }
        else {
            target[source] = true;
        }

        return target;
    }

    if (typeof target !== 'object') {
        target = [target].concat(source);
        return target;
    }

    if (Array.isArray(target) &&
        !Array.isArray(source)) {

        target = exports.arrayToObject(target);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var value = source[key];

        if (!target[key]) {
            target[key] = value;
        }
        else {
            target[key] = exports.merge(target[key], value);
        }
    }

    return target;
};

var charByWindows1252Hex = {
    80: '€',
    82: '‚',
    83: 'ƒ',
    84: '„',
    85: '…',
    86: '†',
    87: '‡',
    88: 'ˆ',
    89: '‰',
    '8a': 'Š',
    '8b': '‹',
    '8c': 'Œ',
    '8e': 'Ž',
    91: '‘',
    92: '’',
    93: '“',
    94: '”',
    95: '•',
    96: '–',
    97: '—',
    98: '˜',
    99: '™',
    '9a': 'š',
    '9b': '›',
    '9c': 'œ',
    '9e': 'ž',
    '9f': 'Ÿ'
};

exports.decode = function (str, charset, suppressWindows1252) {
    str = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        if (!suppressWindows1252) {
            str = str.replace(/%([89][0-9a-f])/ig, function ($0, hexChar) {
                return charByWindows1252Hex[hexChar.toLowerCase()] || $0;
            });
        }
        return unescape(str); // Cannot throw
    }
    // utf-8
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
};


exports.compact = function (obj, refs) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0, il = obj.length; i < il; ++i) {
            if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};


exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};


exports.isBuffer = function (obj) {

    if (obj === null ||
        typeof obj === 'undefined') {

        return false;
    }

    return !!(obj.constructor &&
        obj.constructor.isBuffer &&
        obj.constructor.isBuffer(obj));
};
