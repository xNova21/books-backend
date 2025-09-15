import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserProfile(userId: string): string {
    return `User profile for user ${userId}`;
  }
}
