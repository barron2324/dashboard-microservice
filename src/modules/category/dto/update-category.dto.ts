import { ApiProperty } from "@nestjs/swagger";

export class updateCategoryDTO {
    @ApiProperty({
        example: 'categoryId',
        required: true
    })
    categoryId: string;

    @ApiProperty({
        example: 'categoryName',
        required: true
    })
    categoryName: string;
}