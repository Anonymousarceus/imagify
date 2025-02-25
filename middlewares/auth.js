import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    try {
        // Check for token in various places
        const token = req.headers.token || 
                     req.headers['x-access-token'] || 
                     req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authorized. No token provided.' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded.id) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid token format' 
                });
            }
            req.body.userId = decoded.id;
            next();
        } catch (tokenError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication' 
        });
    }
};

export default userAuth;