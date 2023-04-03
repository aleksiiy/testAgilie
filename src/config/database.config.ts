import { IDataBase } from '../interfaces/database.interface';
require('dotenv').config();

export const data: IDataBase = {
  pgNameDB: process.env.PG_NAME_DB || '',
  pgUser: process.env.PG_USER || '',
  pgPassword: process.env.PG_PASSWORD || '',
};

export default data;
