import { IMoney } from './money.interface';

export interface ICrypto {
  id?: number;
  name: string;
  shortName: string;
  money?: IMoney[];
  createdAt?: Date;
  updateAt?: Date;
}
