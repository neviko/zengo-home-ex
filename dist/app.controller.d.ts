import { AppService } from './app.service';
import { CoinDiffDTO } from './dto/coinDiff.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getCoinDiff(query: CoinDiffDTO): any;
}
