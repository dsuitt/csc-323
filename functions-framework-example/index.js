const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');


functions.http('squareMyNumber', async (req, res) => {
    console.log(req.body);
    console.log(req.headers)
    res.send(`Your number squared is ${req.body.number**2}`);
});