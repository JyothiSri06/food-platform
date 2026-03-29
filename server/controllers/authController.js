const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        // Check if email exists
        const emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered. Please login or use another email.' });
        }

        // Check if phone exists (if provided)
        if (phone) {
            const phoneExists = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
            if (phoneExists.rows.length > 0) {
                return res.status(400).json({ message: 'Mobile number already registered. Please login or use another number.' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // SECURITY: Always default to 'customer' for public registration.
        // Admin accounts must be created manually or via a separate protected route.
        const newRole = 'customer';

        // Insert user
        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, password_hash, phone, newRole]
        );

        // Create token
        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            user: newUser.rows[0],
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email or phone
        const result = await db.query('SELECT * FROM users WHERE email = $1 OR phone = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (!user.password_hash) {
            return res.status(400).json({ message: 'This account uses Google Login. Please sign in with Google.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        let google_id, email, name;

        // Try to verify as ID Token first
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            google_id = payload.sub;
            email = payload.email;
            name = payload.name;
        } catch (idTokenError) {
            // Fallback: Verify as Access Token
            console.log('ID Token verification failed, trying Access Token fallback...');
            try {
                const tokenInfo = await googleClient.getTokenInfo(idToken);
                google_id = tokenInfo.sub;
                email = tokenInfo.email;
                // Note: Access token info might not have 'name', we can fetch it from userinfo endpoint if needed
                name = email.split('@')[0]; 
            } catch (accessTokenError) {
                console.error('Google Token Verification failed for both ID and Access token');
                return res.status(401).json({ message: 'Invalid Google token. Please try again.' });
            }
        }

        // Check if user exists by google_id
        let result = await db.query('SELECT * FROM users WHERE google_id = $1', [google_id]);
        
        if (result.rows.length === 0) {
            // Check if user exists by email
            result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            
            if (result.rows.length > 0) {
                // Update existing user with google_id
                const user = result.rows[0];
                await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [google_id, user.id]);
                result.rows[0].google_id = google_id;
            } else {
                // Create new user
                const newUser = await db.query(
                    'INSERT INTO users (name, email, google_id, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
                    [name, email, google_id, 'customer']
                );
                result = newUser;
            }
        }

        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Google login failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // 1. Get user based on POSTed email
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'There is no user with that email address.' });
        }
        const user = result.rows[0];

        // 2. Generate the random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // 3. Save to database
        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [hashedToken, expires, user.id]
        );

        // 4. Send it via email
        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
            });
        } catch (err) {
            console.error('EMAIL_SEND_ERROR:', err);
            await db.query(
                'UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = $1',
                [user.id]
            );
            return res.status(500).json({ message: 'There was an error sending the email. Try again later!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during forgot password' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // 1. Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const result = await db.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [hashedToken]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }
        const user = result.rows[0];

        // 2. Set the new password and hash it
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await db.query(
            'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [password_hash, user.id]
        );

        // 3. Log the user in, send JWT
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            status: 'success',
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during reset password' });
    }
};
