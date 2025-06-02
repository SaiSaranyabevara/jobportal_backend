import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';


export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' , success :false });
        };

      const file = req.file;

let profilePhotoUrl = "";

if (file) {
  const fileUri = getDataUri(file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
  profilePhotoUrl = cloudResponse.secure_url;
}

        let user = await User.findOne({ email }); // check if user already exists 
        if (user) {
            return res.status(400).json({ message: 'Email already exists', success :false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {   
              profilePhoto: profilePhotoUrl,
               
            },
        });
        
        res.status(201).json({ message: 'User registered successfully', success : true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const  login = async (req,res) => {
    try {
        const {email , password , role} = req.body;
        if( !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' , success :false });
        };
        let user = await User.findOne({ email });
        if(!user)
        {
            return res.status(400).json({
                message: "Incorrect email or password",
                success:false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success:false,
            })
        };
        //check if the role is correct
        if(user.role !== role) {
            return res.status(400).json({
                message: "Incorrect role",
                success:false,
            })
        };
        //generate token
        const tokenData={
            userId:user._id,
        }
        const token = await  jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });
        user = {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }
        //send token in cookie
        return res.status(200).cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure:"true",
            sameSite:'none',
            // sameSite: 'strict',
        }).json({
            message: `welcome back ${user.fullName}`,
            user,
            token,
            success:true,
        });

    } catch (error) {
       
        res.status(500).json({ error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', {
            maxAge: 0,
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
        }).json({
            message: 'Logout successful',
            success:true,
        });
    } catch (error) {
   
        res.status(500).json({ error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills, role } = req.body;
        const file = req.file; // file upload middleware
        const userId = req.id; // middleware authentication

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }

        let cloudResponse;

        // ✅ Only process file if it's uploaded
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(',');
        }

        // ✅ Update user fields
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (role) user.role = role;

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser, success: true });
    } catch (error) {
       
        res.status(500).json({ error: error.message });
    }
};

