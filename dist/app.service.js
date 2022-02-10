"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const moment = require("moment");
const nestjs_dotenv_1 = require("nestjs-dotenv");
const BASE_URL = 'https://min-api.cryptocompare.com';
let AppService = class AppService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        console.log(this.configService.get('SECRET_KEY'));
    }
    async getCoinsPercentagesDiff({ coins, date }) {
        if (!this.dateValidator(date)) {
            throw new common_1.BadRequestException('required PAST date format: YYYY-MM-DD');
        }
        const currList = await this.getCurrCoinValues(coins);
        const pastList = await this.getPastCoinValues(date, coins);
        return this.getPriceDiff(currList, pastList);
    }
    async getCurrCoinValues(coins) {
        try {
            const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${BASE_URL}/data/pricemulti?fsyms=${coins}&tsyms=USD`, {
                headers: {
                    Authorization: `Apikey ${process.env.SECRET_KEY}`,
                },
            }));
            if (!data || data.Data) {
                throw new common_1.BadRequestException(data.Message);
            }
            return data;
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
    async getPastCoinValues(date, coins) {
        let response;
        const timestamp = new Date(date).getTime();
        coins = coins.toUpperCase();
        const coinsArr = coins.split(',');
        for (const coin of coinsArr) {
            try {
                const { data } = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${BASE_URL}/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${timestamp}`, {
                    headers: {
                        Authorization: `Apikey ${process.env.SECRET_KEY}`,
                    },
                }));
                if (!data || data.Data) {
                    response = Object.assign(Object.assign({}, response), { [coin]: data.Message });
                }
                else {
                    response = Object.assign(Object.assign({}, response), data);
                }
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
        return response;
    }
    dateValidator(date) {
        return (moment(date, 'YYYY-MM-DD', true).isValid() &&
            moment(date).isBefore(moment(), 'day'));
    }
    filterByCoinName(csvData, coins) {
        const prices = {};
        csvData.forEach((rowItem) => {
            const row = rowItem.split(',');
            if (row[3] === 'USDT' &&
                coins.find((item) => {
                    return item.toUpperCase() === row[2];
                })) {
                prices[row[2]] = { USD: row[4] };
            }
        });
        return prices;
    }
    getPriceDiff(curr, past) {
        const diffs = {};
        Object.keys(past).forEach((coin) => {
            var _a, _b;
            const currPrice = (_a = curr[coin]) === null || _a === void 0 ? void 0 : _a.USD;
            const pastPrice = (_b = past[coin]) === null || _b === void 0 ? void 0 : _b.USD;
            if (!pastPrice) {
                diffs[coin] = past[coin];
            }
            else {
                diffs[coin] =
                    (((currPrice - pastPrice) / currPrice) * 100).toFixed(2) + '%';
            }
        });
        return diffs;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        nestjs_dotenv_1.ConfigService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map