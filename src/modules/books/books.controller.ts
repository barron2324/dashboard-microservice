import { Body, Controller, Get, InternalServerErrorException, Logger, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { CreateBooksDTO } from "./dto/create-books.dto";
import { CreateBooksValidationPipe } from "./pipe/create-book-validation.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksInterface } from "./interfaces/books.interface";

@Controller('books')
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BooksController {
    private readonly logger = new Logger(BooksController.name)

    constructor(
        private readonly booksService: BooksService
    ) { }

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
}