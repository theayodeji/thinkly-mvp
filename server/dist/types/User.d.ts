import { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=User.d.ts.map