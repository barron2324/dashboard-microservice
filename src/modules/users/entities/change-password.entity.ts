import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordEntyty {
    @ApiProperty({
        example: 'hash password',
        type: String
    })
    password: string
}