import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CoinDiffDTO } from './dto/coinDiff.dto';
import * as moment from 'moment';
import { ConfigService } from 'nestjs-dotenv';

const BASE_URL = 'https://min-api.cryptocompare.com';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService
    ) {
      console.log(this.configService.get('SECRET_KEY'))
    }

  async getCoinsPercentagesDiff({ coins, date }: CoinDiffDTO) {
    if (!this.dateValidator(date)) {
      throw new BadRequestException('required PAST date format: YYYY-MM-DD');
    }
    const currList = await this.getCurrCoinValues(coins);
    const pastList = await this.getPastCoinValues(date, coins);

    return this.getPriceDiff(currList, pastList);
  }

  async getCurrCoinValues(coins): Promise<any> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get(
          `${BASE_URL}/data/pricemulti?fsyms=${coins}&tsyms=USD`,
          {
            headers: {
              Authorization: `Apikey ${process.env.SECRET_KEY}`,
            },
          },
        ),
      );
      if (!data || data.Data) {
        throw new BadRequestException(data.Message);
      }
      return data;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // yyyy-mm-dd format only
  async getPastCoinValues(date, coins): Promise<any> {
    let response
      const timestamp = new Date(date).getTime()
      coins = coins.toUpperCase()
      const coinsArr = coins.split(',')


      for (const coin of coinsArr) {
        try{
          const { data } = await lastValueFrom(
            this.httpService.get(
              `${BASE_URL}/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${timestamp}`,
              {
                headers: {
                  Authorization: `Apikey ${process.env.SECRET_KEY}`,
                },
              },
            ),
          );
    
          if (!data || data.Data) {
            response = {...response,...{[coin]:data.Message}}          
          }
          else{
            response = {...response,...data}
          }
          
        }
        catch(e){
          throw new InternalServerErrorException(e.message)
        }      
      }
      return response
  }

  dateValidator(date): boolean {
    return (
      moment(date, 'YYYY-MM-DD', true).isValid() &&
      moment(date).isBefore(moment(), 'day')
    );
  }

  filterByCoinName(csvData, coins): any {
    const prices = {};
    csvData.forEach((rowItem) => {
      const row = rowItem.split(',');
      if (
        row[3] === 'USDT' &&
        coins.find((item) => {
          return item.toUpperCase() === row[2];
        })
      ) {
        prices[row[2]] = { USD: row[4] };
      }
    });
    return prices;
  }

  getPriceDiff(curr, past) {
    const diffs = {};
    Object.keys(past).forEach((coin) => {
      const currPrice = curr[coin]?.USD;
      const pastPrice = past[coin]?.USD;
      if (!pastPrice) {
        diffs[coin] =past[coin]
      } else {
        diffs[coin] =
          (((currPrice - pastPrice) / currPrice) * 100).toFixed(2) + '%';
      }
    });

    return diffs;
  }
}
