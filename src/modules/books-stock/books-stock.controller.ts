import { Body, Controller, Get, InternalServerErrorException, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BooksStockService } from "./books-stock.service";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateBookStockDTO } from "./dto/create-book-stock.dto";
import { createBooksStockValidationPipe } from "./pipe/add-books-stock-validation.pipe";
import { addBooksInStockDto } from "./dto/add-book-stock.dto";
import { addBooksStockValidationPipe } from "./pipe/update-book-in-stock-validation.pipe";
import { BooksStockInterface } from "./interfaces/books-stock.interface";

@Controller('books-stock')
@ApiTags('books-stock')
export class BooksStockController {
    private readonly logger = new Logger(BooksStockController.name)

    constructor(
        private readonly booksStockService: BooksStockService
    ) { }

    @Get('get-all-books-in-stock')
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
    async createBookToStock(@Body(createBooksStockValidationPipe) body: CreateBookStockDTO): Promise<void> {
        try {
            await this.booksStockService.createBookToStock(body)
            this.logger.log([body])
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
}