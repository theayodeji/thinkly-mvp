console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"; // your mongoose model
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
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
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
//# sourceMappingURL=passport.js.map