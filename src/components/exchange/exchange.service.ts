import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaService } from '../prisma/prisma.service';
import { ICrypto } from '../../interfaces/crypto.interface';
import { getExchangeRateInterface } from '../../interfaces/exchange.interface';

@Injectable()
export class ExchangeService {

	constructor(
		private cryptoService: CryptoService,
		private prismaService: PrismaService) {}

	async getExchangeRate(crypto: string | string[], fiat: string | string[]): Promise<getExchangeRateInterface[]> {
		try {
			const cryptocurrencies: ICrypto[] = await this.prismaService.crypto.findMany({
				where: {
					OR: this.buildQueryCrypto('shortName', typeof crypto === 'string' ? [crypto] : crypto),
				}
			});

			return this.prismaService.exchange.findMany({
				where: {
					OR: this.buildQueryExchange(cryptocurrencies, typeof fiat === 'string' ? [fiat] : fiat)
				},
				select: {
					fiatCurrency: true,
					exchangeRates: true,
					crypto: true
				}
			});
		} catch (e) {
			console.log("ExchangeService", e);
			throw e;
		}
	}

	async updateRate(shortName: string, fiat: string, rate: number): Promise<void> {
		try {
			const crypto = await this.cryptoService.findByShortName(shortName);
			const exchange = await this.prismaService.exchange.findFirst({
				where: {
					cryptoId: crypto.id,
					fiatCurrency: fiat
				}
			});
			await this.prismaService.exchange.update({
				where: {
					id: exchange.id
				},
				data: {
					exchangeRates: rate
				}
			})
		} catch (e) {
			console.log("ExchangeService", e);
			throw e;
		}
	}

	private buildQueryCrypto(key: string, values: string[]) {
		return values.map((a: string) => {
			return {[key]: a}
		});
	}

	private buildQueryExchange(cryptoCurrencies: ICrypto[], values: string[]) {
		let res = []
		for (const cryptoCurrency of cryptoCurrencies) {
			for (const value of values) {
				res.push({
					cryptoId: cryptoCurrency.id,
					fiatCurrency: value
				})
			}
		}
		return res;
	}
}
