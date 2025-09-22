import { User } from '@/schemas/user.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async checkUserNameExists(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });
    return !!user;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<string> {
    // Basic validation
    if (!username || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('A user already exists with that email');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token: string = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return token;
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const token: string = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return token;
  }

  async getUserProfile(token: string): Promise<string> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return `User profile for user ${user.username} with email ${user.email}`;
  }

  async updateUserProfile(token: string, newEmail: string): Promise<string> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new BadRequestException('Invalid email format');
    }
    user.email = newEmail;
    await user.save();
    return `User with token ${token} updated with new email ${newEmail}`;
  }

  async deleteUser(token: string, password: string): Promise<string> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Incorrect password');
    }
    await this.userModel.deleteOne({ _id: userId });
    return `User deleted`;
  }
}
