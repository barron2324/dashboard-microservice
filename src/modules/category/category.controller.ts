import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { Payload } from "@nestjs/microservices";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { updateCategoryDTO } from "./dto/update-category.dto";
import { CategoryInterface } from "./interfaces/category.interface";

@Controller('category')
@ApiTags('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
    private readonly logger = new Logger(CategoryController.name)
    constructor(
        private readonly categoryService: CategoryService
    )
    {}

    @Get('get-all')
    @ApiBearerAuth()
    async getAllCategory(): Promise<CategoryInterface> {
        try {
            return await this.categoryService.getAllCategory()
        } catch (e) {
            this.logger.error(
                `catch on get-all: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Post('create-category-book')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        type: CreateCategoryDTO
    })
    async createCategoryBook(@Body() body: {categoryName: string} ): Promise<void> {
        try {
            await this.categoryService.createCategoryBook(body)
        } catch (e) {
            this.logger.error(
                `catch on create-category-book: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Put('update-category-book')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        type: updateCategoryDTO
    })
    async updateCategoryBook(
        @Body() update: { categoryId: string, categoryName: string },
    ): Promise<void> {
        try {
            await this.categoryService.updateCategoryBook(update);
            this.logger.log(update)
        } catch (e) {
            this.logger.error(
                `catch on update-category-book: ${e?.message ?? JSON.stringify(e)}`,
            );
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            });
        }
    }
}