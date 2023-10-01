const {Schema, model} = require('mongoose');
const {dataBaseTablesEnum} = require('../constants');

const userLimitSchema = new Schema({
    userIp: String,
    endpoint: String,
    requestCount: Number,
    lastRequestTime: Date,
    isBanned: {
        type: Boolean,
        default: false
    },
    period: Date
}, {timestamps: true});

module.exports = model(dataBaseTablesEnum.USER_LIMIT, userLimitSchema);
