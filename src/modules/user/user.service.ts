import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  createUser(username: string, email: string, password: string): string {
    return `User ${username} created with email ${email}`;
  }
  getUserProfile(userId: string): string {
    return `User profile for user ${userId}`;
  }

  updateUserProfile(userId: string, newEmail: string): string {
    return `User ${userId} updated with new email ${newEmail}`;
  }

  deleteUser(userId: string): string {
    return `User ${userId} deleted`;
  }
}
