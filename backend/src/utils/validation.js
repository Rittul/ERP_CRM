const express = require("express");
const validator=require("validator")

const validatedata =(req)=>{
    const {email,password} = req.body;
    if(!email || !password) throw new Error("All fields required");
    if(!validator.isEmail(email)) throw new Error("Enter valid email");
}

module.exports = validatedata;