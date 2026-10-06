declare global {
  namespace Express {
    interface Request {
      userId?: string;
      isGuest?: boolean;
      guestDeviceId?: string;
    }
  }
}
export {};
