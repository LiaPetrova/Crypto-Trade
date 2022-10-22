const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'lglh4th9forgidskla353';

async function register (username, email, password) {
    let existing = await User.findOne( { username }).collation({ locale: 'en', strength: 2});

    if(existing) {
        throw new Error('Username is taken')
    }

    existing = await User.findOne( { email }).collation({ locale: 'en', strength: 2});

    if(existing) {
        throw new Error('Email is taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        hashedPassword
    });

    const token = createSession(user);
    return token;
}

function createSession ({ _id, email, username }) {

    const payload = {
        _id,
        email,
        username
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d'});
    return token;
}

function verifyToken (token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    verifyToken
}