const express= require("express");
const authRouter=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const prisma = require("../config/prisma");
const validatedata= require("../utils/validation");


authRouter.post("/login", async (req, res) => {

  try {
    validatedata(req);
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(400).json({
        message: "No user found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // create token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user:{
        id:user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);
    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
  }
});


module.exports = authRouter;