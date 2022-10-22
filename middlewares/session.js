const { verifyToken } = require("../services/userService");

module.exports = () => async (req, res, next) => {
    const token = req.cookies.token;

    if(token) {
        try {
            const user = await verifyToken(token);
            req.user = user;
            res.locals.username = user.username;
        } catch(err) {
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        }
    }
    next();
}