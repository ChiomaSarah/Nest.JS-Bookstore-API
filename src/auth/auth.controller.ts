import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async Register(@Body() signUpDto: SignUpDto) {
    return this.authService.SignUp(signUpDto);
  }
  @Post('login')
  public async Login(@Body() loginDto: LoginDto) {
    return this.authService.SignIn(loginDto);
  }
}
