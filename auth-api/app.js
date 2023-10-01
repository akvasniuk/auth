const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require("cors");

const {constants} = require('./constants');
const {userRouter, authRouter} = require('./routes');
const {errorHandlerHelper: {_handleErrors, _notFoundHandler}, connectToDB: {_mongooseConnector}} = require('./helpers');
const {authMiddleware} = require("./middlewars");

const app = express();

_mongooseConnector();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({origin: "*"}));
app.use(authMiddleware.checkRequestLimit);

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use(_handleErrors);
app.use('*', _notFoundHandler);

app.listen(constants.PORT, () => {
    console.log(`App listen ${constants.PORT}`);
});
