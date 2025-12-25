import jwt from 'jsonwebtoken';

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                message: "user not authenticated",
                success: false
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
             return res.status(400).json({
                message: "Invalid token",
                success: false
            })
        }
        req.id = decode.userId;
        next();
    }
    catch (error) {
        console.log("error from isAuthenticated middleware", error)
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

export default isAuthenticated;