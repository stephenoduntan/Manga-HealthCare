import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  public_id: string;
  role: string;
  name: string;
  phone: string;
  email?: string;
  telemedicine_consent: boolean;
  ndpr_consent: boolean;
  is_locum?: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
