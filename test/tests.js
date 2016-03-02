var pseries = require('../lib/pseries'),
    should = require('should');

describe('pseries', function() {

    var myTestAsyncFunc = function(funcName, timeout, callback) {
        setTimeout(function() {
            callback(null, funcName);
        }, timeout);
    };

    var funcArray = [
        function() {
            return new Promise(function(resolve, reject) {
                myTestAsyncFunc('func1', 10, function(err, res) {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        },
        function() {
            return new Promise(function(resolve, reject) {
                myTestAsyncFunc('func2', 100, function(err, res) {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        },
        function() {
            return new Promise(function(resolve, reject) {
                myTestAsyncFunc('func3', 10, function(err, res) {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        }
    ];

    it('should be a function', function() {
        pseries.should.be.Function();
    });
    it('should take any array of promise-returning functions and return a promise', function(done) {
        pseries(funcArray).then(function(res) {
            done();
        });
    });

    describe('the promise response', function() {

        var response;

        before(function(done) {
            pseries(funcArray).then(function(res) {
                response = res;
                done();
            });
        });

        it('should be an array', function() {
            response.should.be.Array();
        });
        it('should be in the same order as the functions passed in', function() {
            var isOrdered = true;
            for(var i = 1; i < response.length; i++) {
                if(response[i] <= response[i - 1]) {
                    isOrdered = false;
                    break;
                }
            }
            isOrdered.should.be.true();
        });
    });

    describe('any error', function() {

        it('should be caught by the final promise', function(done) {

            var badArray = [
                function() {
                    return new Promise(function(resolve, reject) {
                        myTestAsyncFunc('func1', 10, function(err, res) {
                            if(err) {
                                reject(err);
                            }
                            resolve(res);
                        });
                    });
                },
                function() {
                    return new Promise(function(resolve, reject) {
                        myTestAsyncFunc('func2', 10, function(err, res) {

                            reject('Error!');

                        });
                    });
                },
                function() {
                    return new Promise(function(resolve, reject) {
                        myTestAsyncFunc('func3', 10, function(err, res) {
                            if(err) {
                                reject(err);
                            }
                            resolve(res);
                        });
                    });
                }
            ];

            pseries(badArray).then(
                function(res) {
                    // done();
                },
                function(err) {
                    if(err) {
                        done();
                    }
                }
            );;

        });
    });

});
