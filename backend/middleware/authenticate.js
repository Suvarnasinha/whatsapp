const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  // const token1 = req.cookies.token;
  const token = req.header('Authorization');
  console.log("authenicate")
  console.log("token",token)
  if (token) {
    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.userid = decoded.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

