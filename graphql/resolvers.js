const bcrypt = require("bcryptjs");
const User = require("../models/user");
const validator = require("validator");
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async function ({ userInput }, req) {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-mail is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
        errors.push({message:'Password too short!'})
    }
    if(errors.length > 0){
        const error = new Error("Invalid input!");
        error.data = errors
        error.code = 422
        throw error; 
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    return { ...savedUser._doc, _id: savedUser._id.toString() };
  },
  login: async function({email, password}) {
    const user = await User.findOne({email})
    if (!user) {
      const error = new Error('User not found')
      error.code = 401
      throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual){
      const error = new Error('Password is incorrect')
      error.code = 401
      throw error
    }
    const token = jwt.sign({
      userId:user._id.toString(),
      email:user.email
    }, 'supersecret',{expiresIn:'1h'})
    return {token, userId:user._id.toString()}
  }
  
};
