const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Get the token from the request headers
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify the token
    const tok = token.slice("bearer ".length)
   
    jwt.verify(tok, "JWT_SECRET", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach the decoded token payload to the request object
        req.user = decoded;
        next();
    });
}

module.exports = authMiddleware;