import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserTokenPayload } from '@icms/shared';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUserTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUserTokenPayload;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

