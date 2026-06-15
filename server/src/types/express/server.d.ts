import { Types } from 'mongoose';
import { IUser } from '../entities.js';

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
      user?: IUser;
    }
  }
}
