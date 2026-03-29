const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const userRes = await db.query('SELECT id FROM users WHERE id = $1', [decoded.id]);
            if (userRes.rowCount === 0) {
                return res.status(401).json({ message: 'Not authorized, user was deleted. Please log out and back in.' });
            }
            
            req.user = decoded; // { id, role }
            next();
        } catch (error) {
            console.error('Token validation error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

const partner = (req, res, next) => {
    if (req.user && (req.user.role === 'delivery_partner' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as delivery partner' });
    }
};

module.exports = { protect, admin, partner };
