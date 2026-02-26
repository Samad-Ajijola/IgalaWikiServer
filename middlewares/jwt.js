const jwt = require("jsonwebtoken")
const cookies = require("cookie-parser")
const loginAuth = async(req, res, next) =>{
const token = request.cookies("access-token")
if (token){
    const validatetoken = jwt.verify(token,process.env.JWT_SECRET)
}
}