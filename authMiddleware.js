import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const authUserMiddleware = (req, res ,next) =>{
const authHeader = req.headers.authorization;

if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({message: "no token provided"

    })
}

const token = authHeader.split(" ")[1]

try{
    const decode = jwt.verify(token, process.env.AUTH_KEY)
    req.user = ({id: decode.id})
    next()
}catch(error){
    res.status(401).json({message: "invalid or expiered token"})
}
}

export default authUserMiddleware