require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const passport = require("passport");
// const authRoute = require("./routes/auth");
// const cookieSession = require("cookie-session");
// const passportStrategy = require("./passport");
const app = express();
const body_parser = require("body-parser")
const redis = require("redis");
app.use(body_parser.json())
const client = redis.createClient()
const jwt = require("jsonwebtoken")
require("./passport")
const passport = require("passport");
const path = require('path')
app.use(express.json())
app.use(express.static(path.join(__dirname, "./")))

app.get("/", (req, res) => {
    res.sendFile("/index.html")
})

app.get('/auth/google',
    passport.authenticate("google", ["profile", "email"]));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// console.log(client);

const fakeUser = {
    name: "ALI",
    email: "alia@gmail.com",
    password: "12345"
}

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
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
// 	cors({
// 		origin: "http://localhost:3000",
// 		methods: "GET,POST,PUT,DELETE",
// 		credentials: true,
// 	})
// );

// app.use("/auth", authRoute);


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
