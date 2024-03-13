import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { CreateBooksDTO } from "./dto/create-books.dto";
import { CreateBooksValidationPipe } from "./pipe/create-book-validation.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksInterface } from "./interfaces/books.interface";
import BooksQueryEntity from "./entities/books-query.entity";
import { BooksQueryDto } from "./dto/books-query.dto";
import { BooksCategoryUtil } from "../utils/books";

@Controller('books')
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BooksController {
    private readonly logger = new Logger(BooksController.name)

    constructor(
        private readonly booksService: BooksService
    ) { }

    @Get('pagination')
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: BooksQueryEntity,
    })
    async getPagination(
        @Query() query: BooksQueryDto,
    ): Promise<BooksQueryEntity> {
        const { category, kSort, bookName } = query

        query.filter = BooksCategoryUtil.getQueryByCategory(category)

        query.sort = BooksCategoryUtil.sort(kSort)

        if (bookName) {
            query.filter = { ...query.filter, bookName: { $regex: `${bookName}` } }
        }

        try {
            query.perPage = 5
            return this.booksService.getPagination(query)
        } catch (e) {
            this.logger.error(
                `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
            )
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Post('create-book')
    @ApiBody({
        type: CreateBooksDTO
    })
    async createBook(@Body(CreateBooksValidationPipe) body: CreateBooksDTO): Promise<void> {
        try {
            await this.booksService.createBook(body)
        } catch (e) {
            this.logger.error(`catch on create-book: ${e?.message ?? JSON.stringify(e)}`)
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Get('get-all-books')
    async getAllBooks(): Promise<BooksInterface> {
        try {
            return await this.booksService.getAllBooks()
        } catch (e) {
            this.logger.error(`catch on get-all-books: ${e?.message ?? JSON.stringify(e)}`)
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }

    @Delete('delete-book/:bookId')
    @ApiResponse({
        status: 200,
        description: 'Success'
    })
    async deleteBook(@Param('bookId') bookId: string): Promise<void> {
        try {
            await this.booksService.deleteBook(bookId)
        } catch (e) {
            this.logger.error(`catch on delete-book: ${e?.message ?? JSON.stringify(e)}`)
            throw new InternalServerErrorException({
                message: e?.message ?? e,
            })
        }
    }
}