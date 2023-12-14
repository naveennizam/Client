require("dotenv").config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
var FacebookStrategy = require('passport-facebook');
var { connectToDatabase } = require("./database/connection")
authUser = async (request, accessToken, refreshToken, profile, done) => {

  let provider_id = profile.id
  let json = {
    provider_id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    provider: profile.provider,
  }
;
  const q = async (json) => {
    let client = await connectToDatabase();



    const rows = await client.query(`INSERT INTO  client ( name, email, provider,  provider_id) VALUES ('${json.name}', '${json.email}', '${json.provider}', ${json.provider_id} )`);
    console.log(rows);

  };

  const check = async (provider_id) => {
    let client = await connectToDatabase();

    let sql = (`SELECT * FROM client where provider_id = ${provider_id}`);

    const data = await client.query(sql);

    return data.rows

  };
  let checkedInTable = await check(provider_id)

  if (checkedInTable.length > 0) { console.log('welcome!') }
  else { q(json) }

  return done(null, profile);
}
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.GOOGLE_CALL_BACK,
  passReqToCallback: true,
  scope: ["profile", "email"],
}, authUser
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALL_BACK,
  scope: ["email"],

}, authUser

));

passport.serializeUser((user, done) => {
  //console.log('serializeUser',user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  //console.log('deserializeUser',user)
  done(null, user)
})
