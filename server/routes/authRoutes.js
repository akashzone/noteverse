
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post("/register", async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message : "User already userExists."});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password : hashedPassword
        });
        res.status(201).json({
            message : "User registered successfully"
        });
    }
    catch(err){
        res.status(500).json({ message : err.message });
    }
})


router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message : "Invalid Credential"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credential"});
        }

        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )
        console.log(token);
        res.json({token});
    }
    catch(err){
        res.status(500).json({message : err.message});
    }
})

module.exports = router;