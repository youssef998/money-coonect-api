import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines if the current request is authorized to proceed.
   * 
   * @param context - The execution context of the request.
   * @returns A boolean indicating if the request is authorized.
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

   /**
   * Handles the request after the JWT validation.
   * 
   * @param err - Any error that occurred during the validation.
   * @param user - The user object extracted from the JWT.
   * @returns The user object if validation is successful.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return user;
  }
}
