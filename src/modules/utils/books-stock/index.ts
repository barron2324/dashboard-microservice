import { ESortBooksQuery } from "src/modules/books/dto/books-query.dto"
import CategoryBooksStockEnum from "./eunm/category.enum"

export class BooksStockCategoryUtil {
    static getQueryByCategory(key: string, query?: Record<string, any>) {
        if (key === CategoryBooksStockEnum.ALL) {
            return { ...query }
        }

        if (key === CategoryBooksStockEnum.ACTION) {
            return {...query, category: CategoryBooksStockEnum.ACTION}
        }

        if (key === CategoryBooksStockEnum.ADVENTURE) {
            return {...query, category: CategoryBooksStockEnum.ADVENTURE}
        }

        if (key === CategoryBooksStockEnum.BUSINESS) {
            return {...query, category: CategoryBooksStockEnum.BUSINESS}
        }

        if (key === CategoryBooksStockEnum.COMEDY) {
            return {...query, category: CategoryBooksStockEnum.COMEDY}
        }

        if (key === CategoryBooksStockEnum.CRAFTS) {
            return {...query, category: CategoryBooksStockEnum.CRAFTS}
        }

        if (key === CategoryBooksStockEnum.CRIME) {
            return {...query, category: CategoryBooksStockEnum.CRIME}
        }

        if (key === CategoryBooksStockEnum.DRAMA) {
            return {...query, category: CategoryBooksStockEnum.DRAMA}
        }

        if (key === CategoryBooksStockEnum.GUIDE) {
            return {...query, category: CategoryBooksStockEnum.GUIDE}
        }

        if (key === CategoryBooksStockEnum.HEALING) {
            return {...query, category: CategoryBooksStockEnum.HEALING}
        }

        if (key === CategoryBooksStockEnum.HUMOR) {
            return {...query, category: CategoryBooksStockEnum.HUMOR}
        }

        if (key === CategoryBooksStockEnum.JOURNAL) {
            return {...query, category: CategoryBooksStockEnum.JOURNAL}
        }

        if (key === CategoryBooksStockEnum.JOURNAL) {
            return {...query, category: CategoryBooksStockEnum.JOURNAL}
        }

        if (key === CategoryBooksStockEnum.MUSIC) {
            return {...query, category: CategoryBooksStockEnum.MUSIC}
        }

        if (key === CategoryBooksStockEnum.ROMANTIC) {
            return {...query, category: CategoryBooksStockEnum.ROMANTIC}
        }
        
        if (key === CategoryBooksStockEnum.SPORTS) {
            return {...query, category: CategoryBooksStockEnum.SPORTS}
        }

        if (key === CategoryBooksStockEnum.TRAVEL) {
            return {...query, category: CategoryBooksStockEnum.TRAVEL}
        }
    }

    static sort(key: string) {
        if (key === ESortBooksQuery.PRICE_DESC) {
            return { price: 'desc' }
        }
        if (key === ESortBooksQuery.PRICE_ASC) {
            return { price: 'asc' }
        }
        if (key === ESortBooksQuery.QUANTITY_ASC) {
            return { quantity: 'asc' }
        }
        if (key === ESortBooksQuery.QUANTITY_DESC) {
            return { quantity: 'desc' }
        }
    }
}