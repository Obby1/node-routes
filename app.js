const express = require("express");
const fs = require('fs');
const ExpressError = require("./expressError");
const app = express();


  

function calculateMean(nums) {
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / nums.length;
    return mean;
  }
  

function calculateMedian(nums) {
    const sorted = nums.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      return sorted[middle];
    }
  }
  

function calculateMode(nums) {
    const freqMap = {};
    let mode = [];
    let maxFreq = 0;
    for (const num of nums) {
      if (freqMap[num]) {
        freqMap[num]++;
      } else {
        freqMap[num] = 1;
      }
      if (freqMap[num] > maxFreq) {
        maxFreq = freqMap[num];
        mode = [num];
      } else if (freqMap[num] === maxFreq) {
        mode.push(num);
      }
    }
    return mode;
  }



app.get("/mean", function (req, res, next) {
    try {
      const nums = req.query.nums;
      if (!nums) {
        throw new ExpressError("nums are required", 400);
      }
      const numbers = nums.split(",").map((num) => {
        const parsedNum = parseFloat(num);
        if (isNaN(parsedNum)) {
          throw new ExpressError(`${num} is not a number`, 400);
        }
        return parsedNum;
      });
      const mean = calculateMean(numbers);
      // Check if 'save' query key is set to true
      if (req.query.save === "true") {
        const data = {
          operation: "mean",
          result: mean,
          timestamp: new Date().toISOString(),
        };
  
        fs.appendFile(
          `results-${new Date().toISOString()}.json`,
          JSON.stringify(data) + "\n",
          (err) => {
            if (err) {
              throw new ExpressError("Error writing to file", 500);
            }
            console.log("File written successfully");
          }
        );
      }
  
      return res.send({ mean });
    } catch (e) {
      return next(e);
    }
  });
  
  

app.get("/median", function (req, res, next) {
    try {
      const nums = req.query.nums;
      if (!nums) {
        throw new ExpressError("nums are required", 400);
      }
      const numbers = nums.split(",").map((num) => {
        const parsedNum = parseFloat(num);
        if (isNaN(parsedNum)) {
          throw new ExpressError(`${num} is not a number`, 400);
        }
        return parsedNum;
      });
      const median = calculateMedian(numbers);
      // Check if 'save' query key is set to true
      if (req.query.save === "true") {
        const data = {
          operation: "median",
          result: median,
          timestamp: new Date().toISOString(),
        };
  
        fs.writeFile(
          `results-${new Date().toISOString()}.json`,
          JSON.stringify(data),
          (err) => {
            if (err) {
              throw new ExpressError("Error writing to file", 500);
            }
            console.log("File written successfully");
          }
        );
      }
  
      return res.send({ median });
    } catch (e) {
      return next(e);
    }
  });
  

app.get("/mode", function (req, res, next) {
    try {
      const nums = req.query.nums;
      if (!nums) {
        throw new ExpressError("nums are required", 400);
      }
      const numbers = nums.split(",").map((num) => {
        const parsedNum = parseFloat(num);
        if (isNaN(parsedNum)) {
          throw new ExpressError(`${num} is not a number`, 400);
        }
        return parsedNum;
      });
      const mode = calculateMode(numbers);
      const result = { mode };
      // Check if 'save' query key is set to true
      if (req.query.save === "true") {
        result.timestamp = new Date().toISOString();
  
        fs.appendFile(
          `results-${new Date().toISOString()}.json`,
          JSON.stringify(result) + "\n",
          (err) => {
            if (err) {
              throw new ExpressError("Error writing to file", 500);
            }
            console.log("File written successfully");
          }
        );
      }
  
      return res.send(result);
    } catch (e) {
      return next(e);
    }
  });

// Route for calculating the mean, median, and mode
app.get("/all", function (req, res, next) {
    try {
      const nums = req.query.nums;
      if (!nums) {
        throw new ExpressError("nums are required", 400);
      }
      const numbers = nums.split(",").map((num) => {
        const parsedNum = parseFloat(num);
        if (isNaN(parsedNum)) {
          throw new ExpressError(`${num} is not a number`, 400);
        }
        return parsedNum;
      });
      const mean = calculateMean(numbers);
      const median = calculateMedian(numbers);
      const mode = calculateMode(numbers);
      const response = {
        operation: "all",
        mean,
        median,
        mode,
        timestamp: new Date().toISOString(),
      };
      // Check if 'save' query key is set to true
      if (req.query.save === "true") {
        fs.appendFile(
          `results-${new Date().toISOString()}.json`,
          JSON.stringify(response) + "\n",
          (err) => {
            if (err) {
              throw new ExpressError("Error writing to file", 500);
            }
            console.log("File written successfully");
          }
        );
      }
      return res.send(response);
    } catch (e) {
      return next(e);
    }
  });
  

// save spot - why does below crash the app?
// how to run tests?

// If no other route matches, respond with a 404
app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404);
    next(e);
  });
  
// app.use((req, res, next) => {
//     const e = new ExpressError(`Page Not Found: ${req.originalUrl}`, 404);
//     next(e);
// });

// Error handler
app.use(function (err, req, res, next) {
    //Note the 4 parameters!
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;
  
    // set the status and alert the user
    return res.status(status).json({
      error: { message, status },
    });
  });


app.listen(3000, () => {
  console.log("Server running on port 3000");
});


