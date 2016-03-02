/**
 * pseries - a JavaScript micro-library for dealing with asynchronous flow control
 * https://github.com/rBurgett/pseries
 *
 * Copyright (c) 2015 by Ryan Burgett.
 * Licensed under Apache License Version 2.0
 * https://github.com/rBurgett/pseries/blob/master/LICENSE
 */

const pseries = arr => {
    return new Promise((resolve, reject) => {

        const runFuncs = (funcArr, i = 0, resArray = []) => {

            funcArr[i]().then(
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
