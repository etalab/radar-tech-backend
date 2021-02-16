/** Middleware for authentification
 * inspired by : https://github.com/arkerone/express-security-example
 */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../db');

const jwtVerify = promisify(jwt.verify);

const tokenType = process.env.ACCESS_TOKEN_TYPE;
const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
const tokenAlgo = process.env.ACCESS_TOKEN_ALGORITHM;
const accessToken = { tokenType, tokenSecret, tokenAlgo };

module.exports = async (req, res, next) => {
  try {
    const { headers } = req;

    if (!headers.authorization) {
      throw new BadCredentialsError({
        message: 'Missing Authorization header'
      });
    }

    const parts = headers.authorization.split(' ');

    if (parts.length !== 2) {
      throw new BadCredentialsError({
        message: `Header format is Authorization: ${tokenType} token`
      });
    }

    const scheme = parts[0];
    const token = parts[1];

    /** Verify that tokenType correspond to request auth type (ex: bearer) */
    if (tokenType.toLowerCase() !== scheme.toLowerCase() || !token) {
      throw new BadCredentialsError({
        message: `Header format is Authorization: ${tokenType} token`
      });
    }

    const { userId } = await jwtVerify(token, tokenSecret, {
      algorithms: tokenAlgo
    });
    /** Check that a user with this userId exists */
    const user = await db.getModel('User').findOne({ where: { id: userId } });
    if (!user) {
      throw new BadCredentialsError({
        message: `User ${userId} not exists`
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    res.status(401).json({
      error: new Error('Invalid Token')
    });
    return next(err);
  }
};
