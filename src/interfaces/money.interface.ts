import { ICrypto } from './crypto.interface';
import { IAccount } from './account.interface';

export interface IMoney {
  id?: number;
  crypto?: ICrypto;
  cryptoId: number;
  cryptoValue: number;
  account?: IAccount;
  accountId: number;
  fiatCurrency: string;
  fiatCurrencyValue: number;
  createdAt?: Date;
  updateAt?: Date;
}
