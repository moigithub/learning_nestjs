import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // interceptors run AFTER guards
    // so using currentUserInterceptor wont populate currentUser property
    // must implement a middleware, which run before guards
    console.log('adminguard', request.currentUser);
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
