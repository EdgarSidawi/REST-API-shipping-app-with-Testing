const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  // console.log('authHeader: ', authHeader);
  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somethingjustlikethisismyfavouritesong');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // console.log('decodedToken: ', decodedToken);

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  // information stored in the token
  req.userId = decodedToken.userId;
  next();
};
