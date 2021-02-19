/** Middleware for authentification
 * inspired by : https://github.com/arkerone/express-security-example
 */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { UserModel } = require('../db/model.js');
require('dotenv').config();

const jwtVerify = promisify(jwt.verify);

const tokenType = process.env.ACCESS_TOKEN_TYPE;
const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
const tokenAlgo = process.env.ACCESS_TOKEN_ALGORITHM;

module.exports = async (req, res, next) => {
  try {
    if (req.baseUrl !== '/graphql') {
      // other route doesn't need authentification ?
      next();
    }
    const { headers } = req;

    if (!headers.authorization) {
      throw new Error('Missing Authorization header');
    }

    const parts = headers.authorization.split(' ');

    if (parts.length !== 2) {
      throw new Error(`Header format is Authorization: ${tokenType} token`);
    }

    const scheme = parts[0];
    const token = parts[1];

    /** Verify that tokenType correspond to request auth type (ex: bearer) */
    if (tokenType.toLowerCase() !== scheme.toLowerCase() || !token) {
      throw new Error(`Header format is Authorization: ${tokenType} token`);
    }

    const { id, username, role } = await jwtVerify(token, tokenSecret, {
      algorithms: tokenAlgo
    });

    /** Check that a user with this userId exists */
    const user = await UserModel.find({_id: id, username, role});
    if (user === undefined || user.length === 0) {
      throw new Error(`User ${username} doesn't exist`);
    }
  } catch (err) {
    res.status(401).json({
      error: 'Invalid Token'
    });
    return next(err);
  }
};
