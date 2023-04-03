import { Injectable } from '@nestjs/common';
import kraken from '../../config/kraken.config';
import getLogTime from '../../helpers/getLogTime.helper';
import { ISubscription } from '../../interfaces/subscription.interface';
import { ExchangeService } from '../exchange/exchange.service';
const WebSocket = require('ws');

@Injectable()
export class KrakenService {
	// private readonly apiKey: string = kraken.krakenApiKey;
	// private readonly apiSecretKey: string = kraken.krakenApiSecretKey;
	private readonly publicWebSocketURL: string = kraken.publicWebSocketURL;
	private readonly urlRestApi: string = 'https://api.kraken.com/0/public/Ticker?pair=';

	constructor(private exchangeService: ExchangeService) {}

	async init(subs: ISubscription[]): Promise<void> {
		try {
			for (const sub of subs) {
				const {exchangeRate, str} = this.getPairValue(sub.pair);
				const result = await fetch(this.urlRestApi + str);
				if (result.ok) {
					const data = await result.json();
					if (data.error[0]) {
						console.log(str);
						continue;
					}
					for (const res of exchangeRate) {
						if (data.result[res]) {
							this.exchangeService.updateRate(sub.crypto, res.split('/')[1], +data.result[res]['a'][0])
						}
					}
				}
			}
		} catch (e) {
			console.log("KrakenService:", e);
		}
	}

	start(pWebSocketSubscription: ISubscription, callBack: Function): void {
		try {
			const webSocketClient = new WebSocket(this.publicWebSocketURL);

			webSocketClient.on('open', function open() {
				console.log(pWebSocketSubscription.pair);
				webSocketClient.send(`{"event":"subscribe","subscription":{"name":"trade"},"pair":${pWebSocketSubscription.pair}}`);
			});

			webSocketClient.on('message', (wsMsg: any) => {
				this.filterResponse(pWebSocketSubscription, wsMsg.toString());
			});

			webSocketClient.on('close', function close() {
				console.log("|==============================================|");
				console.log("|     END OF PROGRAM - HAVE A GOOD DAY :)      |");
				console.log("|==============================================|");
				console.log("\n");
			});

		}
		catch (e) {
			callBack();
			console.log("KrakenService:", e);
		}
	}

	private filterResponse(sub: ISubscription, msg: string): void {
		const data = JSON.parse(msg);
		if (!data.event && !data.channelID) {
			const crypto = sub.crypto;
			const rate = data[1][0][0];
			const fiat = data[3].split('/')[1];
			console.log(getLogTime(), `1 ${crypto} == ${+rate} ${fiat}`);
			this.exchangeService.updateRate(crypto, fiat, +rate);
		}
	}

	private getPairValue(str: string): { exchangeRate: string[], str: string } {
		return {
			exchangeRate: JSON.parse(str),
			str: JSON.parse(str).reduce((a: string | undefined, b: string) => {
				return !a ? b : `${a},${b}`;
			}, ""),
		}
	}
}
