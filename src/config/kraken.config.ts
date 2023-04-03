import { IKraken } from '../interfaces/kraken.interface';
require('dotenv').config()

export const data: IKraken = {
  krakenApiKey: process.env.KRAKEN_API_KEY || '',
  krakenApiSecretKey: process.env.KRAKEN_API_SECRET_KEY || '',
  publicWebSocketURL: process.env.KRAKEN_WEB_SOCKET_URL || '',
};

export default data;
