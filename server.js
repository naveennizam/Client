require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
const  connection  = require('./database/connection');


app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())
app.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));
app.use(express.json())

app.get("/", (req, res) => {
    let r = path.join(__dirname, './')
    sess = req.session;
    sess.email;
    sess.username;
    // if (client.connect()) { res.sendFile(r + `indexs.html`) }
    // else { res.sendFile(r + `indexs.html`) }
    res.sendFile(r + `indexs.html`) 
})

app.get('/auth/google', passport.authenticate("google", ["profile", "email"]));


app.get('/success', passport.authenticate('google', {
    failureRedirect: '/error.html'
}), checkAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) { return next() }
    res.redirect("/error.html")
},
    function async(req, res) {

        let email = req.user.emails[0].value

        jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '120s' }, async (err, token) => {
            try {
                client.on('error', err => console.log('Redis Client Error', err))
                client.connect()

                new Headers({ 'Content-Type': 'application/json', 'Authorization': 'secretKey ' + token });

                let hi = await client.set(email, token)

                res.cookie("jwt-id", hi, { maxAge: 900000, httpOnly: true })


                res.redirect("/sign")


                return res.json({ token })
            }
            catch (err) { console.log(err) }
        })

    }
);


app.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));
app.get('/successed', passport.authenticate('facebook', {
    failureRedirect: '/error.html'
}),
    checkAuthenticated = (req, res, next) => {

        if (req.isAuthenticated()) { return next() }
        res.redirect("/error.html")
    },
    function async(req, res) {
      
        let id = req.user.id
        jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '120s' }, async (err, token) => {            
            // TOKEN WILL BE EXPIRE IN 2 MINUTE
            
            try {
               
                client.connect();
                new Headers({ 'Content-Type': 'application/json', 'Authorization': `${process.env.JWT_SECRET_KEY}  `+ token });

                let hi = await client.set(req.user.id, token)

                res.cookie("jwt-id", hi, { maxAge: 900000, httpOnly: true })


                res.redirect("/sign")


                return res.json({ token })
            }
            catch (err) { console.log(err) }
        })

    }
);

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1]
        req.token = token

        next()
    }
    else { res.send({ result: 'not valid' }) }
}
app.post("/provide", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) { res.send({ result: "INVALID" }) }
        else {
            { res.send({ result: "ACCESSED", authData }) }
        }
    })



})

app.get('/sign', async (req, res) => {

    if (req.isAuthenticated()) {
        client.disconnect()
        res.render(path.join(__dirname, 'sign.ejs'), { title: req.user.displayName, provider: req.user.provider })
    }
    else res.redirect("/error.html")

})
app.post("/logout", async (req, res, next) => {

    try {
        //I had to include the user before the callback when calling the logout function
        req.logout(req.user, function (err) {
            console.log("logout callback called")
            req.session.destroy(function (err) {
                res.render('logout');
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


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
