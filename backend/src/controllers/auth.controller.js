// import lib
import bcrypt from 'bcryptjs'

// import models 
import User from '../models/user.model.js'
import { genrateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

// signup route controler
export const signup = async (req,res)=>{
    const {fullName, email, password} = req.body;
    try{
        // check params    / HERE {can use ZOD for parameter/input validation } 
        if(!fullName || !password || !email){
            return res.status(400).json({
                message : "All fields are required!!"
            });
        }

        // hash password
        if(password.length<6){
            return res.status(400).json({
                message:"Password must be at least 6 characters long" 
            });
        }

        // old user :  finding user if already exist in DB
        const user = await User.findOne({email}) 
        if(user){ 
            return res.status(400).json({
            message:"Email already exist" 
            }); 
        }

        // new user : if not alresy in DB
        // hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create user 
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        
        if(newUser){   // successfuly created user
            // genrate jwt token 
            genrateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }
        else{          // failed to create user    
            res.status(400).json({
                message : "Invalid user data"
            });
        }
    }
    catch(error){
        res.status(500).json({
            message: "Server error!!!"
        });
        console.log("error in signup controller",error.message);
    }
}

// login route controler
export const login = async (req,res)=>{
    const {email, password} = req.body;
    try{
        // find user in DB
        const user = await User.findOne({email});

        // user not found in DB
        if(!user){
           return res.status(400).json({
            message: "Invalid credentials"
           });
        }

        // user exist
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        // check if password is correct 
        // wrong pass
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials"
               });
        }

        // correct pass
        genrateToken(user._id,res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })  
    }
    catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// logout route controler
export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge:0
        });
        res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// Update profile 
export const updateProfile = async (req,res) =>{
    try{
        const {profilePic} = req.body;

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }
        // upload the image to the cloudinary 
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        
        // upload / update the profile pic 
        const  updateUser = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new: true})

        res.status(200).json(updateUser);
    }
    catch(error){
        console.log("error in updateProfile controller: ",error);
        return res.status(500).json({
            message: "Internal Error"
        });
    }
}

// check
export const checkAuth = async (req,res) =>{
    try{
        res.status(200).json(req.user);
    }   
    catch(error){
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

}