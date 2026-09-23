import 'dotenv/config';

function getPort(value: string | undefined): number {
  const port = Number(value ?? 3001);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port');
  }

  return port;
}

function getRequiredEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export const env = {
  port: getPort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
  wsPath: '/ws',
  jwtSecret: getRequiredEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
} as const;
