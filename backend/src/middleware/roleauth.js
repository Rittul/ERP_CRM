
const roleauth=(...allowedroles)=>{
    return (req ,res,next)=>{
        if(!allowedroles.includes(req.user.role)){
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
};

module.exports = roleauth;