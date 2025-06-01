import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'user not auhenticated', success: false });
        } 
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode) {
            return res.status(401).json({ message: 'invalid token', success: false });
        }

        req.id = decode.userId;
        next();
    } catch (error) {
       
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}

export default isAuthenticated;
// Compare this snippet from backend/controllers/company.controller.js: