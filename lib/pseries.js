'use strict';

/**
 * pseries - a JavaScript micro-library for dealing with asynchronous flow control
 * https://github.com/rBurgett/pseries
 *
 * Copyright (c) 2015 by Ryan Burgett.
 * Licensed under Apache License Version 2.0
 * https://github.com/rBurgett/pseries/blob/master/LICENSE
 */

var pseries = function pseries(arr) {
    return new Promise(function (resolve, reject) {

        var runFuncs = function runFuncs(funcArr, i, resArray) {

            i = i || 0;
            resArray = resArray || [];

            funcArr[i]().then(function (res) {
                resArray.push(res);
                if (i === funcArr.length - 1) {
                    resolve(resArray);
                } else {
                    runFuncs(funcArr, i + 1, resArray);
                }
            }, function (err) {
                reject(err);
            });
        };

        runFuncs(arr);
    });
};

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = pseries;
    }
    exports.pseries = pseries;
} else if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
        return pseries;
    });
} else {
    global.pseries = pseries;
}