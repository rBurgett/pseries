#pseries
pseries is a JavaScript micro-library for easily executing asynchronous functions in series. You pass in an array of promise-returning functions and it executes them in series then returns a promise.

##Installation
```
npm install pseries
```
(if using version 1.x.x, requires `--harmony_generators` flag to be set)

##Benefits
* Execute a list of functions in order
* Execute one after the other
* One final response outlet (an array of responses)
* **One single outlet for handling errors**
* Completely asynchronous and non-blocking

##Example using ES2015
```javascript
var myFuncs = [   // an example array of promise-returning functions

  //run this function first
  
  () => new Promise((resolve, reject) => {
  
    someAsyncFunc((err, res) => {
      if(err) reject(err);
      else resolve(res);
    });
    
  }),
  
  //then run this function...
  
  () => new Promise((resolve, reject) => {
  
    anotherAsyncFunc((err, res) => {
      if(err) reject(err);
      else resolve(res);
    });
    
  }),

];

// pass that array into pseries and let it do the work

pseries(myFuncs).then(
  res => {
    // do something with the response (an array of the responses from each of the functions)
  },
  err => {
    // handle any error
  }
);
```

##Examples
```javascript
var myFuncs = [   // an example array of promise-returning functions

  function() {    //run this function first
    return new Promise(function(resolve, reject) {
      someAsyncFunc(function(err, res) {
        if(err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },

  function() {    //then run this function...
    return new Promise(function(resolve, reject) {
      anotherAsyncFunc(function(err, res) {
        if(err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

];

// pass that array into pseries and let it do the work

pseries(myFuncs).then(
  function(res) {
    // do something with the response (an array of the responses from each of the functions)
  },
  function(err) {
    // handle any error
  }
);
```
or
```javascript
pseries([
  function() {
    return new Promise(function(resolve, reject) {
      someAsyncFunc(function(err, res) {
        if(err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  function() {
    return new Promise(function(resolve, reject) {
      anotherAsyncFunc(function(err, res) {
        if(err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
]).then(
  function(res) {
    // do something with the response
  },
  function(err) {
    // handle any error
  }
);
```
You can also nest pseries calls.
```javascript
pseries([
  firstFunction,
  function() {
    return new Promise(function(resolve, reject) {
      pseries([
        someFunction,
        anotherFunction
      ]).then(
        function(res) {
          resolve(res);
        },
        function(err) {
          reject(err);
        }
      );
    });
  },
  thirdFunction
]).then(
  function(res) {
    // do something with the response
  },
  function(err) {
    // handle any error
  }
);
```
**This is much cleaner than the following, traditional way of handling asynchronous functions.**
```javascript

// Don't do this!!!

var myFunc = function() {
  someAsyncFunc(function(err, res) {
    if(err) {
      // handle error
    } else {
      // do something with response
      anotherAsyncFunc(function(err, res) {
        if(err) {
          // handle error... again!
        } else {
          //do something with response
          aThirdAsyncFunc(function(err, res) {
            if(err) {
              // handle error a third time!
            } else {
              //do something with response
              ...
            }
          });
        }
      });
    }
  });
};
```
##License
Apache License Version 2.0

Copyright (c) 2016 by Ryan Burgett.
