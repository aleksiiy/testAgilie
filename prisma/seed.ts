import { PrismaClient } from '@prisma/client';
import { IAccount } from '../src/interfaces/account.interface';
import { IMoney } from '../src/interfaces/money.interface';
import { ICrypto } from '../src/interfaces/crypto.interface';

const prisma = new PrismaClient();

const accounts: IAccount[] = [
  {
    id: 1,
    name: 'Nexus',
  },
  {
    id: 2,
    name: 'Max',
  },
  {
    id: 3,
    name: 'Stefan',
  },
];

const cryptocurrencies: ICrypto[] = [
  {
    id: 1,
    name: 'Bitcoin',
    shortName: 'BTC',
  },
  {
    id: 2,
    name: 'Bitcoin Cash',
    shortName: 'BCH',
  },
  {
    id: 3,
    name: 'Ethereum',
    shortName: 'ETH',
  },
];

const money: IMoney[] = [
  {
    id: 1,
    cryptoId: 1,
    cryptoValue: 1515,
    accountId: 1,
    fiatCurrency: 'USD',
    fiatCurrencyValue: 151,
  },
  {
    id: 2,
    cryptoId: 2,
    cryptoValue: 2525,
    accountId: 2,
    fiatCurrency: 'USD',
    fiatCurrencyValue: 252,
  },
  {
    id: 3,
    cryptoId: 3,
    cryptoValue: 3535,
    accountId: 3,
    fiatCurrency: 'USD',
    fiatCurrencyValue: 353,
  },
];

async function main() {
  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { id: acc.id },
      update: {},
      create: {
        name: acc.name,
      },
    });
  }
  for (const cryptocurrency of cryptocurrencies) {
    await prisma.crypto.upsert({
      where: { id: cryptocurrency.id },
      update: {},
      create: {
        name: cryptocurrency.name,
        shortName: cryptocurrency.shortName,
      },
    });
  }
  const resultCr = await prisma.crypto.findMany();
  const resultAcc = await prisma.account.findMany();
  for (const m of money) {
    await prisma.money.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        cryptoId: resultCr[m.id - 1].id,
        cryptoValue: m.cryptoValue,
        accountId: resultAcc[m.accountId - 1].id,
        fiatCurrency: m.fiatCurrency,
        fiatCurrencyValue: m.fiatCurrencyValue,
      },
    });
  }
	let i = 1
	for(const fiat of ['USD', 'EUR', 'CAD', 'JPY', 'GBP', 'CHF', 'AUD']) {
		await prisma.exchange.upsert({
			where: { id: i },
			update: {},
			create: {
				id: i,
				cryptoId: 1,
				fiatCurrency: fiat,
				exchangeRates: 0.0,
			},
		});
		i++;
	}
	for(const fiat of ['USD', 'EUR', 'JPY', 'GBP', 'AUD']) {
		await prisma.exchange.upsert({
			where: { id: i },
			update: {},
			create: {
				id: i,
				cryptoId: 2,
				fiatCurrency: fiat,
				exchangeRates: 0.0,
			},
		});
		i++;
	}
	for(const fiat of ['USD', 'EUR', 'CAD', 'JPY', 'GBP', 'CHF', 'AUD']) {
		await prisma.exchange.upsert({
			where: { id: i },
			update: {},
			create: {
				id: i,
				cryptoId: 3,
				fiatCurrency: fiat,
				exchangeRates: 0.0,
			},
		});
		i++;
	}
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
