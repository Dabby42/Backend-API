var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const helpers = require('./../helpers/helper');
const {unauthorized, forbidden} = helpers;
/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * Checks that the header has a valid token
 */
function verifyToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization){
      return forbidden(res, 'No token provided.');
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
    if (err)
    return unauthorized(res, 'Failed to authenticate token.');
    // if everything good, save to request for use in other routes
    // req.body.userId = decoded._id;
    const user = await User.findById(userId);
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
