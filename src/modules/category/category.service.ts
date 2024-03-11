import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CATEGORY_CMD, RMQService } from "src/constants";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { Observable, lastValueFrom } from "rxjs";
import { CategoryInterface } from "./interfaces/category.interface";

@Injectable()
export class CategoryService {
    constructor(
        @Inject(RMQService.BOOKS) private readonly categoryServiceRMQ: ClientProxy
    ) { }

    createCategoryBook(body: { categoryName: string }): Observable<any> {
        return this.categoryServiceRMQ.emit(
            {
                cmd: CATEGORY_CMD,
                method: 'create-category-book',
            },
            body,
        )
    }

    updateCategoryBook(body: { categoryId: string, categoryName: string }): Observable<any> {
        return this.categoryServiceRMQ.emit(
            {
                cmd: CATEGORY_CMD,
                method: 'update-category-book',
            },
            body,
        )
    }

    getAllCategory(): Promise<CategoryInterface> {
        return lastValueFrom(
            this.categoryServiceRMQ.send(
                {
                    cmd: CATEGORY_CMD,
                    method: 'get-all-category'
                },
                {}
            )
        )
    }

    getCategoryByCategoryName(categoryName: string): Promise<CategoryInterface> {
        return lastValueFrom(
            this.categoryServiceRMQ.send(
                {
                    cmd: CATEGORY_CMD,
                    method: 'get-category-by-categoryName'
                },
                categoryName
            )
        )
    }
}