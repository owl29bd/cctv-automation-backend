import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Role } from 'src/enums/role.enum';

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
};

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user: CurrentUser = {
      id: request.user.sub,
      email: request.user.email,
      role: request.user.role,
    };

    return data ? user?.[data] : user;
  },
);
