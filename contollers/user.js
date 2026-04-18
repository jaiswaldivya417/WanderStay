const User = require('../MODELS/user');

module.exports.renderRegister = (req, res) => {
    res.render('user/register.ejs');
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);  
            req.flash('success', 'Welcome to Wanderlust!');
            console.log(registeredUser);
            res.redirect('/listings');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('user/login.ejs');
};

module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/listings');
    });
}