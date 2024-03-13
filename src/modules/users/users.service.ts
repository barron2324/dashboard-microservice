import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RMQService, USER_CMD } from "src/constants";
import { createUserDto } from "./dto/create-users.dto";
import { Observable, lastValueFrom } from "rxjs";
import { ChangePasswordEntyty } from "./entities/change-password.entity";
import { updateUserDto } from "./dto/update-user.dto";
import { usersInterface } from "./interfaces/users.interface";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    @Inject(RMQService.USERS) private readonly usersServiceQmq: ClientProxy

    async registerUser(body: createUserDto): Promise<Observable<any>> {
        return this.usersServiceQmq.emit(
            {
                cmd: USER_CMD,
                method: 'register',
            },
            body,
        )
    }

    changePasswordUser(userId: string, hashPassword: string): Observable<ChangePasswordEntyty> {
        return this.usersServiceQmq.emit(
            {
                cmd: USER_CMD,
                method: 'changePassword',
            },
            {
                userId,
                hashPassword
            }
        )
    }

    updateUser(userId: string, update: updateUserDto): Observable<any> {
        return this.usersServiceQmq.emit(
            {
                cmd: USER_CMD,
                method: 'updateUser',
            },
            {
                userId,
                update
            }
        )
    }

    findNewUser(): Promise<usersInterface> {
        return lastValueFrom(
            this.usersServiceQmq.send(
                {
                    cmd: USER_CMD,
                    method: 'find-new-user'
                },
                {}
            )
        )
    }

    banUser(userId: string): Observable<any> {
        return this.usersServiceQmq.emit(
            {
                cmd: USER_CMD,
                method: 'ban-user',
            },
            userId
        )
    }

    unBanUser(userId: string): Observable<any> {
        return this.usersServiceQmq.emit(
            {
                cmd: USER_CMD,
                method: 'un-ban-user',
            },
            userId
        )
    }
}