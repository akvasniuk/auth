module.exports = {
  userNormalizator: (userToNormalize = {}) => {
    const fieldsToRemove = [
      'password',
      'emailToken',
    ];

    fieldsToRemove.forEach((filed) => {
      delete userToNormalize[filed];
    });

    return userToNormalize;
  }
};
