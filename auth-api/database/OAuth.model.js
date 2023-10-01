const { Schema, model } = require('mongoose');
const { dataBaseTablesEnum } = require('../constants');

const OAuthSchema = new Schema({
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  emailToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: dataBaseTablesEnum.USER
  },
  authToken: String
}, { timestamps: true });

OAuthSchema.pre('findOne', function() {
  this.populate('user');
});

module.exports = model(dataBaseTablesEnum.OAUTH, OAuthSchema);