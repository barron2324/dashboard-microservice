import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { BOOKSSTOCK_CMD, RMQService } from "src/constants";
import { BooksStockInterface } from "./interfaces/books-stock.interface";
import { Observable, lastValueFrom } from "rxjs";
import { CreateBookStockDTO } from "./dto/create-book-stock.dto";
import { BooksStockQueryDto } from "./dto/books-stock-query.dto";
import { PaginationResponseInterface } from "src/interfaces/pagination.interface";
import { BooksStockEntity } from "./entities/books-stock.entity";

@Injectable()
export class BooksStockService {
    constructor(
        @Inject(RMQService.BOOKS) private readonly stockServiceRMQ: ClientProxy
    ) {
    }

    getAllBooksInStock(): Promise<BooksStockInterface> {
        return lastValueFrom(
            this.stockServiceRMQ.send(
                {
                    cmd: BOOKSSTOCK_CMD,
                    method: 'get-all-books-in-stock'
                },
                {}
            )
        )
    }

    getBookStockById(bookId: string): Promise<BooksStockInterface> {
        return lastValueFrom(
            this.stockServiceRMQ.send(
                {
                    cmd: BOOKSSTOCK_CMD,
                    method: 'get-book-stock-by-id'
                },
                bookId
            )
        )
    }

    createBookToStock(body: CreateBookStockDTO): Observable<any> {
        return this.stockServiceRMQ.emit(
            {
                cmd: BOOKSSTOCK_CMD,
                method: 'create-book-to-stock'
            },
            {
                bookId: body.bookId,
                bookName: body.book.bookName,
                category: body.book.category,
                quantity: body.quantity
            }
        )
    }

    addBookToStock(addStock: BooksStockInterface, quantity: number): Observable<any> {
        return this.stockServiceRMQ.emit(
            {
                cmd: BOOKSSTOCK_CMD,
                method: 'add-book-in-stock'
            },
            {
                addStock,
                quantity
            }
        )
    }

    deleteBookToStock(bookId: string): Observable<any> {
        return this.stockServiceRMQ.send(
            {
                cmd: BOOKSSTOCK_CMD,
                method: 'delete-book-in-stock'
            },
            bookId
        )
    }

    async getPagination(
        query: BooksStockQueryDto,
    ): Promise<PaginationResponseInterface<BooksStockEntity>> {
        return lastValueFrom(
            this.stockServiceRMQ.send(
                {
                    cmd: BOOKSSTOCK_CMD,
                    method: 'getPagination',
                },
                query,
            ),
        )
    }
}