/**
 * pseries - a JavaScript micro-library for dealing with asynchronous flow control
 * https://github.com/rBurgett/pseries
 *
 * Copyright (c) 2015 by Ryan Burgett.
 * Licensed under Apache License Version 2.0
 * https://github.com/rBurgett/pseries/blob/master/LICENSE
 */

var pseries = function(funcArr) {
    'use strict';

    return new Promise(function(resolve, reject) {

        if(!Array.isArray(funcArr)) {
            reject('You must pass in an array!');
        }

        var len = funcArr.length;

        function* myGen(funcs) {
            var cnt = 0;
            while (cnt < len) {
                yield funcs[cnt];
                cnt++;
            }
        }

        var resultsArr = [];

        var genFunc = myGen(funcArr);		//initialize the generator

        var run = function() {
            var genRes = genFunc.next();		//proceed to the first yield
            if(!genRes.done) {
                if(typeof genRes.value === 'function') {	//make sure the value returned is a function
                    var runFunc = genRes.value();		//run the yielded function
                    if(typeof runFunc === 'object' &&		//make sure the object returned is a Promise
                       runFunc.then instanceof Function &&
                       runFunc.catch instanceof Function) {
                        runFunc.then(function(res) {
                            resultsArr.push(res || '');		//add the response to the results array
                            run();		//recursively call run() to get & process next function from the generator
                        }).catch(function(err) {
                            reject(err);
                        });
                    } else {
                        reject('Each function must return a promise!');
                    }
                } else {
                    reject('You must pass in a function!');
                }

            } else {
                resolve(resultsArr);
            }
        };
        run();
    });
};

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
