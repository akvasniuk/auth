const {authHelper, userHelper} = require("../helpers");
const {OAuth} = require("../database");


const generateAuthResponse = async (userId, user) => {
    const tokenPair = authHelper.generateTokenPair();

    await OAuth.updateOne({user: userId}, {...tokenPair});

    const normalizedUser = userHelper.userNormalizator(user);

    return {...tokenPair, user: normalizedUser}
}

module.exports = {
    generateAuthResponse
}