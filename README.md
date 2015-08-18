#pseries
pseries is a JavaScript micro-library for dealing with asynchronous flow control. You pass in an array of promise-returning functions and it executes those in series then returns a promise.

##Installation
`npm install psync`
`bower install psync`

##Use Cases
In both the browser and Node, you often have to call functions then wait for a response. Traditional callbacks work. Promises work better. But when you have a series of functions that are asynchronous, it can get very messy very fast. In Node, for example, if you do any asynchronous file operations, you often end up with a series of functions that need to happen one after the other. Nesting them in callbacks or promises is not the right answer. **pseries** allows you to execute a list functions in order, one after the other, with one final response oulet and one single outlet for handling errors.

##Examples
```
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
```
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
**This is much cleaner than the following, traditional way of handling asynchronous functions.**
```

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
