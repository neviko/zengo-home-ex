import { HttpService } from '@nestjs/axios';
import { CoinDiffDTO } from './dto/coinDiff.dto';
export declare class AppService {
    private httpService;
    constructor(httpService: HttpService);
    getCoinsPercentagesDiff({ coins, date }: CoinDiffDTO): Promise<{}>;
    getCurrCoinValues(coins: any): Promise<any>;
    getPastCoinValues(date: any, coins: any): Promise<string[]>;
    dateValidator(date: any): boolean;
    filterByCoinName(csvData: any, coins: any): any;
    getPriceDiff(curr: any, past: any): {};
}
