export interface BooksStockInterface {
    bookId: string
    bookName: string
    quantity: number
    category: string
    totalQuantity: number
    quantityBought: number
    totalOrder: number
    lastOrderAt: Date
    quantityUpdateAt: Date
    isAvailable: boolean
}