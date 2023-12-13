//var passport = require('passport');
// var GoogleStrategy = require('passport-google-oidc');

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.SECRET_KEY,
//     callbackURL: 'https://localhost:8000/oauth2/redirect/google'
//   },
// //   function(issuer, profile, cb) {
// //     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
// //       issuer,
// //       profile.id
// //     ], function(err, cred) {
// //       if (err) { return cb(err); }
// //       if (!cred) {
// //         // The Google account has not logged in to this app before.  Create a
// //         // new user record and link it to the Google account.
// //         db.run('INSERT INTO users (name) VALUES (?)', [
// //           profile.displayName
// //         ], function(err) {
// //           if (err) { return cb(err); }

// //           var id = this.lastID;
// //           db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
// //             id,
// //             issuer,
// //             profile.id
// //           ], function(err) {
// //             if (err) { return cb(err); }
// //             var user = {
// //               id: id.toString(),
// //               name: profile.displayName
// //             };
// //             return cb(null, user);
// //           });
// //         });
// //       } else {
// //         // The Google account has previously logged in to the app.  Get the
// //         // user record linked to the Google account and log the user in.
// //         db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
// //           if (err) { return cb(err); }
// //           if (!user) { return cb(null, false); }
// //           return cb(null, user);
// //         });
// //       }
// //     }
// //   }
// ));

require("dotenv").config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
var FacebookStrategy = require('passport-facebook');

authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: "http://localhost:8000/auth/google/callback",
  passReqToCallback: true,
  scope: [ "profile","email"],
},  authUser
));

passport.use(new FacebookStrategy({
  clientID: '727429922621215',  //FACEBOOK_APP_ID
  clientSecret: 'f4ec0dcd35f7d73f9640dde330ca26dd',  //FACEBOOK_APP_SECRET
  callbackURL: "http://localhost:8000/auth/facebook/callback",
  scope: ["email"],
 
},  authUser

));

passport.serializeUser((user, done) => {
 //console.log('serializeUser',user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log('deserializeUser',user)
  done(null, user)
})
