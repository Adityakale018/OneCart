
import User from "../model/UserModel.js"
import validator from  "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js"

export const registration = async (req,res)=>{
    try {
        const {name,email,password} = req.body
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter Valid Email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong password"})
        }
        let hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({name,email,password:hashPassword})
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000

        })
        return res.status(201).json(user)
       
    } catch (error) {
        console.log("registration error")
        return res.status(500).json({message:`registration error ${error}`})
    }
}


export const login = async(req,res)=>{
    try {
        let {email,password} = req.body;
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(404).json({message:"Incorrect Password"})
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000

        })
        return res.status(201).json(user)
    } catch (error) {
        console.log("login error")
        return res.status(500).json({message:`login error ${error}`})
    }
}

export const logOut = async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"logout successfuly"})
    } catch (error) {
        console.log("logOut error")
        return res.status(500).json({message:`logOut error ${error}`})
    }
}

export const googleLogin = async (req,res) => {
    try {
      let {name,email} = req.body;
      let user = await User.findOne({email})
        if(!user){
            user = await User.create({name,email})
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000

        })
        return res.status(200).json(user)

    } catch (error) {
        console.log("google login error")
        return res.status(500).json({message:`google login error ${error}`})
    }
}

export const adminLogin = async (req,res) => {
    try {
        let {email,password} = req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            let token = await genToken1(email)
            res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge:1*24*60*60*1000

        })
        return res.status(200).json(token)

        }
    } catch (error) {
        console.log("Admin login error")
        return res.status(500).json({message:`Admin login error ${error}`})
    }
}