import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CoinDiffDTO } from './dto/coinDiff.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/coins-compare')
  getCoinDiff(@Query(ValidationPipe) query: CoinDiffDTO): any {
    return this.appService.getCoinsPercentagesDiff(query);
  }
}
