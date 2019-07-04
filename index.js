'use strict';
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.port || 2001;
const session = require('express-session');
const todo = require('./routes/todo.routes');

app.use(session({
    secret: "dev todo",
    resave: false,
    saveUninitialized: true,
    activeDuration: 5 * 60 * 1000
}));

// To prevent user from using back button after session expires
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use('/', todo);

// MongoDB config
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'mongo_todo';
const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
mongoose.connect(url, {useNewUrlParser: true})
.then(() => console.log('Connection Successful'))
.catch((err) => console.error(err));

app.listen(port, () => {
    console.log('Server running at '+port);
});