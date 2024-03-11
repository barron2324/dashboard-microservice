import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common'
import { BooksService } from '../../books/books.service'
import { BooksStockService } from '../books-stock.service'
import { CreateBookStockDTO } from '../dto/create-book-stock.dto'
import { BooksStockInterface } from '../interfaces/books-stock.interface'
import { BooksInterface } from '../../books/interfaces/books.interface'


@Injectable()
export class addBooksStockValidationPipe implements PipeTransform {
    private readonly logger = new Logger(addBooksStockValidationPipe.name)

    constructor(
        private readonly booksService: BooksService,
        private readonly booksStockService: BooksStockService,
    ) { }

    async transform(bookId: string): Promise<BooksStockInterface> {
        let stock: BooksStockInterface
        try {
            stock = await this.booksStockService.getBookStockById(bookId)
        } catch (e) {
            this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
            throw new BadRequestException({
                message: `${e?.message ?? e}`,
            })
        }
        if (!stock) {
            this.logger.error(`catch on stock: stock ${bookId} not found`)
            throw new BadRequestException({
                message: `${bookId} not found`,
            })
        }

        return stock
    }
}
