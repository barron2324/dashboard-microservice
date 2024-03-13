import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { Payload } from '@nestjs/microservices';
import { UsersService } from "./users.service";
import { createUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userEntyty } from './entities/user.entity';
import ReqUser from 'src/decorators/req-user.decorator';
import { usersInterface } from './interfaces/users.interface';
import { changePasswordDto } from './dto/change-password.dto';
import { ChangePasswordUserValidationPipe } from './pipes/change-password-user-validation.pipe';
import { ChangePasswordEntyty } from './entities/change-password.entity';
import { updateUserDto } from './dto/update-user.dto';
import { updateUserEntyty } from './entities/update-user.entity';
import { UseRoles } from 'src/decorators/role.decorator';
import { rolesUserEnum } from './enum/roles-user.enum';
import { registerUserValidationPipe } from './pipes/register-user-validation.pipe';

@Controller('users')
@ApiTags('user')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post('register')
    @ApiBody({
        type: createUserDto,
    })
    async createUser(@Body(registerUserValidationPipe) body: createUserDto): Promise<void> {
        try {
            await this.usersService.registerUser(body);
            this.logger.log([body])
        } catch (e) {
            this.logger.error(
                `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getMe(@ReqUser() user: usersInterface): Promise<userEntyty> {
        return user
    }

    @Put('update')
    @ApiBody({
        type: updateUserDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        type: updateUserEntyty
    })
    async updateUser(
        @ReqUser() user: usersInterface,
        @Body() update: updateUserDto
    ): Promise<void> {
        try {
            await this.usersService.updateUser(user.userId, update);
        } catch (e) {
            this.logger.error(
                `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Put('change-password')
    @ApiBody({
        type: changePasswordDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        type: ChangePasswordEntyty
    })
    async changePassword(
        @ReqUser() user: usersInterface,
        @Body(ChangePasswordUserValidationPipe) body: changePasswordDto
    ): Promise<void> {
        try {
            await this.usersService.changePasswordUser(user.userId, body.hashPassword);
        } catch (e) {
            this.logger.error(
                `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Get('report-new-user')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async reportNewUser(): Promise<usersInterface> {
        try {
            const newUsers = await this.usersService.findNewUser();
            if (!Array.isArray(newUsers) || newUsers.length === 0) {
                throw new BadRequestException('No new users found');
            }
            return newUsers;
        } catch (e) {
            this.logger.error(
                `catch on report-new-user: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Put('ban-user/:userId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Success'
    })
    async banUser(@Param('userId') userId: string): Promise<void> {
        try {
            const user = await this.usersService.banUser(userId)
            if (!user) {
                throw new BadRequestException('User Id Not found');
            }

            return;
        } catch (e) {
            this.logger.error(
                `catch on ban-user: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Put('un-ban-user/:userId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Success'
    })
    async unBanUser(@Param('userId') userId: string): Promise<void> {
        try {
            const user = await this.usersService.unBanUser(userId)
            if (!user) {
                throw new BadRequestException('User Id Not found');
            }
            return;
        } catch (e) {
            this.logger.error(
                `catch on un-ban-user: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }
}