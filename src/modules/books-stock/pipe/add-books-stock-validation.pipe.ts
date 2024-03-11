import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common'
import { BooksService } from '../../books/books.service'
import { BooksStockService } from '../books-stock.service'
import { CreateBookStockDTO } from '../dto/create-book-stock.dto'
import { BooksStockInterface } from '../interfaces/books-stock.interface'
import { BooksInterface } from '../../books/interfaces/books.interface'


@Injectable()
export class createBooksStockValidationPipe implements PipeTransform {
  private readonly logger = new Logger(createBooksStockValidationPipe.name)

  constructor(
    private readonly booksService: BooksService,
    private readonly booksStockService: BooksStockService,
  ) {}

  async transform(body: CreateBookStockDTO): Promise<CreateBookStockDTO> {
    let stock: BooksStockInterface
    try {
      this.logger.log(body)
      stock = await this.booksStockService.getBookStockById(body.bookId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (stock) {
      this.logger.error(`catch on create-book-in-stock: book ${body.bookId} is already`)
      throw new BadRequestException({
        message: `book ${body.bookId} is already`,
      })
    }

    let book: BooksInterface
    try {
      book = await this.booksService.getBookById(body.bookId)
      this.logger.log(book)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!book) {
      this.logger.error(
        `catch on find addStock: books ${body.bookId} not found`,
      )
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      })
    }

    body.book = book
    return body
  }
}
