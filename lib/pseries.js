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

        var runFuncs = function runFuncs(funcArr) {
            var i = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var resArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];


            funcArr[i]().then(function (res) {
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