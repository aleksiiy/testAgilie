import { Injectable } from '@nestjs/common';
import { PrismaService } from '../components/prisma/prisma.service';
const cron = require('node-cron');

@Injectable()
export class SchedulerService {
	private time: string;
	constructor(private prismaService: PrismaService) {}

	init(time: string): boolean {
		this.time = time;
		return cron.validate(time);
	}

	start() {
		const task = cron.schedule(this.time, async () => {
			console.log('***** SchedulerService start ******');
			try {
				await this.prismaService.$queryRaw`
	        UPDATE "Money" m SET "fiatCurrencyValue" = m."cryptoValue" * e."exchangeRates"
	            FROM "Exchange" e WHERE e."cryptoId" = m."cryptoId"
	                                AND e."fiatCurrency" = m."fiatCurrency";`;
				console.log('***** SchedulerService start ******');
			} catch (e) {
				console.log("SchedulerService:", e);
			}
		}, {
			scheduled: false
		});
		task.start();
	}
}
