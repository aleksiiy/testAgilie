import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService]
})
export class ExchangeModule {}

export enum CryptoRole {
	BTC = 'BTC',
	BCH = 'BCH',
	ETH = 'ETH',
}

export enum FiatRole {
	USD = 'USD',
	EUR = 'EUR',
	CAD = 'CAD',
	JPY = 'JPY',
	GBP = 'GBP',
	CHF = 'CHF',
	AUD = 'AUD',
}
