import { Controller, Get, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ApiQuery } from '@nestjs/swagger';
import { CryptoRole, FiatRole } from './exchange.module';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get()
  @ApiQuery({ name: 'crypto', enum: CryptoRole, isArray: true})
  @ApiQuery({name: 'fiat', enum: FiatRole, isArray: true})
  getExchangeRate(
		@Query('crypto') crypto: string | string[],
		@Query('fiat') fiat: string | string[]) {
    return this.exchangeService.getExchangeRate(crypto, fiat);
  }
}
