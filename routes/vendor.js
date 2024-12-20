const express = require('express');

const Vendor =  require('../models/vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const vendorRouter = express.Router();


vendorRouter.post('/api/vendor/signup', async (req, res) => {
    try{
        const {fullName, email, password} = req.body;
        const existingEmail = await Vendor.findOne({email});
        if(existingEmail){
            return res.status(400).json({msg:"vendor  with the same email already exist"});
        }
        else{
            //generate a salt with the cost factor of 10
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await  bcrypt.hash(password,salt);
            let vendor = new Vendor({fullName, email, password:hashedPassword});
            vendor = await vendor.save();
            res.json({vendor});
        }
    }
    catch(e){
        res.status(500).json({error:e.message});
    }
})


vendorRouter.post('/api/vendor/signin', async (req, res) => {
    try {
      const {email, password} = req.body;
      const findUser = await Vendor.findOne({email});
      if (!findUser) {
        return res.status(400).json({ msg: "Vendor not found with this email" });
      } else {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Incorrect Password' });
        } else {
          const token = jwt.sign({id: findUser._id}, "passwordKey");

          //remove sensitive information

          const {password, ...vendorWithoutPassword } = findUser._doc;
          res.json({token, ...vendorWithoutPassword});
        }
      }
    } catch (e) {
      res.status(500).json({error:e.message});
    }
  });
  
//fetch all vendors (exclude password)
vendorRouter.get('/api/vendors', async(req, res) => {
  try {
    const vendors = await Vendor.find().select('-password'); //Exclude password field
    return res.status(200).json(vendors);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = vendorRouter;