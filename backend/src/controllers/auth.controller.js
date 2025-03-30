import { User } from '../middleware/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    //check passwords length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    //check user alredy exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    //hash psw
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
        //genearte jwt toke
        
    } else {
      res.status(400).json({ message: 'Invalid user Data' });
    }
  } catch (error) {}
};
export const login = (req, res) => {
  res.send('login route');
};
export const logout = (req, res) => {
  res.send('logout route');
};
