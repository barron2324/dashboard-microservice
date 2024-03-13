import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query, UseGuards, } from "@nestjs/common";
import { BooksStockService } from "./books-stock.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateBookStockDTO } from "./dto/create-book-stock.dto";
import { createBooksStockValidationPipe } from "./pipe/add-books-stock-validation.pipe";
import { addBooksInStockDto } from "./dto/add-book-stock.dto";
import { addBooksStockValidationPipe } from "./pipe/update-book-in-stock-validation.pipe";
import { BooksStockInterface } from "./interfaces/books-stock.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksStockEntity } from "./entities/books-stock.entity";
import { BooksStockQueryDto } from "./dto/books-stock-query.dto";
import BooksStockQueryEntity from "./entities/books-stock-query.entity";
import { BooksStockCategoryUtil } from "../utils/books-stock";

@Controller('books-stock')
@ApiTags('books-stock')
export class BooksStockController {
    private readonly logger = new Logger(BooksStockController.name)

    constructor(
        private readonly booksStockService: BooksStockService
    ) { }

    @Get('pagination')
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: BooksStockQueryEntity,
    })
    async getPagination(
        @Query() query: BooksStockQueryDto,
    ): Promise<BooksStockQueryEntity> {
        const { filter, category, kSort, bookName } = query

        query.filter = BooksStockCategoryUtil.getQueryByCategory(category)

        query.sort = BooksStockCategoryUtil.sort(kSort)

        if(bookName) {
            filter.bookName = { $regex: `${bookName}` }
        }

        try {
            query.perPage = 5
            return this.booksStockService.getPagination(query)
        } catch (e) {
            this.logger.error(
                `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Get('get-all-books-in-stock')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getAllBooksInStock(): Promise<BooksStockInterface> {
        try {
            return await this.booksStockService.getAllBooksInStock()
        } catch (e) {
            this.logger.error(
                `catch on get-all-books-in-stock: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Post('create-book-to-stock')
    @ApiBody({
        type: CreateBookStockDTO
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createBookToStock(@Body(createBooksStockValidationPipe) body: CreateBookStockDTO): Promise<void> {
        try {
            await this.booksStockService.createBookToStock(body)
        } catch (e) {
            this.logger.error(
                `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Put('add-book-in-stock/:bookId')
    @ApiParam({
        type: String,
        name: 'bookId',
    })
    @ApiBody({
        type: addBooksInStockDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async addBookInStock(
        @Param('bookId', addBooksStockValidationPipe) addStock: BooksStockInterface,
        @Body() body: addBooksInStockDto
        ): Promise<void> {
        try {
            await this.booksStockService.addBookToStock(addStock, body.quantity)
        } catch (e) {
            this.logger.error(
                `catch on add-book-to-stock: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Delete('delete-book-in-stock/:bookId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Success'
    })
    async deleteBookInStock(@Param('bookId') bookId: string): Promise<void> {
        try {
            await this.booksStockService.deleteBookToStock(bookId)
        } catch (e) {
            this.logger.error(
                `catch on delete-book-in-stock: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }
}