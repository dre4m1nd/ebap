import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  baseUrl: process.env.ELECTRIC_API_BASE_URL || '',
  lightPath: process.env.ELECTRIC_API_LIGHT_PATH || '/electric/light?openId={openId}',
  airPath: process.env.ELECTRIC_API_AIR_PATH || '/electric/air?openId={openId}',
  timeout: parseInt(process.env.ELECTRIC_API_TIMEOUT || '10000', 10),
}));
