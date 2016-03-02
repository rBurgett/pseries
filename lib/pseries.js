'use strict';

/**
 * pseries - a JavaScript micro-library for handling asynchronous flow control
 * https://github.com/rBurgett/pseries
 *
 * Copyright (c) 2016 by Ryan Burgett.
 * Licensed under Apache License Version 2.0
 * https://github.com/rBurgett/pseries/blob/master/LICENSE
 **/

var pseries = function pseries(arr) {
    return new Promise(function (resolve, reject) {

        if (!Array.isArray(arr) || arr.length === 0) {
            reject(new Error('You must pass in an array of promise-returning functions.'));
        }

        var runFuncs = function runFuncs(funcArr) {
            var i = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var resArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];


            var func = funcArr[i];

            if (typeof func !== 'function') {
                reject(new Error('The passed-in array must only contain promise-returning functions.'));
            }

            func().then(function (res) {
                var newResArray = resArray.concat([res]);
                if (i === funcArr.length - 1) {
                    resolve(newResArray);
                } else {
                    runFuncs(funcArr, i + 1, newResArray);
                }
            }, function (err) {
                return reject(err);
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