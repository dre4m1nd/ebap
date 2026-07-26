import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  baseUrl: process.env.ELECTRIC_API_BASE_URL || '',
  timeout: parseInt(process.env.ELECTRIC_API_TIMEOUT || '10000', 10),
}));
