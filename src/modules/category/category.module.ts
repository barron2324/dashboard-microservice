import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { RMQService } from "src/constants";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
    imports: [
        JwtModule,
        PassportModule,
        CacheModule.register(),
        ClientsModule.register([
            {
                name: RMQService.BOOKS,
                transport: Transport.RMQ,
                options: {
                    urls: [
                        'amqps://daqcshnj:1HWgbSh6zkDW-EUEoGZ_v52YHC1Dm3L9@armadillo.rmq.cloudamqp.com/daqcshnj'
                    ],
                    noAck: true,
                    queue: RMQService.BOOKS,
                    queueOptions: {
                        durable: true
                    },
                }
            }
        ])
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }