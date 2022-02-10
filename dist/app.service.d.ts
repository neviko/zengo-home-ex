import { HttpService } from '@nestjs/axios';
import { CoinDiffDTO } from './dto/coinDiff.dto';
import { ConfigService } from 'nestjs-dotenv';
export declare class AppService {
    private httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getCoinsPercentagesDiff({ coins, date }: CoinDiffDTO): Promise<{}>;
    getCurrCoinValues(coins: any): Promise<any>;
    getPastCoinValues(date: any, coins: any): Promise<any>;
    dateValidator(date: any): boolean;
    filterByCoinName(csvData: any, coins: any): any;
    getPriceDiff(curr: any, past: any): {};
}
