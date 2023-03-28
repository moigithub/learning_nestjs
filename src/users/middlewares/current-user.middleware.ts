import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction } from 'express';
import { User } from '../user.entity';

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }

type RequestWithUser = Request & { currentUser?: User };

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // @ts-ignore
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }

  // async intercept(context: ExecutionContext, handler: CallHandler) {
  //   const request = context.switchToHttp().getRequest();
  //   const { userId } = request.session;

  //   if (userId) {
  //     const user = await this.usersService.findOne(userId);

  //     request.currentUser = user;
  //   }

  //   return handler.handle();
  // }
}
