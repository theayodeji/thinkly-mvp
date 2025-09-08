// src/models/User.ts
import mongoose, { Schema } from "mongoose";
// No need for IUserDocument since IUser already extends Document
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is only required for non-Google users
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values for non-Google users
    },
}, {
    timestamps: true
});
// Add static method for findOrCreate
userSchema.static('findOrCreate', async function (profile) {
    let user = await this.findOne({
        $or: [
            { email: profile.emails[0].value },
            { googleId: profile.id }
        ]
    });
    if (!user) {
        user = await this.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
        });
    }
    else if (!user.googleId) {
        // Link Google account to existing email
        user.googleId = profile.id;
        await user.save();
    }
    return user;
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map