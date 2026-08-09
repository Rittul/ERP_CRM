const jwt=require("jsonwebtoken")

const userauth=(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;
        const token = req.cookies.token || bearerToken;
        if(!token){
            return res.status(401).json({
                message: "no token found! pls login first"
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={
            id: decoded.userId,
            role:decoded.role
        };
        next();
    }catch(err){
        return res.status(401).json({
            message: "Invalid or expire token"
        });
    }
}


module.exports=userauth;