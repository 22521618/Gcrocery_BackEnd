const express = require('express');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

authRouter.post('/api/signup', async (req, res) => {
    try{
        const {fullName, email, password} = req.body;
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({msg:"user with the same email already exist"});
        }
        else{
            //generate a salt with the cost factor of 10
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await  bcrypt.hash(password,salt);
            let user = new User({fullName, email, password:hashedPassword});
            user = await user.save();
            res.json({user});
        }
    }
    catch(e){
        res.status(500).json({error:e.message});
    }
})

authRouter.post('/api/signin', async (req, res) => {
    try {
      const {email, password} = req.body;
      const findUser = await User.findOne({email});
      if (!findUser) {
        return res.status(400).json({ msg: "User not found with this email" });
      } else {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Incorrect Password' });
        } else {
          const token = jwt.sign({id: findUser._id}, "passwordKey");

          //remove sensitive information

          const {password, ...userWithoutPassword } = findUser._doc;
          res.json({token,user:userWithoutPassword});
        }
      }
    } catch (e) {
      res.status(500).json({error:e.message});
    }
});

authRouter.put('/api/users/:id', async (req, res) => {
  try {
    // Extract the 'id' parameter from the request URL
    const { id } = req.params;

    // Extract the "state", "city" and locality fields from the request body
    const { state, city, locality } = req.body;

    // Find the user by their ID and update the state, city and locality fields
    // The (new: true) option ensures the updated document is returned
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state, city, locality },
      { new: true }
    );

    if(!updatedUser){
      return res.status(404).json({error: "User not found"});
    }
    return res.status(200).json(updatedUser);

    // ... (code to handle the updatedUser)
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});

authRouter.get('/api/users', async(req, res) => {
  try {
    const users = await User.find().select('-password'); //Exclude password field
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
  

module.exports = authRouter;