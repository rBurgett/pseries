/**
 * pseries - a JavaScript micro-library for handling asynchronous flow control
 * https://github.com/rBurgett/pseries
 *
 * Copyright (c) 2016 by Ryan Burgett.
 * Licensed under Apache License Version 2.0
 * https://github.com/rBurgett/pseries/blob/master/LICENSE
 **/

const pseries = arr => {
    return new Promise((resolve, reject) => {

        if(!Array.isArray(arr) || arr.length === 0) {
            reject(new Error('You must pass in an array of promise-returning functions.'));
        }

        const runFuncs = (funcArr, i = 0, resArray = []) => {

            const func = funcArr[i];

            if(typeof func !== 'function') {
                reject(new Error('The passed-in array must only contain promise-returning functions.'));
            }

            func().then(
                res => {
                    const newResArray = resArray.concat([res]);
                    if(i === funcArr.length - 1) {
                        resolve(newResArray);
                    } else {
                        runFuncs(funcArr, i + 1, newResArray);
                    }
                },
                err => reject(err)
            )

        }

        runFuncs(arr);

    });
}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = pseries;
    }
    exports.pseries = pseries;
} else if (typeof define !== 'undefined' && define.amd) {
    define([], function () { return pseries; });
} else {
    global.pseries = pseries;
}
