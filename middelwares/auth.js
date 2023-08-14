const jwt = require('jsonwebtoken');
const SECRET_KEY = 'RG4ERG';
const userModel = require('../models/user'); // Make sure to import the userModel

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      const decodedToken = jwt.verify(token, SECRET_KEY);
      const user = await userModel.findById(decodedToken.id);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized User' });
      }

      req.user = user; // Attach the user object to the request
    } else {
      return res.status(401).json({ message: 'Unauthorized User' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Unauthorized User' });
  }
};

module.exports = auth;
