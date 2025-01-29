const functions = require('@google-cloud/functions-framework'); //the functions framework module is a wrapper around the express module that allows us to run our functions locally for testing. There are some good tutorials on how to use the functions framework on the Google Cloud Functions documentation page.

functions.http('squareMyNumber', (req, res) => {
  res.send(`Your number squared is ${req.body.number**2}`);
});