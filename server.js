require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./winston');
const promClient = require('./prometheus');

const app = express();

// Create a custom stream object with a write function
logger.stream = {
    write(message, encoding) {
        logger.info(message);
    },
};

app.use(morgan('tiny', { stream: logger.stream } ));

console.log = (...args) => logger.info.call(logger, ...args);
console.info = (...args) => logger.info.call(logger, ...args);
console.warn = (...args) => logger.warn.call(logger, ...args);
console.error = (...args) => logger.error.call(logger, ...args);
console.debug = (...args) => logger.debug.call(logger, ...args);

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
})

app.get('/fast', (req, res) => {
    console.log(`You've hit the GET /fast`);
    console.debug({ name: "Shobhan" })
    const axios=require("axios")
    try{
        asdasd
    }catch(e){
        console.log("error is ",e)
    }
    // axios.get("google.com").catch((err)=>{
    //     console.error('err', err);
    // })
    res.status(200).json({ "message": "ok" });
})

app.get('/slow', (req, res) => {
    console.log(`You've hit the GET /slow`);
    try {
        const value = Math.floor(Math.random() * 10);
        console.debug({ 
            name: value,
            surname: "Srivastava"
        });
        if(value === 7) {
            throw new Error('Error occured');
        }
        res.status(200).json({ "message": "ok" });
    } catch(error) {
        logger.error('error: ', error);
        res.status(500).json({ "message": error });
    }
})

app.listen(9999, () => {
    console.log('Server running on PORT 9999');
})