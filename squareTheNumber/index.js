const functions = require('@google-cloud/functions-framework');

functions.http('squareMyNumber', (req, res) => {
  res.send(`Your number cubed is ${req.body.number**3}`);
});