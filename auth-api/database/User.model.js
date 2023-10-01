const { Schema, model } = require('mongoose');

const { dataBaseTablesEnum } = require('../constants/index');

const userSchema = new Schema({
  avatar: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 40
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  isUserActivated: {
    type: Boolean,
    default: false
  },
  isEnable2FA: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = model(dataBaseTablesEnum.USER, userSchema);
