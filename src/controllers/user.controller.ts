import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed or missing fields.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. A user with this username or email already exists.',
  })
  @ApiBody({
    type: User,
    description:
      'User data to create a new user. Fields include username, password, email, phone, weight, and height.',
  })
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user).catch((error) => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [User],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Unable to retrieve users.',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll().catch((error) => {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to retrieve.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a user by ID.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the given ID does not exist.',
  })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id).catch((error) => {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to update.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed or missing fields.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the given ID does not exist.',
  })
  @ApiBody({
    type: User,
    description:
      'User data to update the existing user. Fields include username, password, email, phone, weight, and height. Only the fields that need to be updated should be provided.',
  })
  update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, userData).catch((error) => {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to delete.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with the given ID does not exist.',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id).catch((error) => {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    });
  }
}
