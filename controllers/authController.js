const authController = require('express').Router();

const { validationResult, body } = require('express-validator');
const { register } = require('../services/userService');
const errorParser = require('../util/errorParser');

authController.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', 
body( 'username' )
.isLength( { min: 5}).withMessage('Username must be at least 5 characters long'),
body( 'email' )
.isLength( { min: 10}).withMessage('Email must be at least 10 characters long'),
body( 'password' )
.isLength( { min: 4}).withMessage('Password must be at least 4 characters long'),
async (req, res) => {

    try {
        const { errors } = validationResult(req);
        if(errors.length > 0) {
            throw errors;
        }

        if(req.body.password !== req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        const token = await register(req.body.username, req.body.email, req.body.password);

        res.cookie('token', token);
        res.redirect('/');
    
    } catch (error) {
       res.render('register', {
        title: 'Register Page',
        errors: errorParser(error),
        body: {
            username: req.body.username,
            email: req.body.email
        }
    }); 
    }

});



module.exports = authController;