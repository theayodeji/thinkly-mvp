import type { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: Request, res: Response) => void;
export declare const googleLogin: any;
export declare const googleCallback: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authControllers.d.ts.map