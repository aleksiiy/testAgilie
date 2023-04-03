import { IMoney } from './money.interface';

export interface IAccount {
  id?: number;
  name: string;
  money?: IMoney;
  createdAt?: Date;
  updateAt?: Date;
}
