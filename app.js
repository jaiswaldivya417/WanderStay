if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./MODELS/user');



const sessionOptions = {
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 day
      maxAge : 1000 * 60 * 60 * 24*7, // 1 day
      secure: false,  // Set to true if using HTTPS
      httpOnly: true
    }
};

// Importing Routes
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const app = express();

/* ==============================
   VIEW ENGINE & MIDDLEWARE
================================ */

app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

app.get('/demouser', async (req, res) => {
    let fakeUser = new User({ 
      email: 'student@gmail.com',
      username: 'student' });
    const newUser = await User.register(fakeUser, 'helloWorld');
    res.send(newUser);
});


//  DATABASE CONNECTION
// mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(8080, () => {
      console.log("Server running on http://localhost:8080");
    });
  })
  .catch(err => console.log(err));


// root route
app.get('/', (req, res) => {
    res.render('listings/home.ejs');
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


//  404 HANDLER
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

/* ==============================
   ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { err: { statusCode: status, message } });
});
