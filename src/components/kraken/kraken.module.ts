import { Module } from '@nestjs/common';
import { ISubscription } from '../../interfaces/subscription.interface';
import { KrakenService } from './kraken.service';
import { ExchangeService } from '../exchange/exchange.service';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
	providers: [KrakenService, ExchangeService, CryptoService, PrismaService],
	exports: [KrakenService]
})
export class KrakenModule {
	private readonly subscriptions: ISubscription[] = [
		{
			crypto: 'BTC',
			pair: '["BTC/USD","BTC/EUR","BTC/CAD","BTC/JPY","BTC/GBP","BTC/CHF","BTC/AUD"]',
		},
		{
			crypto: 'BCH',
			pair: '["BCH/USD","BCH/EUR","BCH/JPY","BCH/GBP","BCH/AUD"]',
		},
		{
			crypto: 'ETH',
			pair: '["ETH/USD","ETH/EUR","ETH/CAD","ETH/JPY","ETH/GBP","ETH/CHF","ETH/AUD"]',
		},
	];

	constructor(private KrakenService: KrakenService) {
		this.init();
	}

	private async init() {
		await this.KrakenService.init(this.subscriptions);
		this.subscribeToStream();
	}

	private subscribeToStream(): void {
		this.subscriptions.forEach((sub: ISubscription) => {
			this.KrakenService.start(sub, () => {
				this.resubscribe(sub);
			});
		});
		console.log("Stream up");
	}
	private resubscribe(subscription: ISubscription): void {
		this.KrakenService.start(subscription, () => {
			console.log(`Resubscribe drop, subscription: ${subscription.crypto}`);
		});
	}
}
