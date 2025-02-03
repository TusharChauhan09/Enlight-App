// import lib 
import jwt from 'jsonwebtoken';
// import cookies from 'cookie'; // This is unnecessary if you are using express cookie handling


// genrate token
export const genrateToken = (userId, res) =>{
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true,  //prevents XSS attacks aross-sites scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}