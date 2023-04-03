import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './components/prisma/prisma.module';
import { CryptoController } from './components/crypto/crypto.controller';
import { CryptoService } from './components/crypto/crypto.service';
import { ExchangeService } from './components/exchange/exchange.service';
import { ExchangeController } from './components/exchange/exchange.controller';
import { SchedulerService } from './services/scheduler.service';
import { KrakenModule } from './components/kraken/kraken.module';

@Module({
  imports: [PrismaModule, KrakenModule],
  controllers: [CryptoController, ExchangeController],
  providers: [AppService, CryptoService, ExchangeService, SchedulerService],
})
export class AppModule {
	constructor(private schedulerService: SchedulerService) {
		if (this.schedulerService.init(`0 0 * * *`)) {
			this.schedulerService.start();
		}
	}
}
