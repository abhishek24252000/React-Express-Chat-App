import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
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
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: 'Invalid user Data' });
    }
  } catch (error) {
    console.log('error in signup contoller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login contoller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    console.log(profilePic);
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkAuth = (req, res) => {    //will call this for evry refresh, to know user is authenticated
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
