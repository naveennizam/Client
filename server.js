require("dotenv").config();
const express = require("express");
const cors = require("cors");
var flash = require('connect-flash');
// const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const app = express();
const body_parser = require("body-parser")
const redis = require("redis");
app.use(body_parser.json())
const client = redis.createClient()
const jwt = require("jsonwebtoken")
require("./passport")
const passport = require("passport");
const path = require('path')
var session = require('express-session');


app.set("view engine", "ejs")
app.use(flash())

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())
app.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));
app.use(express.json())
console.log((path.join(__dirname, './')));
app.get("/", (req, res) => {
    let r = path.join(__dirname, './')
    sess = req.session;
    sess.email;
    sess.username;

    res.sendFile(r + `indexs.html`)
})
// app.get('/oauth2/redirect/facebook',
//   passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.get('/auth/google', passport.authenticate("google", ["profile", "email"]));


app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/error.html'
}),
    checkAuthenticated = (req, res, next) => {

        if (req.isAuthenticated()) { return next() }
        res.redirect("/error.html")
    },
    function async(req, res) {
        var userString = (req.user)

        jwt.sign({ userString }, 'secretKey', { expiresIn: '5min' }, (err, token) => {
            //   console.log(token);
            //  localStorage.setItem("token",token)
        })

        res.render("sign", { title: req.user.displayName, provider: req.user.provider })


    }
);

app.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/error.html'
}),
    checkAuthenticated = (req, res, next) => {

        if (req.isAuthenticated()) { return next() }
        res.redirect("/error.html")
    },
    function async(req, res) {
        var userString = (req.user)
        jwt.sign({ userString }, 'secretKey', { expiresIn: '5min' }, (err, token) => {
            //   console.log(token);
        })
        res.render("sign", { title: req.user.displayName, provider: req.user.provider })


    }
);
app.post("/logout", async (req, res, next) => {

    try {
        //I had to include the user before the callback when calling the logout function
        req.logout(req.user, function (err) {
            console.log("logout callback called")
            req.session.destroy(function (err) {
                res.redirect('/');
            });
            if (err) {
                console.log("error", err)
                return next(err);

            }


        });
    } catch (e) {
        console.log(e)
    }

})



const fakeUser = {
    name: "ALI",
    email: "alia@gmail.com",
    password: "12345"
}
app.get('sign', async (req, res) => {
    console.log('qwerty')
})
app.post("/login", async (req, res) => {
    try {
        await client.on('error', err => console.log('Redis Client Error', err))
        client.connect()
        //  let value = await client.get('counter');
        ////  value = parseInt(value)
        // console.log('GET value',value );

        //  await  client.get("counter",async (er,data) => {
        //    console.log('data',data);
        /// let data =   client.set("counter", parseInt(value) + 1)
        // console.log('SET value',data);
        await jwt.sign(fakeUser, "secret", { expiresIn: "1d" }, async (err, token) => {

            let hi = await client.set(fakeUser.email, token)

            let g = res.cookie("jwt-id", hi, { maxAge: 900000, httpOnly: true })
            //   console.log(g);
            client.disconnect()
            return res.send("logged in")


        })
        //  })
    }



    catch (err) { console.log(err) }
})

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 60 ,
// 	})
// );



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
