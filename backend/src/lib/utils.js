import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    httpOnly: true, //prevent xss attacks
    sameSite: 'strict', //CSRF attacks cross-site request forgery attakcks
    secure: process.env.NODE_ENV !== 'development', //this is like http/https. in development there will http,so false
  });

  return token; 
};
