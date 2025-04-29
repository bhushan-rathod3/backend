import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
