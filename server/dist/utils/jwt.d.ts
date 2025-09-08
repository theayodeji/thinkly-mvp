import { Types } from "mongoose";
export declare const generateToken: (id: Types.ObjectId | string, isRefresh?: boolean) => string;
export declare const verifyToken: (token: string, isRefresh?: boolean) => {
    id: string;
};
//# sourceMappingURL=jwt.d.ts.map