import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "src/config/configuration";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { throttlerAsyncOptions, throttlerServiceProvider } from "src/throttler.providers";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtRoleGuard } from "../auth/guards/jwt-role.guard";
import { CacheModule } from "@nestjs/cache-manager";
import RegisterCacheOptions from "src/cache.providers";
import { CategoryModule } from "../category/category.module";
import { BooksModule } from "../books/books.module";
import { BooksStockModule } from "../books-stock/books-stock.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true
        }),
        CacheModule.registerAsync(RegisterCacheOptions),
        ThrottlerModule.forRootAsync(throttlerAsyncOptions),
        AuthModule,
        UsersModule,
        CategoryModule,
        BooksModule,
        BooksStockModule
    ],
    providers: [
        throttlerServiceProvider,
        {
            provide: APP_GUARD,
            useClass: JwtRoleGuard,
        },
    ],
})

export class AppModule { }