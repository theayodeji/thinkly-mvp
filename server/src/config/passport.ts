import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"; // Updated path to your mongoose 

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

import { config } from "./env.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile: any, done) => {
      try {
        // Use our findOrCreate method to handle user creation/linking
        const user = await User.findOrCreate(profile as any);
        return done(null, user);
      } catch (error) {
        console.error('Passport Google Strategy Error:', error);
        return done(error, undefined);
      }
    }
  ) as any
);

export default passport;
