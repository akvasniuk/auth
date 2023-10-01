const { User } = require('../database');

module.exports = {
  getAllUsers: () => User.find({ }),

  insertUser: (user) => User.create(user),

  findUser: (userParam) => User.findOne({ ...userParam }),

  updateUser: (user, updatedUser) => User.updateOne(user, updatedUser),

  deleteUser: (user) => Object.assign(user, { deleted: true, deletedAt: Date.now() }),

  findUserByEmail: (email) => User.findOne({ email })
};
