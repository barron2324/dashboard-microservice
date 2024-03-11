import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDTO {
    @ApiProperty({
        type: String,
        example: 'Attack On Titan',
        required: true
    })
    categoryName: string
}