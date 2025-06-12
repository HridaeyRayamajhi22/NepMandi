import jwt from "jsonwebtoken";
const auth  = async(req, res, next) => {
    try{

        const token = req.cookies.AccessToken
        || req?.headers?.authorization?.split(" ")[1]; // Bearer token
        
        if(!token){
            return res.status(401).json({
                message: "PROVIDE TOKEN",
                error: true,
                success: false,
            });
        }

        // Verify token
        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if(!decode){
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false,
            });  
        }
        // Check if user is verified  
         req.userId = decode.id;
         next();
    } catch (error){
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            message: "Token verification failed",
            error: error.message,
            success: false,
        });
    }
    
}
export default auth;







