const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');
const { renderRegister, register, renderLogin, login, logout} = require('../contollers/user');



router.get('/register', renderRegister);

router.post('/register', wrapAsync(register));

router.get('/login',renderLogin);

router.post('/login', saveRedirectUrl,
    passport.authenticate('local', { 
        failureFlash: true, 
        failureRedirect: '/login' }), 
        login
    );

router.get('/logout', logout);

module.exports = router;