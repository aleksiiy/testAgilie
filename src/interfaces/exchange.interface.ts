import { ICrypto } from './crypto.interface';

export interface getExchangeRateInterface {
	fiatCurrency: string,
	exchangeRates: number,
	crypto: ICrypto
}

export interface findAllExchangeInterface {
	id: number;
	cryptoId: number;
	fiatCurrency: string;
	exchangeRates: number;
}
