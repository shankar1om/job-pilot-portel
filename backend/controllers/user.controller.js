import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'user already exist with this email',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber:Number(phoneNumber),
            password: hashedPassword,
            role,

        })
        return res.status(200).json({
            message: "account created successfully"
        })
    }
    catch (error) {
        console.log('error from user controller')
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect  email or Password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect  email or Password",
                success: false
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account dose not exist with current role",
                success: false
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `welcome back ${user.fullname}`,
            user,
            success: true
        })
    }
    catch (error) {
        console.log('err from login controller', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', { maxAge: 0 }).json({
            //can also do ,res.clearCookie("token")

            message: 'logout successfull',
            success: true
        })
    }
    catch (error) {
        console.log('err while  performing logout', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, profile } = req.body;
        const { bio, skills } = profile || {} //{} in case if profile is undefined
        const file = req.file //unaware

        //claudinary unaware

        let skillsArray
        if (skills) {
            skillsArray = skills.split(',')
        }
        const userId = req.id; //middleware authentication
        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: 'user not found',
                success: false
            })
        }

        //updating data

        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (profile) {
            if (bio) user.profile.bio = bio
            if (skills) user.profile.skills = skillsArray
        }

        //resume come later here
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: 'profile updated successfully',
            user,
            success: true
        })
    }
    catch (error) {
        console.log('err while  performing profile update', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}