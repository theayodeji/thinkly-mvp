import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"; // Updated path to your mongoose 
// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
import { config } from "./env.js";
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Use our findOrCreate method to handle user creation/linking
        const user = await User.findOrCreate(profile);
        return done(null, user);
    }
    catch (error) {
        console.error('Passport Google Strategy Error:', error);
        return done(error, undefined);
    }
}));
export default passport;
