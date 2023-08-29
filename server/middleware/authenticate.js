const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const cookieParser = require('cookie-parser');

const SECRET_KEY = 'srikanthismynamesrikanthismyname';

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken; // Make sure the cookie is actually named jwtoken
    
    const verifyToken = jwt.verify(token,SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken._id, 'tokens.token': token });
    if (!rootUser) {
      throw new Error('User not Found');
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
    console.log(err);
  }
};

module.exports = Authenticate;
