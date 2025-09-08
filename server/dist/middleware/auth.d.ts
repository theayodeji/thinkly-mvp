import type { Request, Response, NextFunction } from 'express';
/**
 * Middleware to authenticate JWT tokens from Authorization header
 */
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user is authenticated (either via JWT or OAuth)
 */
export declare const isAuthenticated: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
declare const _default: {
    authenticateJWT: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    isAuthenticated: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map