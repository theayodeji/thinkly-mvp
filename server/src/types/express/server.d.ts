import { Types } from 'mongoose';
import { IUser } from '../User';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
      user?: IUser;
    }
  }
}
