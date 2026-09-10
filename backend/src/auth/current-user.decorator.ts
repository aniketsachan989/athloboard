import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  firebase_uid: string;
  email: string;
  role: 'athlete' | 'gym_owner' | 'brand' | 'vendor' | 'admin';
  display_name?: string;
  profile_photo_url?: string;
  city?: string;
  state?: string;
  date_of_birth?: string;
  gender?: string;
  bio?: string;
  instagram_handle?: string;
  is_active: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
