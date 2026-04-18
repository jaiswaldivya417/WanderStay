const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
};

app.use(cookieParser());

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let { name } = req.query;
    req.flash("success", "You have registered successfully!");
    res.redirect(`/greet?name=${name}`);
});

app.get('/greet', (req, res) => {
    let { name = "anonymous" } = req.query;
    res.locals.success = req.flash("success");
    res.render("page.ejs", { name });
});



app.get("/getcookies", (req, res) => {
    res.cookie("greeting", "namaste");
    res.cookie("madeIN", "India");
    res.send("Send some cookies");
});

app.get('/', (req, res) => {
    console.dir(req.cookies);
    res.send('Hey I am root!');
});

app.use("/users",users);
app.use("/posts", posts);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});