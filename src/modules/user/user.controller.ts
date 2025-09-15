import { Controller } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Aquí podrías definir métodos para manejar las solicitudes relacionadas con usuarios
}
