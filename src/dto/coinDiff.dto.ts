import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CoinDiffDTO {
  @IsNotEmpty()
  @IsString()
  coins: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}
